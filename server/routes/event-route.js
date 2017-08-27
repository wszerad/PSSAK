const store = require('express-dataio').middleware.store(require('../definitions/definitions'));
const ObjectID = require('mongodb').ObjectID;
const db = require('../db');
const utils = require('./route-utils');
const usagesActions = require('./usages-actions');
const log = require('./logs-utils').log;

function newEvent(date) {
	return {
		isNew: true,
		editable: true,
		date: date,
		gliders: [],
		instructors: [],
		start: []
	}
}

function getEvent(date, event, admin) {
	let dateLimit = new Date(date);
	dateLimit.setUTCHours(-8, 0, 0, 0);

	let editable = admin || dateLimit*1 > Date.now(),
		promises = [];

	if (event) {
		promises.push(event);
	} else {
		promises.push(db('events').findOne({date}));
	}

	promises.push(usagesActions.findDaily(date));
	promises.push(usagesActions.order(date));

	if (editable) {
		let filter = {};

		if(!admin || date*1 > Date.now()) {
			filter.active = true;
		}

		promises.push(db('starts')
			.find(filter)
			.toArray());
		promises.push(db('gliders')
			.find(filter)
			.toArray());
		promises.push(db('users')
			.find(Object.assign(filter, {
				instructor: true
			}))
			.project({
				_id: 1,
				name: 1,
			})
			.toArray());
	}

	return Promise
		.all(promises)
		.then(([event, usages, order, starts, gliders, instructors]) => {
			if (event) {
				event.isNew = false;
			} else if (!admin && date*1 < Date.now()) {
				return {};
			} else {
				event = newEvent(date);
			}

			let usable = event.gliders.reduce((gliders, glider) => {
				gliders[glider] = gliders[glider] || [];
				return gliders;
			}, {
				admin: []
			});

			event.editable = editable;
			return {
				event: event,
				order,
				available: {
					starts,
					gliders,
					instructors
				},
				usages: usages
					.reduce(function (usable, usage) {
						usable[usage.name].push(usage);

						return usable;
					}, usable)
			};
		});
}

module.exports = function (router) {

	router.post('/event', store(['date']), function (req, res, next) {
		let date = new Date(req.store.date);

		getEvent(date, null, req.hasPermission('admin'))
			.then(eventData => {
				res.reply.assign(eventData);
				next();
			})
			.catch(next);
	});

	router.delete('/event', store(['_id']), function (req, res, next) {
		let _id = new ObjectID(req.store._id);

		db('events')
			.findOne({
				_id
			})
			.then(doc => {
				let dateLimit = new Date(doc.date);
				dateLimit.setUTCHours(-8, 0, 0, 0);

				if(req.hasPermission('admin') || dateLimit*1 > Date.now()) {
					log(req.session.name, null, 'Usunięcie wydarzenia ' + doc.date.toISOString());
					return Promise.all([
						db('events').deleteOne({ _id }),
						usagesActions.deleteDaily(doc.date)
					]);
				} else {
					res.reply.set('message', 'Usunięcie wydarzenia musi zatwierdzić administrator');
					return Promise.all([
						db('events').updateOne({ _id }, {$set: {canceled: true}})
					]);
				}
			})
			.then(() => {
				next();
			})
			.catch(next);
	});

	router.put('/event', store(['event']), function (req, res, next) {
		let {event: {_id, date, gliders, instructors, start, note}} = req.store;
		let user = req.session.name;

		if (_id) {
			db('events')
				.findOneAndUpdate({
					_id: new ObjectID(_id)
				}, {
					$set: {
						updater: user,
						updated: new Date(),
						gliders,
						instructors,
						start,
						note
					}
				})
				.then(()=>{
					return usagesActions.deleteDailyForOtherGliders(gliders, date);
				})
				.then(()=>{
					next();
				})
				.catch(next);
		} else {
			date = new Date(date);

			if(!req.hasPermission('admin') && date*1 < Date.now()) {
				req.reply.error(400);
				next();
				return;
			}

			db('events')
				.insertOne({
					user,
					updater: null,
					updated: new Date(),
					date,
					gliders,
					instructors,
					start,
					note,
					canceled: false
				})
				.then((doc) => {
					log(req.session.name, null, 'Dodanie wydarzenia ' + date.toISOString());
					return getEvent(date, doc.ops[0], req.hasPermission('admin')).then(eventData => {
						res.reply
							.assign(eventData)
							.defaults({
								event: {
									isNew: false,
									editable: true
								}
							});
					});
				})
				.then(()=>{
					return usagesActions.deleteDailyForOtherGliders(gliders, date);
				})
				.then(()=>{
					next();
				})
				.catch(next);
		}
	});

	router.put('/usage', store(['usage']), function (req, res, next) {
		let {date, name: glider, range} = req.store.usage;
		let action;

		let todayLimit = new Date(date);
		todayLimit.setUTCHours(-4, 0, 0, 0);

		date = new Date(date);

		if(range === '') {
			if(todayLimit*1 < Date.now()) {
				res.reply.set('message', 'Minął czas na usunięcie użycia!')
				action = Promise.resolve();
			} else {
				action = usagesActions.remove(req.session.name, glider, date);
			}
		} else {
			action = usagesActions.updateOrAdd(req.session.name, date, glider, range);
		}

		action
			.then(function () {
				return usagesActions.findDailyForGlider(glider, date);
			})
			.then(function (usages) {
				res.reply.set('usages', usages);
				next();
			})
			.catch(next);
	});

	router.put('/usage/admin', store(['usage']), function (req, res, next) {
		req.permission('admin');

		let action;
		let {date, user, range} = req.store.usage;
		date = new Date(date);

		if(!range) {
			action = usagesActions.removeByAdmin(user, date);
			log(req.session.name, user, 'Usunięcie użytkowania szybowca ' + date.toISOString());
		} else {
			action = usagesActions.updateOrAddByAdmin(user, date);
			log(req.session.name, user, 'Dodanie użytkowania szybowca ' + date.toISOString());
		}

		action
			.then(function () {
				return usagesActions.findDailyForGlider('admin', date);
			})
			.then(function (usages) {
				res.reply.set('usages', usages);
				next();
			})
			.catch(next);
	});

};
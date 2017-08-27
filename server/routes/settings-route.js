const store = require('express-dataio').middleware.store(require('../definitions/definitions'));
const db = require('../db');
const usersActions = require('./users-actions');
const express = require('express');
const settingsRouter = express.Router();

module.exports = function (router) {
	router.use('/settings', function (req, res, next) {
		req.permission('admin');
		next();
	}, settingsRouter);

	//****************************GLIDERS***************************

	function gliders(req, res, next) {
		return db('gliders')
			.find()
			.toArray()
			.then((docs)=>{
				res.reply.set('gliders', docs);
				next();
			})
			.catch(next);
	}



	settingsRouter.get('/gliders', gliders);

	settingsRouter.post('/glider', store(['glider']), function (req, res, next) {
		let {glider: {_id, name, type, active}} = req.store;

		if(_id === name) {
			db('users')
				.updateOne({_id: _id}, {
					$set: {
						type,
						active
					}
				}, {upsert: true})
				.then(() => {
					next();
				})
				.catch(next);
		} else {
			Promise
				.all([
					_id? db('gliders').deleteOne({_id}) : null,
					db('gliders').insertOne({
						_id,
						name,
						type,
						active
					})
				])
				.then(()=>{
					next();
				})
				.catch(next)
		}

	}, gliders);

	settingsRouter.delete('/glider', store(['glider']), function (req, res, next) {
		let {glider: {_id}} = req.store;

		db('gliders')
			.deleteOne({_id})
			.then(() => {
				next();
			})
			.catch(next);
	}, gliders);

	//*****************************USERS****************************

	settingsRouter.get('/users', function(req, res, next) {
		return usersActions
			.all()
			.then(users => {
				res.reply.set('users', users);
				next();
			})
			.catch(next);
	});

	settingsRouter.post('/user', store(['user']), function (req, res, next) {
		const {user: {_id, name, email, admin, instructor, active}} = req.store;
		let action;

		if(admin) {
			req.permission('root');
		}

		if(!_id) {
			action = usersActions
				.add(name, email, admin, instructor, active)
		} else if (_id !== name) {
			action = usersActions
				.renameAndUpdate(_id, name, email, admin, instructor, active)
		} else {
			action = usersActions
				.update(name, email, admin, instructor, active)
		}

		action
			.then(() => {
				return usersActions.all();
			})
			.then(users => {
				res.reply.set('users', users);
				next();
			})
			.catch(next);
	});

	settingsRouter.delete('/user', store(['user']), function (req, res, next) {
		let {user: {_id}} = req.store;

		usersActions
			.findById(_id)
			.then(doc => {
				if(doc.admin) {
					req.permission('root');
				}

				return usersActions.remove(_id);
			})
			.then(() => {
				return usersActions.all();
			})
			.then(users => {
				res.reply.set('users', users);
				next();
			})
			.catch(next);
	});

};
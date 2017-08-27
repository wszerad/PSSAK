const store = require('express-dataio').middleware.store(require('../definitions/definitions'));
const db = require('../db');

module.exports = function (router) {

	router.get('/dashboard', function (req, res, next) {
		let today = new Date();
		today.setHours(0, 0, 0, 0);

		Promise
			.all([
				db('events')
					.find({
						date: {
							$gte: today
						}
					})
					.sort({
						date: -1
					})
					.limit(2)
					.toArray(),
				db('notes')
					.find({})
					.sort({
						date: -1
					})
					.limit(1)
					.toArray()
			])
			.then(([events, note]) => {
				let todayEvent = (events[0] && events[0].date * 1 === today * 1) ? events[0] : null,
					nextEvent = events[1] || (todayEvent ? null : events[0]);

				res.reply.assign({
					todayEvent: todayEvent && todayEvent.date,
					nextEvent: nextEvent && nextEvent.date,
					note: note[0]
				});
				next();
			})
			.catch(next);
	});

	router.put('/note', store(['note']), function (req, res, next) {
		let {note} = req.store;

		db('notes')
			.insertOne({
				user: req.session.name,
				note,
				date: new Date()
			})
			.then((doc) => {
				res.reply.assign({note: doc.ops[0]});
				next();
			});
	});

};
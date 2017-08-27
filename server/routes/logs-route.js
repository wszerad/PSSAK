const db = require('../db');

module.exports = function (router) {

	router.get('/logs', function (req, res, next) {
		return db('logs')
			.find({})
			.toArray()
			.then(logs => {
				res.reply.set('logs', logs);
				next();
			})
			.catch(next);
	});

};
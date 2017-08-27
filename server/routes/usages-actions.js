const db = require('../db');

module.exports = {
	findDaily(date) {
		return db('usages')
			.find({
				date,
				obligatory: false
			})
			.toArray();
	},
	deleteDaily(date) {
		return db('usages')
			.deleteMany({
				date
			});
	},
	findDailyForGlider(glider, date) {
		return db('usages')
			.find({
				name: glider,
				date
			})
			.toArray();
	},
	deleteDailyForOtherGliders(gliders, date) {
		return db('usages')
			.deleteMany({
				name: {
					$nin: gliders
				},
				obligatory: false,
				date
			});
	},
	addInit(user) {
		const date = new Date();
		date.setUTCHours(0, 0, 0, 0);

		return db('usages')
			.insertOne({
				name: null,
				user,
				date,
				range: null,
				obligatory: true
			});
	},
	addInitMany(users) {
		const date = new Date();
		date.setUTCHours(0, 0, 0, 0);

		const inits = users.map(user => {
			return {
				name: null,
				user,
				date,
				range: null,
				obligatory: true
			};
		});

		return db('usages').insertMany(inits);
	},
	addObligatory(user, date) {
		return db('usages')
			.insertOne({
				name: null,
				user,
				date,
				range: null,
				obligatory: true
			});
	},
	add(user, glider, date, range) {
		return db('usages')
			.insertOne({
				name: glider,
				user,
				date,
				range: range || '0',
				obligatory: false
			});
	},
	remove(user, glider, date) {
		return db('usages')
			.deleteOne({
				user,
				date,
				name: glider,
				obligatory: false
			});
	},
	updateOrAdd(user, date, glider, range) {
		return db('usages')
			.updateOne({
				user,
				date,
				name: glider,
				obligatory: false
			}, {
				$set: {
					user,
					date,
					name: glider,
					range,
					obligatory: false
				}
			}, {
				upsert: true
			});
	},
	updateOrAddByAdmin(user, date) {
		return db('usages')
			.updateOne({
				user,
				date,
				name: 'admin',
				obligatory: false
			}, {
				$set: {
					user,
					date,
					name: 'admin',
					range: true,
					obligatory: false
				}
			}, {
				upsert: true
			});
	},
	removeByAdmin(user, date) {
		return db('usages')
			.deleteOne({
				user,
				date,
				name: 'admin',
				obligatory: false
			});
	},
	order(date) {
		return db('usages')
			.aggregate([
				{
					$match: {
						date: {
							$lt: date
						}
					}
				},
				{
					$group: {
						_id: '$user',
						date: {
							$max: '$date'
						}
					}
				},
				{
					$sort: {
						date: 1,
						_id: 1
					}
				}
			])
			.toArray();
	}
};


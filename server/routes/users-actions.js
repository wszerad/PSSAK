const crypto = require('../utils/password-crypto');
const passGen = require('../utils/password-generator');
const usagesActions = require('./usages-actions');
const mailer = require('../utils/mailer');
const db = require('../db');

module.exports = {
	all() {
		return db('users')
			.find({root: false})
			.project({password: false})
			.toArray();
	},
	add(name, email, admin, instructor, active) {
		let password = passGen(8);

		return crypto
			.hash(password)
			.then(hash=>{
				return Promise.all([
					db('users')
						.insertOne({
							_id: name,
							password: hash,
							root: false,
							name,
							email,
							admin,
							instructor,
							active
						}),
					usagesActions.addInit(name)
				]);
			})
			.then(()=>{
				return mailer({
					to: email,
					subject: 'SSAK password',
					text: 'hasło: ' + password
				});
			});
	},
	addSilently(name, email, password, admin, instructor, active) {
		return crypto
			.hash(password)
			.then(hash => {
				return Promise.all([
					db('users')
						.insertOne({
							_id: name,
							password: hash,
							root: false,
							name,
							email,
							admin,
							instructor,
							active
						}),
					usagesActions.addInit(name)
				]);
			});
	},
	findById(_id) {
		return db('users')
			.findOne({
				_id
			}, {
				fields: {
					password: 0
				}
			});
	},
	findSession(name) {
		return db('users')
			.findOne({
				name
			}, {
				fields: {
					password: 0
				}
			});
	},
	findByEmail(email) {
		return db('users')
			.findOne({
				email
			});
	},
	findByName(name) {
		return db('users')
			.findOne({
				name
			}, {
				fields: {
					password: 0
				}
			});
	},
	remove(_id) {
		return db('users')
			.deleteOne({_id});
	},
	update(name, email, admin, instructor, active) {
		return db('users')
			.updateOne({_id: name}, {
				$set: {
					email,
					admin,
					instructor,
					active
				}
			});
	},
	renameAndUpdate(_id, name, email, admin, instructor, active) {
		return db('users')
			.findOne({
				_id
			})
			.then(doc => {
				const user = {
					_id: name,
					name,
					email,
					admin,
					instructor,
					active,
					password: doc.password
				};

				return db('users')
					.insertOne(user);
			});
	}
};
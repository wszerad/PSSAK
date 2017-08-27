const store = require('express-dataio').middleware.store(require('../definitions/definitions'));
const crypto = require('../utils/password-crypto');
const db = require('../db');
const usersActions = require('./users-actions');
const config = require('../config');

module.exports = function (router) {

	router.get('/users', function (req, res, next) {
		config.isProduction && req.permission('admin');

		usersActions
			.all()
			.then((docs)=>{
				res.reply.set('users', docs);
				next();
			})
			.catch(next);
	});

	router.get('/user', function (req, res, next) {
		let {login, name} = req.session;

		if (login) {
			usersActions
				.findSession(name)
				.then((doc)=>{
					if(doc) {
						req.session.name = doc.name;
						req.session.login = true;
						req.session.admin = doc.admin;
						req.session.root = doc.root;

						doc.dev = !config.isProduction;
						res.reply.assign(doc);
						next();
					} else {
						res.reply.error(401);
					}
				})
				.catch(next);
		} else {
			return res.reply.error(401);
		}
	});

	router.post('/login', store(['email', 'password']), function (req, res, next) {
		let {email, password} = req.store;

		usersActions
			.findByEmail(email)
			.then((doc)=>{
				if(doc) {
					return crypto
						.compare(password, doc.password)
						.then((pass)=>{
							if(pass) {
								req.session.name = doc.name;
								req.session.login = true;
								req.session.admin = doc.admin;
								req.session.root = doc.root;

								doc.dev = !config.isProduction;
								delete doc.password;
								res.reply.assign(doc);
								next();
							}

							return pass;
						});
				}
			})
			.then((pass)=>{
				if (!pass) {
					res.reply.error(401);
				}
			})
			.catch(next);
	});

	if(!config.isProduction) {
		router.post('/relogin', store(['name']), function (req, res, next) {
			let {name} = req.store;

			usersActions
				.findByName(name)
				.then((doc)=>{
					if(doc) {
						req.session.name = doc.name;
						req.session.login = true;
						req.session.admin = doc.admin;
						req.session.root = doc.root;
					}

					next();
				})
				.catch(next);
		});
	}

	router.post('/logout', function (req, res, next) {
		req.session.destroy(()=>{
			next();
		});
	});

};
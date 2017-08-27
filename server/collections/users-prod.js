const db = require('../db');
const crypto = require('../utils/password-crypto');
const ROOTPassword = '?ProF1_#';

module.exports = function () {
	return crypto
		.hash(ROOTPassword)
		.then(pass => {
			return db('users').findOneAndUpdate({
				_id: 'ROOT',
			}, {
				_id: 'ROOT',
				name: 'ROOT',
				email: 'ROOT',
				password: pass,
				active: true,
				admin: true,
				instructor: false,
				root: true
			}, {
				upsert: true
			});
		});
};
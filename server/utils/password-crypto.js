const bcrypt = require('bcryptjs');
const config = require('../config');

module.exports = {
	compare(password, hash) {
		return new Promise((resolve, reject)=>{
			bcrypt.compare(password, hash, (err, equal)=>{
				if(err)
					reject(err);
				else
					resolve(equal);
			});
		});
	},
	hash(password) {
		return new Promise((resolve, reject)=>{
			bcrypt.hash(password, config.security.hashRounds, (err, equal)=>{
				if(err)
					reject(err);
				else
					resolve(equal);
			});
		});
	}
};
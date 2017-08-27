const config = require('../config');
const userData = require('./users-data');

module.exports = {
	name: 'users',
	stub() {
		if (config.isProduction) {
			return userData.getROOTUser().then(user => [user]);
		} else {
			return Promise
				.all([userData.getRandomUsers(), userData.getROOTUser()])
				.then(([rusers, root]) => {
					return rusers.concat(root);
				});
		}
	}
};


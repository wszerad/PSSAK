const config = require('../config');

module.exports = function () {
	const chars = 'abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789';
	let password = '',
		len = config.security.defaultPassLen;

	for (let i = 0; i < len; i++) {
		password += chars[Math.floor(Math.random() * chars.length)];
	}

	return password;
};
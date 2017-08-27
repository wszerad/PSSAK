const os = require('os');
const util = require('util');

module.exports = function () {
    return util.inspect({
		'Free Memory': `${Math.round(os.freemem() / 1048576)}MB`,
		'Uptime': `${os.uptime()}s`
	});
};

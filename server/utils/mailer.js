const nodemailer = require('nodemailer');
const config = require('../config');
const transporter = nodemailer.createTransport(config.mailer);
const options = {
	from: '"Kolejkowanie SSAK" <noreply.ssak@gmail.com>'
};

// to: address@domain.com
// subject: 'Hello ✔', // Subject line
// text: 'Hello world ?', // plain text body
// html: '<b>Hello world ?</b>' // html body
module.exports = function send(data) {
	return new Promise(function (resolve, reject) {
		transporter.sendMail(Object.assign(options, data), (error, info) => {
			console.log(error, info);
			if (error) return reject(error);
			resolve(info);
		});
	});
};
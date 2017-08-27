const db = require('../db');

module.exports = {
	log(editor, target, info) {
		return db('logs')
			.insert({
				editor,
				target,
				info,
				date: new Date().toISOString()
			})
			.then();
	}
};
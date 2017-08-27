let users = require('./users').stub();

module.exports = {
	name: 'usages',
	stub() {
		let today = new Date(),
			tomorrow = new Date();

		today.setUTCHours(0,0,0,0);
		tomorrow.setUTCHours(24,0,0,0);

		return users
			.then(users => {
				return users
					.map(user => {
						return {
							name: null,
							user: user.name,
							date: today,
							range: null,
							obligatory: true
						};
					})
					.concat([
						{
							name: 'SP-3105 Bocian',
							user: users[0]._id,
							date: tomorrow,
							range: '1',
							obligatory: false
						},
						{
							name: 'SP-3105 Bocian',
							user: users[1]._id,
							date: tomorrow,
							range: '2',
							obligatory: false
						}
					]);
			});
	}
};

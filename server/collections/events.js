let gliders = require('./gliders').stub();
let instructors = require('./users').stub();
let starts = require('./starts').stub();

module.exports = {
	name: 'events',
	stub() {
		let yesterday = new Date(),
			tomorrow = new Date();

		yesterday.setUTCHours(-24,0,0,0);
		tomorrow.setUTCHours(24,0,0,0);

		return instructors.then(function (instructors) {
			return [
				{
					user: 'adam',
					updater: null,
					updated: null,
					canceled: false,
					date: yesterday,
					gliders: [
						gliders[0].name
					],
					instructors: [
						instructors[instructors.length-1].name
					],
					start: [
						starts[0].name,
						starts[1].name
					]
				},
				{
					user: 'adam',
					updater: null,
					updated: null,
					canceled: false,
					date: tomorrow,
					gliders: [
						gliders[0].name
					],
					instructors: [
						instructors[instructors.length-1].name
					],
					start: [
						starts[0].name,
						starts[1].name
					]
				}
			];
		});
	}
};
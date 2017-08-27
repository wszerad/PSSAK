module.exports = {
	name: 'logs',
	stub() {
		return [
			{
				editor: 'server',
				target: null,
				info: 'Start serwera',
				date: new Date().toISOString()
			}
		];
	}
};
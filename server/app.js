const db = require('mongo-fitter');
const app = require('./express');
const config = require('./config');
const rootCreation = require('./collections/users-prod');

db
	.open(config.db)
	.then(()=>{
		if(!config.isProduction) {
			return Promise.all([
				db.prepare(require('./collections/users')),
				db.prepare(require('./collections/events')),
				db.prepare(require('./collections/notes')),
				db.prepare(require('./collections/gliders')),
				db.prepare(require('./collections/starts')),
				db.prepare(require('./collections/usages')),
				db.prepare(require('./collections/logs'))
			]);
		} else {
			return Promise.all([
				rootCreation()
			]);
		}
	})
	.then(()=>{
		let server = app.listen(config.port, config.address, () => {
			let host = server.address().address,
				port = server.address().port;

			console.log(`Example app listening at http://${host}:${port}`);
		});
	})
	.catch(console.error);

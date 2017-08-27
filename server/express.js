const express = require('express');
const path = require('path');
const router = express.Router();
const cookie = require('cookie-parser');
const session = require('express-session');
const body = require('body-parser');
const dataIO = require('express-dataio');
const config = require('./config');
const app = express();
const sys = require('./utils/sys-info');
const permissions = require('./utils/permissions');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
		uri: config.db,
		collection: 'sessions'
	}, error => {
		if (!error) return;
		console.error('Session connection error:');
	    console.error(error);
	});

Object.keys(config.express || {}).forEach((key)=>{
	app.set(key, config.express[key]);
});
app.use(cookie());
app.use(express.static(path.join(__dirname, '../app')));
app.use(body.json());
app.use(session(Object.assign({}, config.session, {store})));
app.use(permissions());

app.all('/health', (req, res)=>{
	res.end();
});

app.get('/status', (req, res)=>{
	res.send(sys());
});

//routes
require('./routes/user-route')(router);
require('./routes/dashboard-route')(router);
require('./routes/event-route')(router);
require('./routes/settings-route')(router);
require('./routes/logs-route')(router);

app.use('/api', dataIO(router));

module.exports = app;
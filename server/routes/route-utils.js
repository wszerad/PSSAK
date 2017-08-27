module.exports = {
	isAuthorized: function (req, res, next) {
		if (req.session.login) {
			next();
		} else {
			res.reply.error(401);
		}
	}
};
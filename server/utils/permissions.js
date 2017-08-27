const dataIO = require('express-dataio');

module.exports = function() {
	return function (req, res, next) {
		req.permission = function (perm) {
			if(!req.hasPermission(perm)) {
				throw new dataIO.model.ResponseError(403);
			}
		};

		req.hasPermission = function (perm) {
			var allow = false;

			switch (perm) {
				case 'admin':
					allow = req.session.admin;
					break;
				case 'root':
					allow = req.session.root;
					break;
				default:
					allow = true;
			}

			return allow;
		};

		next();
	}
};



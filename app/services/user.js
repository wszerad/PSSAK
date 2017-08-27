angular.module('queueApp')
	.factory('user', function ($cookies, xhr) {

		var user = {
			data: {
				login: null,
				name: null,
				admin: false,
				root: false,
				dev: false
			},
			hasSession: function () {
				return $cookies.get('login');
			},
			setup: function (userData) {
				angular.extend(user.data, userData);
			},
			check: function () {
				if ($cookies.get('login')) {
					xhr.get('user')
						.done(login)
						.fail(logout);
				}
			},
			login: function (email, password) {
				return xhr
					.post('login', {
						email: email,
						password: password
					})
					.done(login)
					.fail(logout);
			},
			logout: function () {
				return xhr.post('logout')
					.done(function () {
						logout();
						window.location.reload();
					});
			}
		};

		user.check();

		function login(data, textStatus, xhr) {
			if (xhr.status === 200) {
				user.setup(data.reply);
				$cookies.put('login', true);
				user.data.login = true;
			}
		}

		function logout() {
			$cookies.remove('login');
			user.data.login = false;
		}

		return user;

	});
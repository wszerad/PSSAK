angular.module('queueApp', ['ui.router', 'ngCookies', 'checklist-model'])
	.config(function($stateProvider, $urlRouterProvider) {
		var today = new Date();

		today.setHours(0,0,0,0);

		var states = [
			{
				name: 'loading',
				url: '/loading',
				component: 'loading',
				params: {
					href: null
				}
			},
			{
				name: 'auth',
				url: '/auth',
				component: 'login'
			},
			{
				name: 'main',
				url: '/main',
				component: 'main',
				abstract: true
			},
			{
				name: 'main.dashboard',
				url: '/dashboard',
				views: {
					'main': {
						component: 'dashboard'
					}
				}
			},
			{
				name: 'main.settings',
				url: '/settings',
				resolve: {
					settings: function ($stateParams, xhr) {
						return xhr.get('settings')
							.done(function (data) {
								return data.reply;
							});
					}
				},
				views: {
					'main': {
						template: '<settings data="$resolve.settings"></settings>'
					}
				}
			},
			{
				name: 'main.users',
				url: '/users',
				resolve: {
					data: function ($stateParams, xhr) {
						return xhr.get('users')
							.then(function (data) {
								return data.reply.users;
							});
					}
				},
				views: {
					'main': {
						template: '<users data="$resolve.data"></users>'
					}
				}
			},
			{
				name: 'main.gliders',
				url: '/gliders',
				resolve: {
					data: function ($stateParams, xhr) {
						return xhr.get('settings/gliders')
							.then(function (data) {
								return data.reply.gliders;
							});
					}
				},
				views: {
					'main': {
						template: '<gliders data="$resolve.data"></gliders>'
					}
				}
			},
			{
				name: 'main.event',
				url: '/event/:year/:month/:day',
				params: {
					year: today.getFullYear() + '',
					month: today.getMonth() + 1 + '',
					day: today.getDate() + '',
					edition: false
				},
				resolve: {
					event: function ($stateParams, vDate, xhr) {
						return xhr
							.post('event', {
								date: vDate.fromParams($stateParams).toUTCDate()
							})
							.then(function (data) {
								return data.reply;
							});
					}
				},
				views: {
					'main': {
						template: '<event event="$resolve.event"></event>'
					}
				}
			},
			{
				name: 'main.logs',
				url: '/logs',
				resolve: {
					logs: function ($stateParams, xhr) {
						return xhr
							.get('logs')
							.then(function (data) {
								return data.reply.logs;
							});
					}
				},
				views: {
					'main': {
						template: '<logs logs="$resolve.logs"></logs>'
					}
				}
			},
			{
				name: 'start',
				url: '',
				onEnter: function ($state) {
					$state.go('main.dashboard');
				}
			}
		];

		states.forEach(function(state) {
			$stateProvider.state(state);
		});

		$urlRouterProvider.otherwise('/main/dashboard');

	})
	.run(function ($transitions, $state, user) {
		$transitions.onStart({ to: 'main.**' }, function () {
			if (user.data.login === null && user.hasSession()) {
				return $state.go('loading', {
					href: window.location.hash
				});
			} else if(!user.data.login) {
				return $state.go('auth');
			}
		});
	});
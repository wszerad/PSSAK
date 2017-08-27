angular.module('queueApp')
	.component('main', {
		templateUrl: 'components/main/main.html',
		controller: mainCtrl
	});

function mainCtrl($scope, user, xhr) {
	xhr.get('users')
		.done(function (data) {
			angular.copy(data.reply.users.sort(function (x, y) {
				return x.name.localeCompare(y.name);
			}), $scope.users);
			$scope.$apply();
		});

	$scope.logout = user.logout;
	$scope.user = user.data;
	$scope.users = [];

	$scope.changeUser = function (name) {
		xhr.post('/relogin', {name})
			.done(function (data) {
				window.location.reload();
			});
	}
}
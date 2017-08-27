angular.module('queueApp')
	.component('login', {
		templateUrl: 'components/login/login.html',
		controller: loginCtrl
	});


function loginCtrl($scope, $state, user) {
	$scope.login = function () {
		user.login($scope.email, $scope.password)
			.then(function () {
				if (user.data.login) {
					$state.go('main.dashboard');
				} else {
					alert('Błędne dane!');
				}
			});
	};
}
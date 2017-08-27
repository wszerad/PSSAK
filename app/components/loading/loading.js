angular.module('queueApp')
	.component('loading', {
		templateUrl: 'components/loading/loading.html',
		controller: loadingCtrl
	});


function loadingCtrl($scope, $state, $stateParams, user) {
	if(!check()) {
		$scope.$watch(user.data.login, check);
	}

	function check() {
		if (user.data.login) {
			if ($stateParams.href) {
				window.location.hash = $stateParams.href;
			} else {
				$state.go('main.dashboard');
			}
			return true;
		} else if(user.data.login === false || !user.hasSession()) {
			$state.go('auth');
			return true;
		}

		return false;
	}
}
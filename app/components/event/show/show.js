angular.module('queueApp')
	.component('show', {
		templateUrl: 'components/event/show/show.html',
		bindings: {
			event: '='
		},
		controller: showCtrl
	});


function showCtrl($scope, $state, $stateParams, xhr, utils) {
	$scope.event = this.event;

	$scope.delete = function () {
		if(confirm('Usunąć wydarzenie?')) {
			xhr.delete('event', {
				_id: $scope.event._id
			});
			$state.go('main.dashboard');
		}
	};

	$scope.edit = function () {
		$state.go('main.event', {
			edition: true
		});
	};

}
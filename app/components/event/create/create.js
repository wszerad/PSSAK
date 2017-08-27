angular.module('queueApp')
	.component('create', {
		templateUrl: 'components/event/create/create.html',
		bindings: {
			event: '=',
			available: '=',
			save: '&'
		},
		controller: createCtrl
	});


function createCtrl($scope, $state, xhr) {
	var self = this,
		backup = angular.copy(this.event);

	$scope.event = this.event;
	$scope.available = this.available;

	$scope.save = function () {
		xhr
			.put('event', {
				event: $scope.event
			})
			.done(function (data) {
				self.save()(data.reply);
				$scope.$apply();
			});
	};

	$scope.reset = function () {
		$scope.event = backup;
	};
}
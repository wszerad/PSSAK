angular.module('queueApp')
	.component('event', {
		templateUrl: 'components/event/event.html',
		controller: eventCtrl,
		bindings: {
			event: '='
		}
	});

function eventCtrl($scope, $stateParams, $state, vDate, user) {
	var self = this,
		vdate = vDate.fromState();

	$scope.user = user.data;
	$scope.time = vdate.toUTCDate();

	$scope.created = function (event) {
		$scope.init(event);
	};

	$scope.init = function (event) {
		event = event || self.event;
		$scope.exists = !!event.event;
		$scope.edition = event.event && (event.event.isNew || $stateParams.edition) && event.event.editable;
		$scope.editable = event.event && event.event.editable;
		$scope.canceled = event.event && event.event.canceled;

		if($scope.exists) {
			$scope.event = event.event;
			$scope.available = event.available;
			$scope.usages = event.usages;
			$scope.queue = event.order;
			$scope.order = event.order.reduce(function (orderMap, order, index) {
				orderMap[order._id] = index + 1;
				return orderMap;
			}, {});

			if(event.isNew) {
				$scope.gliders = [];
			} else if(event.event.gliders) {
				$scope.gliders = event.event.gliders;
			}
		}
	};

	$scope.prevDay = function () {
		vdate.day -= 1;
		$state.go('main.event', vdate.toParams());
	};

	$scope.nextDay = function () {
		vdate.day += 1;
		$state.go('main.event', vdate.toParams());
	};

	$scope.init();
}
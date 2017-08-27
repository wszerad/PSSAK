angular.module('queueApp')
	.component('listManager', {
		bindings: {
			items: '=',
			structure: '=',
			onDelete: '&',
			onUpdate: '&'
		},
		templateUrl: 'components/list-manager/list-manager.html',
		controller: listManagerCtrl
	});

function listManagerCtrl($scope) {
	var self = this;
	$scope.structure = this.structure;
	$scope.items = this.items;
	$scope.item = {};

	$scope.save = function (item) {
		self.onUpdate()(item || $scope.item);
	};

	$scope.cancel = function () {
		$scope.item = {};
	};

	$scope.delete = function (index) {
		self.onDelete()($scope.items[index]);
	};

	$scope.edit = function (index) {
		$scope.item = angular.copy($scope.items[index]);
	};

	$scope.toggle = function (index) {
		var item = $scope.items[index];

		if(item.frozen) return;

		item.active = !item.active;
		self.onUpdate()(item);
	};
}
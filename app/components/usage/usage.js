angular.module('queueApp')
    .component('usage', {
        templateUrl: 'components/usage/usage.html',
        controller: usageCtrl,
		bindings: {
        	order: '=',
			usages: '=',
			glider: '=',
			date: '=',
			editable: '='
		}
    });

function usageCtrl($scope, user, xhr) {
	var self = this;
	$scope.sortedUsages = [];
	$scope.myself = user.data.name;
	$scope.editable = this.editable;
	$scope.range = {
		val: ''
	};

	this.usages.some(function (item) {
		return item.user === $scope.myself && ($scope.range.val = item.range);
	});

	$scope.ranges = {
		0: {
			name: 'Brak',
			type: ''
		},
		1: {
			name: 'Pojedyńcze krótkie loty',
			type: '1'
		},
		2: {
			name: 'Termika',
			type: '2'
		},
		3: {
			name: 'Długotrwały lot',
			type: '3'
		}
	};

	$scope.reserve = function () {
		if(!$scope.editable) {
			return;
		}

		xhr
			.put('usage', {
				usage: {
					range: $scope.range.val,
					date: self.date,
					name: self.glider
				}
			})
			.done(function (data) {
				$scope.update(data.reply.usages);
				$scope.$apply();
			});
	};

	$scope.update = function (usages) {
		angular.copy(usages.sort(function (x, y) {
			return self.order[x.user] - self.order[y.user];
		}), $scope.sortedUsages);
	};

	$scope.update(this.usages);
}
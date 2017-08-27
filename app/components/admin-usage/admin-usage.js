angular.module('queueApp')
    .component('adminUsage', {
        templateUrl: 'components/admin-usage/admin-usage.html',
        controller: adminUsageCtrl,
		bindings: {
			date: '=',
			users: '=',
			usages: '='
		}
    });

function adminUsageCtrl($scope, user, xhr) {
	var self = this;
	$scope.admin = user.data.admin;
	$scope.usages = this.usages;

	$scope.reserve = function (name, range) {
		xhr
			.put('usage/admin', {
				usage: {
					date: self.date,
					user: name,
					range: range
				}
			})
			.done(function (data) {
				$scope.update(data.reply.usages);
				$scope.$apply();
			});
	};

	$scope.update = function (usages) {
		angular.copy(usages, $scope.usages);
	};

}
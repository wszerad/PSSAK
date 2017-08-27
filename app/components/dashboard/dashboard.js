angular.module('queueApp')
	.component('dashboard', {
		templateUrl: 'components/dashboard/dashboard.html',
		controller: dashboardCtrl
	});


function dashboardCtrl($scope, vDate, xhr) {
	$scope.loading = true;
	$scope.underEdition = false;
	$scope.nextEvent = null;
	$scope.todayEvent = null;
	$scope.note = null;
	$scope.message = null;

	$scope.update = function (event) {
		$scope.message = event.target.value;
	};

	$scope.save = function () {
		$scope.loading = true;

		xhr
			.put('note', {
				note: $scope.message
			})
			.done(function (data) {
				$scope.note = data.reply.note;
				$scope.loading = false;
				$scope.underEdition = false;
				$scope.$apply();
			});
	};

	$scope.edit = function () {
		$scope.underEdition = true;
		$scope.message = $scope.note.note;
	};

	$scope.delete = function () {
		$scope.message = '';
		$scope.save();
	};


	$scope.cancel = function () {
		$scope.underEdition = false;
	};

	updateDashboard();

	function updateDashboard(data) {
		if(!data) {
			xhr.get('dashboard')
				.done(update);
		} else {
			update(data);
		}

		function update(data) {
			data = data.reply;
			$scope.note = data.note;
			$scope.todayEvent = data.todayEvent && vDate.fromDate(data.todayEvent).toParams();
			$scope.nextEvent = data.nextEvent && vDate.fromDate(data.nextEvent).toParams();
			$scope.nextEventDate = data.nextEvent && vDate.fromDate(data.nextEvent).toDate();
			$scope.loading = false;
			$scope.$apply();
		}
	}
}
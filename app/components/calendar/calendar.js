angular.module('queueApp')
	.component('calendar', {
		templateUrl: 'components/calendar/calendar.html',
		controller: calendarCtrl
	});


function calendarCtrl($scope, $state, $stateParams, vDate) {
	var startDate = new Date(),
		endDate = new Date();

	$scope.$watchGroup([
		function () {
			return $stateParams.year
		},
		function () {
			return $stateParams.month
		},
		function () {
			return $stateParams.day
		},
	], function () {
		if($stateParams.year) {
			$('.calendar').datepicker('update', vDate.fromState().toDate());
		}
	});

	startDate.setFullYear(startDate.getFullYear()-1);
	endDate.setFullYear(endDate.getFullYear()+1);

	$('.calendar')
		.datepicker({
			maxViewMode: 2,
			todayBtn: true,
			language: "pl",
			daysOfWeekHighlighted: "0,6",
			todayHighlight: true,
			startDate: startDate,
			endDate: endDate
		})
		.on('changeDate', function (e) {
			$state.go('main.event', vDate.fromDate(e.date).toParams());
		});
}
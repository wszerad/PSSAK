angular.module('queueApp')
	.factory('utils', function ($stateParams) {
		return {
			todayUTC: function () {
				var date = new Date();
				date.setUTCHours(0, 0, 0, 0);
				return date;
			},
			dateToParams: function (date) {
				return {
					year: date.getFullYear() + '',
					month: date.getMonth() + 1 + '',
					day: date.getDate() + ''
				};
			},
			stateTime: function () {
				if($stateParams.year && $stateParams.month && $stateParams.day) {
					var date = new Date($stateParams.year, $stateParams.month - 1, $stateParams.day);
					date.setUTCHours(0, 0, 0, 0);
					return date;
				} else {
					return utils.todayUTC();
				}
			}
		};

	});
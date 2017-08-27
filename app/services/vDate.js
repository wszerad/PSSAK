angular.module('queueApp')
	.factory('vDate', function ($stateParams) {
		function vDate(year, month,	day) {
			if(year !== undefined && month !== undefined && day !== undefined) {
				this._date = new Date(Date.UTC(year, month, day));
			} else {
				var date = new Date();
				this._date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
			}
		}

		vDate.now = function () {
			return new vDate();
		};

		vDate.fromParams = function (params) {
			return new vDate(params.year, params.month - 1, params.day);
		};

		vDate.fromDate = function (date) {
			date = new Date(date);
			return new vDate(date.getFullYear(), date.getMonth(), date.getDate());
		};

		vDate.fromState = function () {
			if ($stateParams.year && $stateParams.month && $stateParams.day) {
				return new vDate($stateParams.year, $stateParams.month - 1, $stateParams.day);
			} else {
				return new vDate();
			}
		};

		vDate.prototype = {
			get year() {
				return this._date.getUTCFullYear();
			},
			get month() {
				return this._date.getUTCMonth();
			},
			get day() {
				return this._date.getUTCDate();
			},
			set year(v) {
				this._date.setUTCFullYear(v);
			},
			set month(v) {
				this._date.setUTCMonth(v);
			},
			set day(v) {
				this._date.setUTCDate(v);
			},
			toDate: function () {
				return new Date(this.year, this.month, this.day);
			},
			toUTCDate: function () {
				return new Date(this._date);
			},
			toParams: function () {
				return {
					year: this.year,
					month: this.month + 1,
					day: this.day
				};
			},
			isToday: function () {
				var date = new Date();
				return date.getFullYear() === this.year && date.getMonth() === this.month && date.getDate() === this.day;
			},
			isPast: function () {
				var date = new Date();
				return date.getFullYear() > this.year || date.getMonth() > this.month || date.getDate() > this.day;
			}
		};

		return vDate;
	});
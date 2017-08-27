angular.module('queueApp')
	.factory('xhr', [function() {

		function xhr(url, data, method) {
			var opt = {
				url: 'api/' + url,
				cache: false,
				dataType: 'json',
				method: method,
				contentType: 'application/json; charset=utf-8',
				complete: function (res) {
					if(res.responseJSON.reply.message) {
						alert(res.responseJSON.reply.message);
					}
				}
			};

			if(data) {
				opt.data = JSON.stringify(data || {});
			}

			return $.ajax(opt);
		}

		return {
			post: function (url, data) {
				return xhr(url, data, 'POST');
			},
			get: function (url, data) {
				return xhr(url, data, 'GET');
			},
			delete: function (url, data) {
				return xhr(url, data, 'DELETE');
			},
			put: function (url, data) {
				return xhr(url, data, 'PUT');
			}
		};

	}]);
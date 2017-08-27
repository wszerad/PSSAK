angular.module('queueApp')
	.component('logs', {
		templateUrl: 'components/logs/logs.html',
		controller: logsCtrl,
		bindings: {
			logs: '='
		}
	});


function logsCtrl($scope, $state) {}
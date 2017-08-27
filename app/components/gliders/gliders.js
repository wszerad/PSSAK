angular.module('queueApp')
	.component('gliders', {
		templateUrl: 'components/gliders/gliders.html',
		controller: glidersCtrl,
		bindings: {
			data: '='
		}
	});

function glidersCtrl($scope, xhr) {
	$scope.data = this.data || [];

	$scope.structure = [
		{
			title: 'Znaki',
			field: '_id',
			type: 'text',
			size: '30%'
		},
		{
			title: 'Typ',
			field: 'type',
			type: 'text',
			size: '30%'
		},
		{
			title: 'Aktywny',
			field: 'active',
			type: 'checkbox',
			size: '10%'
		}
	];

	function send(op, loc, obj, item) {
		var data = {};

		data[obj] = item;

		xhr[op](loc, data)
			.done(function (data) {
				angular.copy(data.reply.gliders, $scope.data);
				$scope.$apply();
			});
	}

	$scope.update = send.bind(this, 'post', 'settings/glider', 'glider');
	$scope.delete = send.bind(this, 'delete', 'settings/glider', 'glider');
}
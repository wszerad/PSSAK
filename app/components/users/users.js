angular.module('queueApp')
	.component('users', {
		templateUrl: 'components/users/users.html',
		controller: usersCtrl,
		bindings: {
			data: '='
		}
	});

function usersCtrl($scope, xhr, user) {
	$scope.data = makeFrozen(this.data || []);

	$scope.structure = [
		{
			title: 'Nazwa',
			field: 'name',
			type: 'text',
			size: '30%'
		},
		{
			title: 'Email',
			field: 'email',
			type: 'email',
			size: '30%'
		},
		{
			title: 'Admin',
			field: 'admin',
			type: 'checkbox',
			size: '10%',
			disabled: true
		},
		{
			title: 'Instruktor',
			field: 'instructor',
			type: 'checkbox',
			size: '10%'
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
				angular.copy(makeFrozen(data.reply.users), $scope.data);
				$scope.$apply();
			});
	}

	function makeFrozen(users) {
		return users.map(us => {
			us.frozen = us.admin && !user.data.root;
			return us;
		});
	}

	$scope.update = send.bind(this, 'post', 'settings/user', 'user');
	$scope.delete = send.bind(this, 'delete', 'settings/user', 'user');
}
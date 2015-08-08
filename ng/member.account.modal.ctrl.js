/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('MemberAccountModalCtrl', ['$scope', 'UserSvc', 'MemberSvc', 'member', '$modalInstance',
	function ($scope, UserSvc, MemberSvc, member, $modalInstance) {

	$scope.user = member;

	$scope.save = function(){
		if (_.isEmpty($scope.user)) {
			console.log("please enter your account and password!")
		} else{
			if (!$scope.user.account) {
				console.log("account can't be blank!")
				if (!$scope.user.password) {
					console.log("passwod can't be blank!")
				};
			} else if (!$scope.user.password) {
				console.log("password can't be blank")
			}else{
				UserSvc.activate($scope.user);
				MemberSvc.updateUser(member.name);
				$modalInstance.close($scope.user);
			};
		};
	};

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}
}])
/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('NavCtrl', ['$scope', 'BranchSvc', 'store', 'jwtHelper', 'UserSvc',
	function ($scope, BranchSvc, store, jwtHelper, UserSvc) {

	$scope.username = UserSvc.currentUser();
	$scope.branch = UserSvc.userBranch();

	BranchSvc.fetch(UserSvc.userCorps()).success(function(branches){
		$scope.branches = branches;
	});

	$scope.isValid = function(branch){
		return UserSvc.isValid(branch);
	};
	
}]);
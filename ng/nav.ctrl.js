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

	$scope.isValid = function(branch){
		if (branch == "第三救災救護大隊") {
			return true;
		}else{
			return false;
		}
	};

	BranchSvc.fetch().success(function(branches){
		$scope.branches = branches;
	});

	$scope.isValid = function(branch){
		return UserSvc.isValid(branch);
	};
	
}]);
/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('DirDutyListCtrl', ['$scope', 'UserSvc', 'BranchSvc', 
	function ($scope, UserSvc, BranchSvc) {

		var branch = UserSvc.userBranch();
		
		BranchSvc.fetchByName(branch).success(function(branch){
			$scope.branch = branch;
			$scope.onDutyTotal = $scope.branch.members.filter(function(member) {
				return member.onDuty == true 
			});
		});
	
}])
/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('DutyListCtrl', ['$scope', 'BranchSvc', '$stateParams', 'SocketSvc', 'UserSvc', '$q',
	function ($scope, BranchSvc, $stateParams, SocketSvc, UserSvc, $q) {

		var branch = $stateParams.branch
		
		BranchSvc.totalListFindByName(branch).success(function(branch){
			$scope.branch = branch;
			$scope.onDutyTotal = $scope.branch.members.filter(function(member) {
				return member.onDuty == true
			});
		});
}])
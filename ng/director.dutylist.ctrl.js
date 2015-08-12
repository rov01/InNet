/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('DirDutyListCtrl', ['$scope', 'UserSvc', 'BranchSvc', 
	function ($scope, UserSvc, BranchSvc) {

		var branch = UserSvc.userBranch();
		
		BranchSvc.totalListFindByName(branch).success(function(branch){
			$scope.branch = branch;
			$scope.onDutyTotal = totalCount($scope.branch)
		});

		function totalCount(obj){
			var total = 0;
			for (var i = 0; i < obj.members.length; i++) {
				if (obj.members[i].onDuty) {
					total += 1; 
				};
			};
			return total
		};
	
}])
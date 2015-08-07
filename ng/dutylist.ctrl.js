/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('DutyListCtrl', ['$scope', 'BranchSvc', '$stateParams', 'SocketSvc', 'UserSvc', '$q',
	function ($scope, BranchSvc, $stateParams, SocketSvc, UserSvc, $q) {

		if (UserSvc.accessLevel() < 3 ) {
			var branch = UserSvc.userBranch();
		} else{
			var branch = $stateParams.branch
		};

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
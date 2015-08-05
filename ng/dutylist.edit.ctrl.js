/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('DutyListEditCtrl', ['$scope', 'BranchSvc', '$stateParams','MemberSvc', '$location', '$window', 'UserSvc',
	function ($scope, BranchSvc, $stateParams, MemberSvc, $location, $window, UserSvc) {

		if (UserSvc.accessLevel() < 2 ) {
			var branch = UserSvc.userBranch();
		} else{
			var branch = $stateParams.branch
		};

		BranchSvc.totalListFindByName(branch).success(function(branch){
			$scope.branch = branch;
			$scope.onDutyTotal = 0;
		});

		$scope.check = function(member){
			member.onDuty = !member.onDuty
		};

		$scope.save = function(){
			BranchSvc.updateDirector({
				branch   : $scope.branch.name,
				director : $scope.branch.director
			}).success(function(){
				for (var i = 0; i < $scope.branch.members.length; i++) {
					MemberSvc.updateByMemberId({
						name 	: $scope.branch.members[i].name,
						title   : $scope.branch.members[i].title,
						memberId : $scope.branch.members[i]._id,
						onDuty : $scope.branch.members[i].onDuty,
						mission :  $scope.branch.members[i].mission
					});
				};
			}).then(function(){
				$window.history.back();
			});
		};
	
}])
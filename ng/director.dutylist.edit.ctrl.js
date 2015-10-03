/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('DirDutyListEditCtrl', ['$scope', 'BranchSvc', '$stateParams','MemberSvc', '$location', '$window', 'UserSvc', 'CarSvc', 'StMissionFac',
	function ($scope, BranchSvc, $stateParams, MemberSvc, $location, $window, UserSvc, CarSvc, StMissionFac) {

		var branch = UserSvc.userBranch();

		BranchSvc.fetchByName(branch).success(function(branch){
			$scope.branch = branch;
			$scope.isCorps =  true ? branch.name.split("救災救護")[1] : false 
			var members = _.pluck(branch.members.filter(function(member) { return member.level < 2.4 }), 'name')
			$scope.branch.safetyManager 	= branch.safetyManager;
			$scope.branch.safetyManagers 	= members;
			$scope.onDutyTotal = 0;
			_.map($scope.branch.members,function(member){ 
				member.groupIds = _.range(1,Math.round($scope.branch.members.length/6),1);
				member.groupID = member.group + member.groupId 
			})
		})

		$scope.check = function(member){
			member.onDuty = !member.onDuty;
			member.isChecked = !member.isChecked;
			member.groupID = member.group + member.groupId
		};

		$scope.save = function(){

			var DispatchNumber = $scope.branch.members.filter(function(member) {
				return member.onDuty
			});

			BranchSvc.updateMission({
				branch   		: $scope.branch.name,
				director 		: $scope.branch.director,
				dispatchNum 	: DispatchNumber.length,
				safetyManager 	: $scope.branch.safetyManager,
				members 		: $scope.branch.members
			});
			$window.history.back();
		};
}])
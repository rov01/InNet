/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('DutyListEditCtrl', ['$scope', 'BranchSvc', '$stateParams','MemberSvc', '$location', '$window', 'UserSvc', 'CarSvc', 'StMissionFac',
	function ($scope, BranchSvc, $stateParams, MemberSvc, $location, $window, UserSvc, CarSvc, StMissionFac) {

		var branch = $stateParams.branch

		BranchSvc.totalListFindByName(branch).success(function(branch){
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
			// var branchGroups =  _.groupBy($scope.branch.members,function(member){
			// 	member.groupID = member.group + member.groupId;
			// 	// member.isChecked = true;
			// 	if (member.onDuty) { return member.groupID } else { return 'offDuty' };
			// });
			// delete branchGroups['offDuty']; 

		 //    var preStrikeTeams  = [];
		 //    var strikeTeamMembers = [];
		 //    var controlList = StMissionFac.groups().preSt; 
		 //    for (var key in branchGroups) {
		 //    	var strikeTeam = {
		 //      		caseId      : 'pending',
		 //      		branch      : branch,
		 //      		director    : $scope.branch.director,
		 //      		position    : StMissionFac.position().defaultPos,
		 //      		positions   : StMissionFac.position().poss,
		 //      		groups      : StMissionFac.groups().branch, 
		 //      		area 		: StMissionFac.area().defaultArea,
		 //      		areas 		: StMissionFac.area().areas,
		 //      		floor 		: 1,
		 //      		floors 		: [1],
		 //      		creator 	: UserSvc.currentUser() 	
			//      };
		    	
			//     if ( controlList.indexOf(key.slice(0, key.length-1 )) > -1 ) {
			    
			// 		strikeTeam.members = _.pluck(branchGroups[key],'_id');
			// 		strikeTeam.group = key;
			// 		strikeTeam.workingTime = _.min(branchGroups[key], function(member){ return member.workingTime }).workingTime;
			// 		preStrikeTeams.push(strikeTeam)
			// 		strikeTeamMembers.push.apply(strikeTeamMembers,strikeTeam.members)
			// 	};
		 //    };

			var DispatchNumber = $scope.branch.members.filter(function(member) {
				return member.onDuty
			});

			// $scope.branch.members.forEach(function(member){
			// 	member.isChecked = true ? strikeTeamMembers.indexOf(member._id) > -1 : false
			// });
			
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
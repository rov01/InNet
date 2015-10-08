/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('SafetyModalCtrl', ['$scope','$modalInstance', '$stateParams','StSvc', 'MemberSvc', '$state', '$window', 'UserSvc', 'BranchSvc','SocketSvc','branch', 'caseDetail', 'StMissionFac', 'stId',
	function ($scope, $modalInstance, $stateParams, StSvc, MemberSvc, $state, $window, UserSvc,  BranchSvc, SocketSvc, branch, caseDetail, StMissionFac, stId) {

		$scope.alerts = [];
		caseDetail.env == '住宅火警'? $scope.apartment =  true  : $scope.apartment = false 
 
		$scope.title = branch +  ( stId +  1 );
		

		BranchSvc.fetchByName(branch).success(function(details){
			$scope.details = details;
		}).then(function(){
			if ( $scope.details) {
				$scope.details.members = $scope.details.members.filter(function(member){
					return member.onDuty;  
				});
				$scope.details.members = $scope.details.members.filter(function(member){
					return member.isChecked;  
				});
				$scope.details.members.forEach(function(member){
					member.limitTime = moment.duration(member.workingTime, 'seconds');
				})
			};
		});

		$scope.strikeTeam = {
			position  : StMissionFac.position().defaultPos,
			positions : StMissionFac.position().poss,
			group     : StMissionFac.groups().branch[1],
			groups    : StMissionFac.groups().branch,
			area 	  : StMissionFac.area().defaultArea,
			areas 	  : StMissionFac.area().areas,
			floor 	  : caseDetail.floor, 
			floors    : caseDetail.floor < 5? _.range(1,6,1) : _.range(caseDetail.floor-2,caseDetail.floor+3,1)
		};

		$scope.check = function(member){
			member.isChecked = !member.isChecked;
		};

		$scope.cancel = function(){
			$modalInstance.dismiss('cancel');
		};

	    $scope.save = function(){

	    	var members = $scope.details.members.filter(function(member) { return member.isChecked === true });
	    	if (members.length > 2 ) {
		    	var strikeTeam = {
		      		id 		    : stId + 1 || 0 , 
		      		caseId      : $stateParams.caseId,
		      		branch      : $scope.details.name,
		      		director    : $scope.details.director,
		      		position    : $scope.strikeTeam.position,
		      		positions   : $scope.strikeTeam.positions,
		      		group       : $scope.strikeTeam.group,
		      		groups      : $scope.strikeTeam.groups, 
		      		area 		: $scope.strikeTeam.area,
		      		areas 		: $scope.strikeTeam.areas,
		      		floor 		: $scope.strikeTeam.floor,
		      		floors 		: $scope.strikeTeam.floors,
		      		memberIds   : _.pluck(members, '_id'),
		      		members     : members,
		      		workingTime : _.min(members, function(member){ return member.workingTime; }).workingTime,
		      		creator 	: UserSvc.currentUser() 	
		      	};
		      	SocketSvc.emit("createStrikeTeam", strikeTeam)
		      	$modalInstance.close();
	    	} else {
	    		$scope.alerts.push({ type : "danger" ,  msg: '兩人以上才能編組'});
	    	};
		};

		$scope.closeAlert = function(index){
			$scope.alerts.splice(index,1)
		};
}]);
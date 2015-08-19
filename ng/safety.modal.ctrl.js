/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('SafetyModalCtrl', ['$scope','$modalInstance', '$stateParams','StSvc', 'MemberSvc', '$state', '$window', 'stId', 'UserSvc', 'BranchSvc','SocketSvc','branch', 'caseDetail',
	function ($scope, $modalInstance, $stateParams, StSvc, MemberSvc, $state, $window, stId, UserSvc,  BranchSvc, SocketSvc, branch, caseDetail) {

		$scope.alerts = [];
		caseDetail.env == '住宅火警'? $scope.apartment =  true  : $scope.apartment = false 
 
		$scope.title = branch +  (stId + 1 );

		BranchSvc.fetchByName(branch).success(function(details){
			$scope.details = details;
		}).then(function(){
			if ( $scope.details) {
				$scope.details.members = $scope.details.members.filter(function(member){
					return member.isChecked != true;  
				});
				$scope.details.members.forEach(function(member){
					member.limitTime = moment.duration(member.workingTime, 'seconds');
				})
			};
		});

		$scope.strikeTeam = {
			position  : "第一面",
			positions : ["第一面","第二面","第三面","第四面"],
			mission   : "滅火小組",
			missions  : ["滅火小組","破壞小組","搜救小組"],
			area 	  : "第一區",
			areas 	  : ["第一區","第二區","第三區","第四區","第五區"],
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
	    	var members = $scope.details.members.filter(function(member) {
		    				return member.isChecked === true 
	    				});

	    	if (members.length > 2 ) {

		    	var strikeTeam = {
		      		id 		    : stId + 1 || 0 , 
		      		caseId      : $stateParams.id,
		      		branch      : $scope.details.name,
		      		director    : $scope.details.director,
		      		position    : $scope.strikeTeam.position,
		      		positions   : $scope.strikeTeam.positions,
		      		mission     : $scope.strikeTeam.mission,
		      		missions    : $scope.strikeTeam.missions, 
		      		area 		: $scope.strikeTeam.area,
		      		areas 		: $scope.strikeTeam.areas,
		      		floor 		: $scope.strikeTeam.floor,
		      		floors 		: $scope.strikeTeam.floors,
		      		members     : members,
		      		isDismissed : false,
		      		workingTime : _.min(members, function(member){ return member.workingTime; }).workingTime,
		      		creator 	: UserSvc.currentUser() 	
		      	};

	      		for (var i = members.length - 1; i >= 0; i--) {
	    			MemberSvc.updateIsChecked({
	    				memberId  : members[i]._id,
	    				isChecked : members[i].isChecked,
	    				mission	  : members[i].mission
	    			});		
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
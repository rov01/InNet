/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('SafetyModalCtrl', ['$scope','$modalInstance', '$stateParams','StSvc', 'MemberSvc', '$state', '$window', 'stId', 'UserSvc', 'BranchSvc','SocketSvc',
	function ($scope, $modalInstance, $stateParams, StSvc, MemberSvc, $state, $window, stId, UserSvc,  BranchSvc, SocketSvc) {

		var branch = UserSvc.userBranch(); 
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
			mission   : "搶救小組",
			missions  : ["搶救小組","救援小組","搜救小組"],
			area 	  : "第一區",
			areas 	  : ["第一區","第二區","第三區","第四區","第五區"]
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

	    	if (members.length > -1) {

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
	    			})		
		    	};

		      	StSvc.create(strikeTeam)
		      	$modalInstance.close();
	    	}else{
	    		$window.alert("you must organize strike team")
	    	};
		};
	
}]);
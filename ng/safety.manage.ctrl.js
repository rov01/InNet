/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('SafetyManageCtrl', ['$scope','$stateParams', '$modal', 'StSvc', '$state', 'MemberSvc','$log', 'UserSvc', 'BranchSvc', 'SocketSvc', 'CaseSvc',
	function ($scope, $stateParams, $modal, StSvc, $state, MemberSvc, $log, UserSvc, BranchSvc, SocketSvc, CaseSvc) {

		var BRANCH = UserSvc.userBranch();
		var caseDetail = null;

		$scope.quickStart =  false;
		$scope.apartment = true; 
		$scope.ACCESSLEVEL = UserSvc.accessLevel();

		$scope.branchOptions = {
			branch : BRANCH,
			branches : []
		};

		CaseSvc.findById($stateParams.id).success(function(_case){
			caseDetail = _case;
			_case.env == '住宅火警'? $scope.apartment = true : $scope.apartment = false; 
			$scope.branchOptions.branches = _case.branches
			$scope.branchOptions.branches.splice(0,0,BRANCH);
		});

		BranchSvc.fetchByName(BRANCH).success(function(details){
			$scope.details = details;
		}).then(function(){
			if ($scope.ACCESSLEVEL > 1 ) {
				StSvc.fetchByCase($stateParams.id).success(function(sts){
					$scope.strikeTeams = sts; 
				})
			} else {
				StSvc.fetch($stateParams.id,BRANCH).success(function(sts){
				$scope.strikeTeams = sts;
					if ($scope.details.members.length < 8 && _.isEmpty($scope.strikeTeams)) { $scope.quickStart = true  }; 
				}); 
			};
		});

		SocketSvc.on('newSt', function(st){
			if ($scope.ACCESSLEVEL > 1 && angular.equals($stateParams.id,st.caseId) ) {
					$scope.strikeTeams.push(st);
			} else {
				if (angular.equals(BRANCH,st.branch) && angular.equals($stateParams.id,st.caseId) ) {
					$scope.strikeTeams.push(st);
				};
			};
		});

		SocketSvc.on('updateSt', function(data){
			var members = angular.copy(data.members);
			for (var i = $scope.strikeTeams.length - 1; i >= 0; i--) {
				if(angular.equals($scope.strikeTeams[i]._id,data.id)){
					$scope.strikeTeams[i].position = data.position;
					$scope.strikeTeams[i].area = data.area;
					$scope.strikeTeams[i].members.push.apply($scope.strikeTeams[i].members, members);
				};
			};
		})

		SocketSvc.on('dismiss', function(st){
			var _stId = st.stId;
			$scope.strikeTeams = $scope.strikeTeams.filter(function(st) {				
				return st._id != _stId;
			});
		});
		
		$scope.strikeTeam = function(){
			var modalInstance = $modal.open({
			  	templateUrl: 'views/safety/safety.modal.html',
			    controller: 'SafetyModalCtrl',
			    size: "md",
			    resolve : {
			    	stId : function(){
			    		if ( _.isEmpty($scope.strikeTeams)) {
			    			return 0
			    		} else{
			    			return $scope.strikeTeams[$scope.strikeTeams.length-1].id;
			    		};
			    	},
			    	branch : function(){
			    		return $scope.branchOptions.branch;
			    	},
			    	caseDetail : function(){
			    		return caseDetail
			    	}
			    }
		    });
		};

		$scope.openSettingModal = function(strikeTeam, id){
	        var modalInstance = $modal.open({
	            templateUrl: 'views/safety/safety.setting.modal.html',
	            controller: 'SafetySettingCtrl',
	            size: "lg",
	            resolve: {
	                strikeTeam : function(){
	                    return strikeTeam;
	                }
	            }
	        });
	        modalInstance.result.then(function (updatedSt) {
	        	for (var i = $scope.strikeTeams.length - 1; i >= 0; i--) {
					if(angular.equals($scope.strikeTeams[i]._id,updatedSt.id)){
						$scope.strikeTeams[i].position = updatedSt.position;
						$scope.strikeTeams[i].area = updatedSt.area;
						$scope.strikeTeams[i].members.push.apply($scope.strikeTeams[i].members, updatedSt.members);
					};
				};

		    }, function () {
		      $log.info('Modal dismissed at: ' + new Date());
		    });
	    };

		$scope.dismiss = function(strikeTeam , id){
			
	       	StSvc.dismissSt({
	       		id : strikeTeam._id
	       	}).success(function(){
	       		for (var i = strikeTeam.members.length - 1; i >= 0; i--) {
		            MemberSvc.updateIsChecked({
		                memberId  : strikeTeam.members[i]._id,
		                mission	  : strikeTeam.members[i].mission,
		                isChecked : false
		            })
		        };	
	       	})
	       	$scope.strikeTeams.splice(id,1);
		};

		$scope.quickOrganizing = function(){
			$scope.quickStart = false;
		
			var members =  $scope.details.members.filter(function(member) {
				if ( member.mission == '司機' || member.mission == '安全管制員' || member.mission == '救護人員') {
					return false  
				}else{
					return true;
				}
			});

		 	var strikeTeam = {
	      		id 		    : 1, 
	      		caseId      : $stateParams.id,
	      		branch      : $scope.details.name,
	      		director    : $scope.details.director,
	      		position    : "第一面",
	      		positions   : ["第一面","第二面","第三面","第四面"],
	      		mission     : "滅火小組",
	      		missions    : ["滅火小組","破壞小組","搜救小組"],
	      		area 		: "第一區",
	      		areas 		: ["第一區","第二區","第三區","第四區","第五區"],
	      		members     : members,
	      		isDismissed : false,
	      		workingTime : _.min(members, function(member){ return member.workingTime; }).workingTime,
	      		creator 	: UserSvc.currentUser() 	
	      	};

	      	for (var i = members.length - 1; i >= 0; i--) {
    			MemberSvc.updateIsChecked({
    				memberId  : members[i]._id,
    				isChecked : true,
    				mission	  : members[i].mission
    			});		
		    };

	      	SocketSvc.emit("createStrikeTeam", strikeTeam);
		};

		$scope.$on('$destroy', function (event) {
	        SocketSvc.removeAllListeners();
	    })
}]);
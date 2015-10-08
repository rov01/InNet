/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('SafetyManageCtrl', ['$scope','$stateParams', '$modal', 'StSvc', '$state', 'MemberSvc','$log', 'UserSvc', 'BranchSvc', 'SocketSvc', 'CaseSvc', 'StMissionFac',
	function ($scope, $stateParams, $modal, StSvc, $state, MemberSvc, $log, UserSvc, BranchSvc, SocketSvc, CaseSvc, StMissionFac) {

		var BRANCH 		= UserSvc.userBranch();
		var caseDetail 	= null;

		$scope.quickStart 	= false;
		$scope.apartment 	= true; 
		$scope.ACCESSLEVEL 	= UserSvc.accessLevel();

		$scope.branchOptions = {
			branch : BRANCH,
			branches : []
		};

		CaseSvc.fetchById($stateParams.caseId).success(function(_case){
			caseDetail = _case;
			_case.env == '住宅火警'? $scope.apartment = true : $scope.apartment = false; 
			$scope.branchOptions.branches = _case.branches
			$scope.branchOptions.branches.splice(0,0,BRANCH);
		});

		BranchSvc.fetchByName(BRANCH).success(function(details){
			$scope.details = details;
		}).then(function(){
			if ($scope.ACCESSLEVEL > 1 ) {
				StSvc.fetchByCase($stateParams.caseId).success(function(sts){
					$scope.strikeTeams = sts; 
				});
			} else {
				StSvc.fetch($stateParams.caseId,BRANCH).success(function(sts){
					$scope.strikeTeams = sts;
					if ($scope.details.dispatchNum < 8 && _.isEmpty($scope.strikeTeams)) { $scope.quickStart = true  }; 
				}); 
			};
		});

		SocketSvc.on('newSt', function(st){
			if ($scope.ACCESSLEVEL > 1 && angular.equals($stateParams.caseId,st.caseId) ) {
					$scope.strikeTeams.push(st);
			} else {
				if (angular.equals(BRANCH,st.branch) && angular.equals($stateParams.caseId,st.caseId) ) {
					$scope.strikeTeams.push(st);
				};
			};
		});

		SocketSvc.on('updateSt', function(data){
			var members = angular.copy(data.members);
			for (var i = $scope.strikeTeams.length - 1; i >= 0; i--) {
				if(angular.equals($scope.strikeTeams[i]._id,data.id)){
					$scope.strikeTeams[i].position 	= data.position;
					$scope.strikeTeams[i].area 		= data.area;
					$scope.strikeTeams[i].floor 	= data.floor;
					$scope.strikeTeams[i].mission 	= data.mission;
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
	                },
	                caseDetail : function(){
	                	return caseDetail;
	                }
	            }
	        });
	    };

		$scope.dismiss = function(strikeTeam , id){

			SocketSvc.emit("dismissStrikeTeam",{
				id : strikeTeam._id,
				members : strikeTeam.members 
			});
	       	$scope.strikeTeams.splice(id,1);
		};

		$scope.quickOrganizing = function(){
			$scope.quickStart = false;
		
			var members =  $scope.details.members.filter(function(member) {
				if ( member.mission == '司機' || member.mission == '安全管制員' || member.mission == '救護人員') {
					return false  
				}else {
					member.isChecked = true;
					return member.onDuty;
				}
			});

			var strikeTeam = {
				id 		  : 1,
				caseId 	  : caseDetail._id,
				branch 	  : UserSvc.userBranch(),
				director  : _.pluck(members.filter(function(member) { return member.mission == '帶隊官'}),'name')[0],
				position  : StMissionFac.position().defaultPos,
				positions : StMissionFac.position().poss,
				group     : StMissionFac.groups().branch[1],
				groups    : StMissionFac.groups().branch,
				area 	  : StMissionFac.area().defaultArea,
				areas 	  : StMissionFac.area().areas,
				floor 	  : 1, 
				floors    : [1,2,3,4,5],
				memberIds : _.pluck(members,'_id'),
				members   : members,
				creator   : UserSvc.currentUser(),
			};
	      	SocketSvc.emit("createStrikeTeam", strikeTeam);
		};

		$scope.$on('$destroy', function (event) {
	        SocketSvc.removeAllListeners();
	    })
}]);
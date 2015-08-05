/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('SafetyManageCtrl', ['$scope','$stateParams', '$modal', 'StSvc', '$state', 'MemberSvc','$log', 'UserSvc', 'BranchSvc', 'SocketSvc',
	function ($scope, $stateParams, $modal, StSvc, $state, MemberSvc, $log, UserSvc, BranchSvc, SocketSvc) {

		var branch = UserSvc.userBranch();

		BranchSvc.fetchByName(branch).success(function(details){
			$scope.details = details;
		});

		StSvc.fetch($stateParams.id,branch).success(function(sts){
			$scope.strikeTeams = sts;
		});

		SocketSvc.on('newSt', function(st){
			if (angular.equals(branch,st.branch) && angular.equals($stateParams.id,st.caseId) ) {
				$scope.strikeTeams.push(st);
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
			    	}
			    }
		    });

		    modalInstance.result.then(function (st) {
		    	
		    }, function () {
		      $log.info('Modal dismissed at: ' + new Date());
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

		$scope.$on('$destroy', function (event) {
	        SocketSvc.removeAllListeners();
	    })
}]);
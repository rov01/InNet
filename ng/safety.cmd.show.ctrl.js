
angular.module('InNet')
.controller('SafetyCmdShowCtrl', ['$scope', 'CaseSvc', 'BranchSvc', 'UserSvc', '$stateParams', 'GeoSvc',
	function ($scope, CaseSvc, BranchSvc, UserSvc, $stateParams, GeoSvc) {

		var branch = UserSvc.userBranch();
		
		BranchSvc.totalListFindByName(branch).success(function(branch){
			$scope.members = branch.members.filter(function(member) {
				member.limitTime = moment.duration(member.workingTime, 'seconds');
				return member.onDuty == true 
			});
		});

		CaseSvc.fetchDetails($stateParams.caseId).success(function(_case){
			$scope.caseDetail = _case;
			$scope.onDutyBranches = _case.branchIds;
			if (_case.location) {
				var location = JSON.parse(_case.location);
				$scope.markers.mainMarker = {
					lat : Number(location.lat),
					lng : Number(location.lng),
					message : "案件標的"
				};

				$scope.battleRadiuss = _case.battleRadiuss;
			};
		}).then(function(){
			$scope.onDutyBranches.forEach(function(branch){
				branch.members.forEach(function(member){
					if (branch.director == member.name ) {
						branch.directorRadioCode = member.radioCodePrefix +  String(member.radioCode);
					};
					if (branch.safetyManager == member.name) {
						branch.safetyManagerRadioCode = member.radioCodePrefix + String(member.radioCode);
					};
				});

				if ($scope.battleRadius) {
					$scope.battleRadiuss.forEach(function(battleRadius){
						var radius = JSON.parse(battleRadius)
						if (branch.name == radius.base) {
							branch.estimatedArrivingTime =  Math.round(( radius.d / 50 ) * 60);
						};
					})		
				};
			});
		});

       GeoSvc.getGeolocationCoordinates().then(function(coord){
	        $scope.nowPos.lat = coord.latitude;
	        $scope.nowPos.lng = coord.longitude;
	        $scope.nowPos.zoom = 17;
	        $scope.markers.nowPos = {
	        	lat : $scope.nowPos.lat,
	        	lng : $scope.nowPos.lng,
	        	message : "現在位置"
	        }
	    })

	    angular.extend($scope, {
	        nowPos: {
	            lat: 24.988,
	            lng: 121.5752,
	            zoom: 13
	        },
	        markers: {},
	    });		
	
}])
/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('SafetyShowCtrl', ['$scope', 'CaseSvc', 'UserSvc', 'SocketSvc','GeoSvc', 'BranchSvc', '$stateParams',
	function ($scope, CaseSvc, UserSvc, SocketSvc, GeoSvc, BranchSvc, $stateParams) {
		
		var branch = UserSvc.userBranch();
		
		BranchSvc.fetchByName(branch).success(function(branch){
			$scope.members = branch.members.filter(function(member) {
				member.limitTime = moment.duration(member.workingTime, 'seconds');
				return member.onDuty == true 
			});
		});

		CaseSvc.fetchDetails($stateParams.caseId).success(function(_case){
			$scope.caseDetail = _case;
			if (_case.location) {
				var location = JSON.parse(_case.location);
				$scope.markers.mainMarker = {
					lat : Number(location.lat),
					lng : Number(location.lng),
					message : "案件標的"
				};
			};
		});

       GeoSvc.getGeolocationCoordinates().then(function(coord){
	        $scope.nowPos.lat = coord.latitude;
	        $scope.nowPos.lng = coord.longitude;
	        $scope.nowPos.zoom = 17;
	        $scope.markers.nowPos ={
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
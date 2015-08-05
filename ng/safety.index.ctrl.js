/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('SafetyIndexCtrl', ['$scope', 'CaseSvc', 'UserSvc', 'SocketSvc', '$rootScope',
	function ($scope, CaseSvc, UserSvc, SocketSvc, $rootScope) {

		SocketSvc.on('newCase',function(_case){
			$scope.cases.push(_case);
		});

		SocketSvc.on('caseClose',function(data){
			if (!data.isOngoing) {
				$scope.cases = $scope.cases.filter(function(_case){
					return _case._id != data.caseId
				})
			};
		});

		CaseSvc.fetchRelativeCase(UserSvc.userBranch()).success(function(cases){
			$scope.cases = cases;
		});

		$scope.$on('$destroy', function (event) {
	        SocketSvc.removeAllListeners();
	    })

		
}])
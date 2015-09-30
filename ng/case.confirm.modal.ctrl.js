angular.module('InNet')
.controller('CaseConfirmCtrl', ['$scope', 'UserSvc', 'CaseSvc', '$stateParams','$state','$modalInstance',
	function ($scope, UserSvc, CaseSvc, $stateParams, $state, $modalInstance) {
	
	$scope.user = {};
	$scope.caseInfo = {
		id : $stateParams.id,
		endAt : moment().format('YYYY-MMM-DD, h:mm:ss a')
	}
	$scope.send = function(){
		UserSvc.login($scope.user).success(function(data){
			CaseSvc.closeCase($scope.caseInfo).success(function(){
				$modalInstance.dismiss('cancel');
				$state.go('dutyDesk.case.index');
			})
		})
	};
}])
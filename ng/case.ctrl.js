/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('CaseCtrl', ['$scope','$stateParams','$modal','CaseSvc', '$log', 'SocketSvc', 'UserSvc', '$location',
	function ($scope , $stateParams, $modal, CaseSvc, $log, SocketSvc, UserSvc, $location) {

	$scope.maxSize = 5;
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	
	$scope.pageChanged = function(){
		CaseSvc.fetch(UserSvc.userCorps(), $scope.currentPage , $scope.itemsPerPage ).success(function(data){
			$scope.cases = data.cases;
		});
	};

	$scope.queryCases = function(){
		CaseSvc.fetch(UserSvc.userCorps(), $scope.currentPage, $scope.itemsPerPage).success(function(data){
			$scope.cases = data.cases;
			$scope.totalItems = data.totalCases;
		});
	}

	$scope.queryCases()

	SocketSvc.on('newCase',function(_case){
		$scope.cases.unshift(_case);
	});

	SocketSvc.on('caseModified',function(_case){
		$scope.cases[_case.caseId-1] = _case;
	});

	$scope.choose = function(id){
		CaseSvc.fetchById($scope.cases[id]._id).success(function(_case){
				$scope.caseDetails = _case;
		});
	};

}])

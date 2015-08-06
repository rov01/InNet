/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('CaseCtrl', ['$scope','$stateParams','$modal','CaseSvc', '$log', 'SocketSvc', 'UserSvc',
	function ($scope , $stateParams, $modal, CaseSvc, $log, SocketSvc, UserSvc) {

	$scope.maxSize = 5;
	$scope.bigTotalItems = 175;
	$scope.bigCurrentPage = 1;

	CaseSvc.fetch(UserSvc.userCorps()).success(function(cases){
		$scope.cases = cases;
	});

	SocketSvc.on('newCase',function(_case){
		$scope.cases.unshift(_case);
	});

	SocketSvc.on('caseModified',function(_case){
		$scope.cases[_case.caseId-1] = _case;
	});

	$scope.choose = function(id){
		CaseSvc.findById($scope.cases[id]._id).success(function(_case){
				$scope.caseDetails = _case;
		});
	};

	$scope.addNewCase = function () {
	  	var modalInstance = $modal.open({
		    templateUrl: 'views/case/case.modal.html',
		    controller: 'CaseModalCtrl',
		    size: "lg",
		    resolve : {
		    	caseId : function(){
			    		if ( _.isEmpty($scope.cases)) {
			    			return 0
			    		} else{
			    			return $scope.cases[0].caseId;
			    		};
			    },
		    	caseDetails : function(){
		    		return {}
		    	}
		    }
	    });
	    modalInstance.result.then(function (msg) {
	      // $scope.cases.unshift(newCase);
	      console.log(msg);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	 };

	 $scope.editCase = function(id){
	 	var modalInstance = $modal.open({
		  	templateUrl: 'views/case/case.modal.html',
		    controller: 'CaseModalCtrl',
		    size: "lg",
		    resolve : {
		    	caseId : function(){
		    		return id
		    	},
		    	caseDetails : function(){
		    		return $scope.caseDetails
		    	}
		    }
	    });
	 };
}])

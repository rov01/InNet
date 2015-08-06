/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('DispatchCtrl', ['$scope','$stateParams','$modal','CaseSvc','BranchSvc', 'CarSvc', 'UserSvc',
	function ($scope , $stateParams, $modal, CaseSvc, BranchSvc, CarSvc, UserSvc) {

	CaseSvc.fetch(UserSvc.userCorps()).success(function(cases){
		$scope.cases = cases;
		CaseSvc.findById($scope.cases[$stateParams.caseId]._id).success(function(_case){
				$scope.caseDetails = _case
		})
	})

	BranchSvc.fetch(UserSvc.userCorps()).success(function(branches){
	    $scope.branchList = branches;

	 })

	CarSvc.fetch().success(function(data){
	    $scope.carsData = data
	})

	$scope.addNewCase = function () {
	  	var modalInstance = $modal.open({
		    templateUrl: '/partials/casePanel/caseAddModal',
		    controller: 'CaseAddModalCtrl',
		    size: "lg",
		    resolve : {
		    	caseId : function(){
		    		return $scope.id = "新增案件"
		    	},
		    	branchList : function(){
		    		return $scope.branchList
		    	},
		    	carsData : function(){
		    		return $scope.carsData
		    	},
		    	isNew : function(){
		    		return true
		    	},
		    	caseDetails : function(){
		    		return {}
		    	}
		    }
	    });
	 };

	 $scope.editCase = function(){
	 	var modalInstance = $modal.open({
		    templateUrl: '/partials/casePanel/caseAddModal',
		    controller: 'CaseAddModalCtrl',
		    size: "lg",
		    resolve : {
		    	caseId : function(){
		    		return $scope.id = $scope.cases[$stateParams.caseId].caseId 
		    	},
		    	branchList : function(){
		    		return $scope.branchList
		    	},
		    	carsData : function(){
		    		for (var i = $scope.carsData.length - 1; i >= 0; i--) {
		    			for (var j = $scope.caseDetails.cars.length - 1; j >= 0; j--) {
		    				if ( $scope.carsData[i].radioCode === $scope.caseDetails.cars[j].radio_code) {
		    					$scope.carsData[i].isChecked = true 
		    				};
		    			};		    			
		    		};
		    		return $scope.carsData
		    	},
		    	isNew : function(){
		    		return false 
		    	},
		    	caseDetails : function(){
		    		return $scope.caseDetails
		    	}
		    }
	    });
	 };

}])
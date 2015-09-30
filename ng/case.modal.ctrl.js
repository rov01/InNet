/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('CaseModalCtrl', ['$scope', 'CarSvc', '$modalInstance', 'CaseSvc','$state', 'caseId','caseDetails', 'StSvc', '$window', 'BranchSvc', 'UserSvc', 'NtfSvc',
	function ($scope, CarSvc, $modalInstance, CaseSvc, $state, caseId, caseDetails, StSvc , $window, BranchSvc, UserSvc, NtfSvc) {

	if (_.isEmpty(caseDetails)) {
		$scope.isNew = true;
		carObjs = [];

	}else{
		$scope.isNew = false;
		var carObjs = caseDetails.cars;
	};
	
	$scope.nftOption = {};

	NtfSvc.fetch().success(function(nfts){
		$scope.nftOption.nfts = nfts;
	}).then(function(){
		$scope.nftOption.nft = $scope.nftOption.nfts[0];
	})

	BranchSvc.fetchByCorps(UserSvc.userCorps()).success(function(branches){
	    $scope.branches = branches;
	});

	function getCarsDetail(obj){
		var dispatchList = [];
		var carIds = [];
		var branches = [];

		if (obj.cars) {
			for (var i = obj.cars.length - 1; i >= 0; i--) {
				dispatchList.push(obj.cars[i].radioCode);
				carIds.push(obj.cars[i]._id);
				branches.push(obj.cars[i].branch); 
			};
			return {dispatchList : dispatchList , carIds : carIds , branches :  branches}

		}else{
			return {};
		};
	};

	function getBranchId(branchesList){
		var branches = _.unique(branchesList);
		var branchIds = [];
		for (var i = 0; i < $scope.branches.length; i++) {
			if (branches.indexOf($scope.branches[i].name) > -1) {
				branchIds.push($scope.branches[i]._id);
			};
		};
		return  branchIds;
	};

	$scope.caseObj = {
		address : caseDetails.address || null,
		phone : caseDetails.phone || null,
	    type : caseDetails.type ||  "火警", 
	    types : [ "火警", "救護", "災害", "檢舉","其他"],
	    env   : "住宅火警",
	    envs  : ["住宅火警","高樓、地下與工廠","搶救困難區","其他"],
	    floor : 1, 
	    carIds : getCarsDetail(caseDetails).carIds  || [],
	    dispatchList : getCarsDetail(caseDetails).dispatchList ||  [],
	    branches : getCarsDetail(caseDetails).branches ||  []
	};

	$scope.dispatchList = $scope.caseObj.dispatchList.join(" ");

	$scope.getCars = function( branch ){
		 CarSvc.fetchByBranch(branch.name).success(function(cars){
		 	for (var i = cars.length - 1; i >= 0; i--) {
		 		if ($scope.caseObj.carIds.indexOf(cars[i]._id) > -1 ) {
		 			cars[i].isChecked = true; 
		 		};
		 	};
		 	$scope.cars = cars;
		 });
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.cancelDispatch = function(car){
		car.isChecked = false;
		carObjs.splice(carObjs.indexOf(car),1)
		$scope.caseObj.carIds.splice($scope.caseObj.dispatchList.indexOf(car._id),1);
		$scope.caseObj.dispatchList.splice($scope.caseObj.dispatchList.indexOf(car.radioCode),1);
		$scope.caseObj.branches.splice($scope.caseObj.dispatchList.indexOf(car.branch),1);
		$scope.dispatchList = $scope.caseObj.dispatchList.join(" ");
	};

	$scope.dispatch = function( car ){
		car.isChecked = true; 
		carObjs.push(car);
		$scope.caseObj.carIds.push(car._id);
		$scope.caseObj.dispatchList.push(car.radioCode);
		$scope.caseObj.branches.push(car.branch);
		$scope.dispatchList = $scope.caseObj.dispatchList.join(" ");
	};

	$scope.closeCase = function(){
		StSvc.count(caseDetails._id).success(function(total){
			if (total > 0 ) {
				$window.alert("尚有隊員在安全管制")
			}else{
				CaseSvc.closeCase({
					id : caseDetails._id,
					isOngoing : false
				}).success(function(msg){
					console.log(msg)
				});
				$modalInstance.dismiss('cancel');
				$state.reload()
			};
		});
	};

	$scope.save = function(){
		CaseSvc.create({
			caseId   : caseId + 1, 
			address   : $scope.caseObj.address || "測試",
			officerReceiver : UserSvc.currentUser() ||  "劉曉曼",
			type      : $scope.caseObj.type || "救護",
			phone     : $scope.caseObj.phone || "測試",
			branches  : _.unique($scope.caseObj.branches),
			branchIds : getBranchId($scope.caseObj.branches),
	  		cars      : $scope.caseObj.carIds,
			isOngoing : true,
			corps 	  : UserSvc.userCorps(),
			env 	  : $scope.caseObj.env,
			floor 	  : $scope.caseObj.floor
		}).success(function(newCase){
			$modalInstance.close(newCase)
		});
	};

	$scope.update = function(){
		var content = {
			id : caseDetails._id,
			caseId   : caseId, 
			address   : $scope.caseObj.address,
			officerReceiver : UserSvc.currentUser() || "劉曉曼",
			type      : $scope.caseObj.type,
			phone     : $scope.caseObj.phone,
			branches  : _.unique($scope.caseObj.branches),
			branchIds : getBranchId($scope.caseObj.branches),
	  		cars      : $scope.caseObj.carIds,
			isOngoing : true,
			env 	  : $scope.caseObj.env,
			floor 	  : $scope.caseObj.floor
		};
		
		CaseSvc.update(content);
		$modalInstance.dismiss('cancel');
	};
}]);
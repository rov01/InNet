angular.module('InNet')
.controller('CaseEditCtrl', ['$scope', '$stateParams', 'CaseSvc', 'CarSvc', 'UserSvc', 'BranchSvc', '$window', '$modal','NtfSvc',
	function ($scope, $stateParams, CaseSvc, CarSvc, UserSvc, BranchSvc, $window, $modal, NtfSvc ) {

	var dispatchCars = [];

	 angular.extend($scope, {
        nowPos: {
            lat: 24.988,
            lng: 121.5752,
            zoom: 17
        },
        controls: {
            draw: {}
        }
    });

	var caseId = $stateParams.id;

	BranchSvc.fetchByCorps(UserSvc.userCorps()).success(function(branches){
	    $scope.branches = branches;
	    $scope.currentBranch = branches[0].name
	});

	$scope.selectBranch = function(branch){
    	$scope.currentBranch = branch.name;
    };

	BranchSvc.fetchByCorps(UserSvc.userCorps()).success(function(branches){
	    $scope.branches = branches;
	    $scope.currentBranch = branches[0].name
	})

	CaseSvc.fetchById(caseId).success(function(_case){
		$scope.currentCase = _case;
		$scope.dispatchList = _.pluck(_case.cars, 'radioCode').join(' ')
		$scope.currentCase.carIds = _.pluck(_case.cars,'_id');
	}).then(function(){
		CarSvc.fetchByCorps(UserSvc.userCorps()).success(function(cars){
			$scope.cars = cars
			for (var i = 0; i < $scope.cars.length; i++) {
				if ( $scope.currentCase.carIds.indexOf($scope.cars[i]._id) > -1 ) {
					$scope.cars[i].isChecked = true;
					dispatchCars.push($scope.cars[i]);
				};
			};
		});

		NtfSvc.fetch().success(function(ntfs){
			$scope.ntfs = ntfs;
			$scope.currentCase.ntfs = _.pluck(ntfs,'type')
			$scope.currentCase.ntf  = $scope.currentCase.ntfs[0];
		});
	});

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

	$scope.dispatch = function( car ){
		car.isChecked = true; 
		dispatchCars.push(car);
		$scope.dispatchList = _.pluck(dispatchCars, 'radioCode').join(" ")
	};

	$scope.cancelDispatch = function(car){
		car.isChecked = false;
		dispatchCars.splice(_.pluck(dispatchCars, '_id').indexOf(car._id),1)
		$scope.dispatchList = _.pluck(dispatchCars, 'radioCode').join(" ")
	};


	$scope.save = function(){
		var currentNtf;

		$scope.ntfs.forEach(function(ntf,id){
			if (ntf.type == $scope.currentCase.ntf ) {
				currentNtf  = $scope.ntfs[id];
			};
		});
		CaseSvc.update({
			caseId    : $scope.currentCase._id,
			address   : $scope.currentCase.address || "測試",
			officerReceiver : UserSvc.currentUser() ||  "劉曉曼",
			type      : $scope.currentCase.type || "火警",
			types 	  : $scope.currentCase.types,
			phone     : $scope.currentCase.phone || "測試",
			branches  : _.unique(_.pluck(dispatchCars, 'branch')),
			branchIds : getBranchId($scope.currentCase.branches),
	  		cars      : _.pluck(dispatchCars,'_id'),
			isOngoing : true,
			corps 	  : UserSvc.userCorps(),
			env 	  : $scope.currentCase.env,
			envs 	  : $scope.currentCase.envs,
			floor 	  : $scope.currentCase.floor,
			ntf       : currentNtf._id,
			lastUpdate : moment().format('YYYY-MMM-DD h:mm:ss a')
		}).success(function(){
			$window.history.back();
		})
	};

	$scope.terminateCase = function(){
		var modalInstance = $modal.open({
		  	templateUrl: 'views/case/case.confirm.modal.html',
		    controller: 'CaseConfirmCtrl',
		    size: "md"	    
		});
	};
}])
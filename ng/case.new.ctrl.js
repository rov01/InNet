angular.module('InNet')
.controller('CaseNewCtrl', ['$scope', 'CarSvc', 'BranchSvc', 'NtfSvc', 'UserSvc','$location','leafletData', '$stateParams', 'CaseSvc', '$window', '$state', 'GeoSvc',
	function ($scope, CarSvc, BranchSvc, NtfSvc, UserSvc, $location,leafletData, $stateParams, CaseSvc, $window, $state, GeoSvc) {
	
	'use strict';

	GeoSvc.fetchBaseLocation(UserSvc.userCorps()).success(function(locations){
		$scope.locations = locations;
	});

	var battleRadiuss = []; 

	$scope.locateAddress = function(){
		if ($scope.currentCase.address) {
			GeoSvc.getGeoEncodedInfo($scope.currentCase.address).then(function(res){
		        $scope.nowPos.lat = res.J;
		        $scope.nowPos.lng = res.M;
	            $scope.markers.mainMarker = {
	            	lat: res.J,
	                lng: res.M,
	                focus: true,
	                message: "案件標的",
	            };

	            if (res) {
	            	$scope.locations.forEach(function(location){
		            	var r = GeoSvc.getDistance( location, { lat : res.J , lng : res.M } );
		            	var battleRadius =  { base : location.branch,  to : { lat : res.J, lng :  res.M }, from : { lat : location.lat, lng : location.lng }, d : r }; 
		            	battleRadiuss.push( JSON.stringify(battleRadius));
		            });
	            };
			});
		};
	};
	
	var dispatchCars = [];
	var notifications;

	$scope.currentCase = {
		phone 	: null,
	    type 	: '火警', 
	    types 	: [ '火警', '救護', '災害', '檢舉','其他'],
	    env   	: '住宅火警',
	    envs  	: ['住宅火警','高樓、地下與工廠','搶救困難區','其他'],
	    floor 	: 1, 
	    carIds  : [],
	    dispatchList : [],
	    branches :  [],
	    location : GeoSvc.defaultLocation()
	};

	$scope.dispatchList = $scope.currentCase.dispatchList.join(' ');

    angular.extend($scope, {
        nowPos: {
            lat: GeoSvc.defaultLocation().lat,
            lng: GeoSvc.defaultLocation().lng,
            zoom: 17
        },
       markers: {},
    });
   
    $scope.selectBranch = function(branch){
    	$scope.currentBranch = branch.name;
    };

	BranchSvc.fetchByCorps(UserSvc.userCorps()).success(function(branches){
	    $scope.branches = branches;
	    $scope.currentBranch = branches[0].name
	});

	CarSvc.fetchByCorps(UserSvc.userCorps()).success(function(cars){
		$scope.cars = cars; 
	});

	NtfSvc.fetch().success(function(ntfs){
		notifications = ntfs;
		$scope.currentCase.ntfs = _.pluck(ntfs,'type')
		$scope.currentCase.ntf  = $scope.currentCase.ntfs[0];
	});

	$scope.currentTime =  moment().format('h:mm:ss a');

	$scope.dispatch = function( car ){
		car.isChecked = true; 
		dispatchCars.push(car);
		$scope.dispatchList = _.pluck(dispatchCars, 'radioCode').join(" ");
	};

	$scope.cancelDispatch = function(car){
		car.isChecked = false;
		dispatchCars.splice(_.pluck(dispatchCars, '_id').indexOf(car._id),1);
		$scope.dispatchList = _.pluck(dispatchCars, 'radioCode').join(" ");
		$scope.dispatchList = $scope.currentCase.dispatchList.join(" ");
	};


	$scope.save = function(){

		var currentNtf;
		var branches  = _.unique(_.pluck(dispatchCars, 'branch'));
		var dispatch = $scope.branches.filter(function(branch) { return branches.indexOf(branch.name) > -1 });

		notifications.forEach(function(ntf,id){
			if (ntf.type == $scope.currentCase.ntf ){
				currentNtf  = notifications[id]
			};
		});

		CaseSvc.create({
			officerReceiver : UserSvc.currentUser() ||  '劉曉曼',
			type      		: $scope.currentCase.type || '火警',
			types 	  		: $scope.currentCase.types,
			phone     		: $scope.currentCase.phone || '測試',
			branches  		: _.unique(_.pluck(dispatchCars, 'branch')),
			branchIds 		: _.pluck(dispatch, '_id'),
	  		cars      		: _.pluck(dispatchCars,'_id'),
			corps 	  		: UserSvc.userCorps(),
			env 	  		: $scope.currentCase.env,
			envs 	  		: $scope.currentCase.envs,
			floor 	  		: $scope.currentCase.floor,
			ntf       		: currentNtf._id,
			createAt  		: moment().format('YYYY-MMM-DD, h:mm:ss a'),
			lastUpdate 		: moment().format('YYYY-MMM-DD, h:mm:ss a'),
			location  		:  {
				lat 	: $scope.currentCase.location.lat,
				lng 	: $scope.currentCase.location.lng,
				address : $scope.currentCase.location.address || '測試'
			},
			battleRadiuss 	: battleRadiuss
		}).success(function(){
			$window.history.back();
		});
	};
}])
/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('SummaryCtrl', ['$scope', 'StSvc', '$stateParams', '$interval', '$state', 'SocketSvc', 'CaseSvc',
	function ($scope, StSvc, $stateParams, $interval, $state, SocketSvc, CaseSvc) {
		$scope.isCollapsed = true ;
		$scope.members = [];

		SocketSvc.on('timerRunning',function(st){
			for (var i = $scope.strikeTeams.length - 1; i >= 0; i--) {
				if( angular.equals($scope.strikeTeams[i]._id, st.stId)){
					$scope.strikeTeams[i].timerRunning = st.timerRunning;
				}
			};
		})

		SocketSvc.on('progressUpdate',function(data){
			for (var i = $scope.strikeTeams.length - 1; i >= 0; i--) {
				if( angular.equals($scope.strikeTeams[i]._id, data.id) ){
					$scope.strikeTeams[i].timer	= moment.duration(data.millis); 
					$scope.strikeTeams[i].progress  = data.progress;
					$scope.strikeTeams[i].progressState =  data.progressState;
				}
			};
		})

		SocketSvc.on('newSt', function(st){
			if ( angular.equals(caseId,st.caseId)) {
				var newSt = angular.copy(st);
				$scope.strikeTeams.push(newSt);
			};
			$scope.deploys = initTable($scope.strikeTeams);
		});

		

		SocketSvc.on('updateSt', function(data){
			StSvc.fetchByCase(caseId).success(function(strikeTeams){
				$scope.strikeTeams = strikeTeams;
				$scope.strikeTeams.forEach(function(st){
					st.limitTime = moment.duration(st.workingTime,'seconds');
				});
				$scope.deploys = initTable($scope.strikeTeams);
			});

		})

		SocketSvc.on('dismiss', function(data){
			StSvc.fetchByCase(caseId).success(function(strikeTeams){
				$scope.strikeTeams = strikeTeams;
				$scope.deploys = initTable($scope.strikeTeams);
			});
		});


		var caseId = $stateParams.caseId;
		CaseSvc.fetchById(caseId).success(function(_case){
			_case.env == '住宅火警' ? $scope.apartment = true : $scope.apartment = false;
			$scope.caseDetail = _case;
			$scope.position = {
				defaultPos 	: "第一面",
				positions 	: ["第一面","第二面","第三面","第四面"],
				floor 		: $scope.caseDetail.floor,
				floors  	: $scope.caseDetail.floor < 5? _.range(1,6,1) : _.range($scope.caseDetail.floor-2,$scope.caseDetail.floor+3,1)
			};
		})

		StSvc.fetchByCase(caseId).success(function(strikeTeams){
			if (strikeTeams) {
				$scope.strikeTeams = strikeTeams;
				$scope.strikeTeams.forEach(function(st){
					st.limitTime = moment.duration(st.workingTime,'seconds');
				});
				$scope.deploys = initTable($scope.strikeTeams);
			} else {
				return 
			};
		});



		var initTable =  function(strikeTeams){
		  	var deployArray = _.range(4).map(function () {
		        return _.range(5).map(function () {
		            return { totalMember : 0, stTotal : 0 , sts : [] } ;
		        });
		    });

			if ( strikeTeams ){
				for (var i = strikeTeams.length - 1; i >= 0; i--) {
					var totalMember = 0;
					var y = null;
					var st = 0;
					var x = _.indexOf(strikeTeams[i].positions, strikeTeams[i].position);
					$scope.apartment ? y = _.indexOf(strikeTeams[i].floors, strikeTeams[i].floor) : y = _.indexOf(strikeTeams[i].areas, strikeTeams[i].area)
					deployArray[x][y].stTotal += 1;
					deployArray[x][y].totalMember += strikeTeams[i].members.length;
					var stInFo = {};
					stInFo.id = strikeTeams[i].branch + strikeTeams[i].id
					stInFo.number = strikeTeams[i].members.length;
					stInFo.group = strikeTeams[i].group;
					deployArray[x][y].sts.push(stInFo);
				};
			}
			return deployArray
		};
		
		$scope.$on('$destroy', function (event) {
	        SocketSvc.removeAllListeners();
	    });
}]);
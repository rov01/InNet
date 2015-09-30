

angular.module('InNet')
.controller('CaseShowCtrl', ['$scope', 'StSvc', '$stateParams', '$interval', '$state', 'SocketSvc', 'CaseSvc', 'BranchSvc', 'StMissionFac',
	function ($scope, StSvc, $stateParams, $interval, $state, SocketSvc, CaseSvc, BranchSvc, StMissionFac) {
		$scope.isCollapsed = true ;
		$scope.members = [];
		$scope.positions = StMissionFac.position().poss;

		SocketSvc.on('newSt', function(st){
			if ( angular.equals(caseId,st.caseId)) {
				var newSt = angular.copy(st);
				$scope.strikeTeams.push(newSt);
			};
			$scope.deploys = initTable($scope.strikeTeams);
			$scope.deployDetails = initDeploy($scope.strikeTeams);
		});

		SocketSvc.on('updateSt', function(data){
			StSvc.fetchByCase(caseId).success(function(strikeTeams){
				$scope.strikeTeams = strikeTeams;
				$scope.strikeTeams.forEach(function(st){
					st.limitTime = moment.duration(st.workingTime,'seconds');
				});
				$scope.deploys = initTable($scope.strikeTeams);
				$scope.deployDetails = initDeploy($scope.strikeTeams);
			});

		})

		SocketSvc.on('dismiss', function(data){
			StSvc.fetchByCase(caseId).success(function(strikeTeams){
				$scope.strikeTeams = strikeTeams;
				$scope.deploys = initTable($scope.strikeTeams);
				$scope.deployDetails = initDeploy($scope.strikeTeams);
			});
		});


		var caseId = $stateParams.id;
		CaseSvc.fetchById(caseId).success(function(_case){
			_case.env == '住宅火警' ? $scope.apartment = true : $scope.apartment = false;
			$scope.caseDetail = _case;
			$scope.position = {
				defaultPos 	: "第一面",
				positions 	: ["第一面","第二面","第三面","第四面"],
				floor 		: $scope.caseDetail.floor,
				floors  	: $scope.caseDetail.floor < 5? _.range(1,6,1) : _.range($scope.caseDetail.floor-2,$scope.caseDetail.floor+3,1)
			};
		}).then(function(){
			BranchSvc.fetchOnDutyBranches($scope.caseDetail.branches).success(function(branches){
				$scope.onDutyBranches = branches; 
			});
		});


		StSvc.fetchByCase(caseId).success(function(strikeTeams){
			if (strikeTeams) {
				$scope.strikeTeams = strikeTeams;
				$scope.strikeTeams.forEach(function(st){
					st.limitTime = moment.duration(st.workingTime,'seconds');
				});
				$scope.deploys = initTable($scope.strikeTeams);
				$scope.deployDetails =initDeploy($scope.strikeTeams);
				
			} else {
				return 
			};
		});


		var initDeploy = function(strikeTeams){
			return  _.groupBy(strikeTeams,function(st){
					return st.position;
			});
		};

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
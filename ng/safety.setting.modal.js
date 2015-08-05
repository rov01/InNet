/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('SafetySettingCtrl', ['$scope', 'strikeTeam', '$modalInstance', 'StSvc', '$state', 'MemberSvc', 'CaseSvc', '$stateParams', 'SocketSvc',
	function ($scope, strikeTeam, $modalInstance, StSvc, $state, MemberSvc, CaseSvc, $stateParams, SocketSvc) {
		
		var members = [];
		var memberObjs =[];
		$scope.strikeTeam = strikeTeam;

		CaseSvc.fetchDetails($stateParams.id).success(function(details){
			$scope.dispatch = details.branchIds;
		});

		$scope.chooseBranch = function(id){
			$scope.members = $scope.dispatch[id].members
			for (var i = $scope.members.length - 1; i >= 0; i--) {
				if( $scope.members[i].isChecked ){
					$scope.members.splice(i,1);
				};
			};
		};

		$scope.cancel = function(){
			$modalInstance.dismiss('cancel');
		};

		$scope.check = function(member){
			member.isChecked = !member.isChecked;
			members.push(member._id);
			memberObjs.push(member);
		};

		$scope.uncheck = function(member, id){
			member.isChecked = !member.isChecked;
			members.splice(id,1);
			memberObjs.splice(id,1);
		}

		$scope.save = function(){

			StSvc.updateSt({
				id : strikeTeam._id,
				position : strikeTeam.position,
				area : strikeTeam.area,
				mission : strikeTeam.mission,
				memberIds : members
			}).success(function(){
				for (var i = members.length - 1; i >= 0; i--) {
		            MemberSvc.updateIsChecked({
		                memberId  : members[i]._id,
		                mission	  : members[i].mission, 
		                isChecked : true,
		            })
		        };
			})

			$modalInstance.close({
				id : strikeTeam._id,
				position : strikeTeam.position,
				area : strikeTeam.area,
				members : memberObjs,
				caseId  : strikeTeam.caseId 
			});

			
		};
}])
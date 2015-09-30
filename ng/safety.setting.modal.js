/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('SafetySettingCtrl', ['$scope', 'strikeTeam', '$modalInstance', 'StSvc', '$state', 'MemberSvc', 'CaseSvc', '$stateParams', 'SocketSvc', 'caseDetail',
	function ($scope, strikeTeam, $modalInstance, StSvc, $state, MemberSvc, CaseSvc, $stateParams, SocketSvc, caseDetail ) {
		
		$scope.strikeTeam = strikeTeam;
		caseDetail.env == '住宅火警'? $scope.apartment =  true  : $scope.apartment = false 

		var newMembers = [];

		CaseSvc.fetchDetails($stateParams.caseId).success(function(details){
			$scope.dispatch = details.branchIds;
			$scope.currentBranch = $scope.dispatch[0].name;
			var memberList = _.pluck(details.branchIds,'members');
			$scope.members = []
			memberList.forEach(function(branchMembers){
				$scope.members.push.apply($scope.members, branchMembers)
			});
			$scope.members = $scope.members.filter(function(member) { return !member.isChecked });
		})

		$scope.chooseBranch = function(branch){
			$scope.currentBranch = branch;
		};

		$scope.cancel = function(){
			$modalInstance.dismiss('cancel');
		};

		$scope.check = function(member){
			member.isChecked = !member.isChecked;
			newMembers.push(member)
		};

		$scope.uncheck = function(member, id){
			member.isChecked = !member.isChecked;
			newMembers.splice(_.pluck(newMembers, '_id').indexOf(member._id),1);
		};

		$scope.save = function(){
			$scope.strikeTeam.members.push.apply($scope.strikeTeam.members, newMembers)

			SocketSvc.emit('updateStrikeTeam',{
				id : strikeTeam._id, 
				position : strikeTeam.position,
				area : strikeTeam.area, 
				floor : strikeTeam.floor,
				group : strikeTeam.group,
				memberIds : _.pluck($scope.strikeTeam.members,'_id'), 
				members : $scope.strikeTeam.members
			})

			$modalInstance.close('dismiss');			
		};
}])
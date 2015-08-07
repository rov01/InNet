/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('MemberCtrl', ['$scope', 'MemberSvc', '$stateParams',
	function ($scope, MemberSvc, $stateParams) {

		$scope.branch = $stateParams.branch;

		MemberSvc.findByBranch($stateParams.branch).success(function(members){
			$scope.members = members;
			$scope.members.forEach(function(member){
				member.workingTime = moment.duration(member.workingTime,'seconds');
			});
		});

}])
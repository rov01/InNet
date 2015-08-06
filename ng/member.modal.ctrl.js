/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('MemberModalCtrl', ['$scope', 'branch', 'MemberSvc', '$modalInstance', '$state', 'member','BranchSvc',
	function ($scope, branch, MemberSvc, $modalInstance, $state, member, BranchSvc ) {

	$scope.isNew = _.isEmpty(member);
	
	BranchSvc.fetch(UserSvc.userCorps())
	.success(function(branches){
		$scope.branches = branches 
	})
	.then(function(){
		var branchesList = [];
		for (var i = 0; i < $scope.branches.length; i++) {
			branchesList.push($scope.branches[i].name);
		};
		$scope.member = {
			name 	: member.name || "新進人員", 
			title   : member.title,
			titles  : ["隊員","小隊長","分隊長","中隊長","大隊長","副大隊長"],
			branch  : branch,
			branches : branchesList,
			corp 	: "第一救災救護大隊",
			corps 	: ["第一救災救護大隊"],
		};
	})

	$scope.save = function(){
		MemberSvc.create({
			  onDuty: "true",
			  id: "",
			  name: $scope.member.name || "王小明",
			  corp: $scope.member.corp,
			  branch: $scope.member.branch,
			  title: $scope.member.title,
			  isChecked: "false",
			  mission : "瞄子手",
			  missions : ["瞄子手","副瞄子手","司機","帶隊官","安全管制員","聯絡官"]
		});
		$modalInstance.dismiss('cancel');
		$state.reload();
	};

	$scope.update = function(){
		MemberSvc.updateByMemberId({
			  memberId  : member._id,
			  id 		: "",
			  name 		: $scope.member.name,
			  corp 		: $scope.member.corp,
			  branch 	: $scope.member.branch,
			  title 	: $scope.member.title,
			  mission 	: "瞄子手",
			  missions  : ["瞄子手","副瞄子手","司機","帶隊官","安全管制員","聯絡官"]
		});
		$modalInstance.dismiss('cancel');
		$state.reload();
	};

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
	
}])
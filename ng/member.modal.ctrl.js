/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('MemberModalCtrl', ['$scope', 'branch', 'MemberSvc', '$modalInstance', '$state', 'member','BranchSvc', 'UserSvc',
	function ($scope, branch, MemberSvc, $modalInstance, $state, member, BranchSvc, UserSvc) {
	
	$scope.alerts = [];
	$scope.isNew = _.isNull(member.workingTime);

	$scope.member = {
		id 		 	: member.id ||  "", 
		name 	 	: member.name || null , 
		title    	: "消防隊員",
		titles   	: ["消防隊員","小隊長","分隊長","中隊長","大隊長","副大隊長"],
		branch   	: member.branch || branch,
		workingTime : member.workingTime ||  1200,
		radioCode 	: member.radioCode ||  null, 
		mission  	: "瞄子手",
		missions 	: ["瞄子手","副瞄子手","司機","小組長","安全管制員","聯絡官",],
		corps	 	: UserSvc.userCorps(),
		corpss 	 	: ["第一救災救護大隊","第三救災救護大隊"],
	};

	BranchSvc.fetchByCorps(UserSvc.userCorps()).success(function(branches){
		$scope.branches = branches; 
		if (!$scope.isNew) {
			var branchArry = [];
			for (var i = branches.length - 1; i >= 0; i--) {
				branchArry.push(branches[i].name);
			};
			$scope.member.branches = branchArry;
		}; 
	});

	var radioCodePrefix = function(branch){
		var suffix =  branch.split('').slice(-2).join('');
		if (suffix == "大隊" || suffix == "中隊") {
			return "北海";
		} else{
			return branch.split('').slice(0,2).join('');
		};
	};

	$scope.save = function(){
		if ($scope.member.name) {
			$scope.member.radioCodePrefix = radioCodePrefix($scope.member.branch);
			MemberSvc.create($scope.member).success(function(){
				$scope.member.workingTime = moment.duration(parseInt($scope.member.workingTime),'seconds');
			}).then(function(){
				$modalInstance.close($scope.member);
			})
		} else{

		};
	};

	$scope.update = function(){

		var updateMember = {
			  memberId  : member.memberId,
			  id 		: "",
			  name 		: $scope.member.name,
			  corps 	: $scope.member.corps,
			  branch 	: $scope.member.branch,
			  title 	: $scope.member.title,
			  workingTime : $scope.member.workingTime,
			  radioCode  : $scope.member.radioCode,
			  radioCodePrefix : radioCodePrefix($scope.member.branch)
		}

		if ($scope.member.name) {
			MemberSvc.updateByMemberId(updateMember);
			$modalInstance.close(updateMember);
		} else {
			
		};
	};

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
	
}])
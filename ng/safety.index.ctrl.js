angular.module('InNet')
.controller('SafetyIndexCtrl', ['$scope', 'CaseSvc', 'UserSvc', 
	function ($scope, CaseSvc, UserSvc) {

	var userCondition = {
		branch 		: UserSvc.userBranch(),
		accessLevel : UserSvc.accessLevel(),
		corps 		: UserSvc.userCorps()
	};

	CaseSvc.fetchRelativeCase(userCondition).success(function(cases){ 
		$scope.cases = cases;
		cases.forEach(function(_case){
			_case.dispatchBranches = ''
			_case.branches.forEach(function(branch){
				_case.dispatchBranches += branch + ' '
			});
		});
	});

	$scope.isBranchMember = true ? UserSvc.accessLevel() < 2  : false ; 
	

}])
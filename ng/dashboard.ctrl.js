/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('DashboardCtrl', ['$scope', '$location', 'SocketSvc', 'UserSvc', 'BranchSvc',
	function ($scope, $location, SocketSvc, UserSvc, BranchSvc) {

		BranchSvc.fetchByCorps(UserSvc.userCorps()).success(function(branches){
			$scope.branches = branches;
		});

		UserSvc.fetchOnlineUser().success(function(users){
			$scope.users = users;
		})

		SocketSvc.on('userLogin',function(user){
			$scope.users.push(user);
		});

		SocketSvc.on('userDisconnect',function(disconnectUser){
			$scope.users = $scope.users.filter(function(user) {
				return user.username != disconnectUser.username
			});
		});

		SocketSvc.on('userLogout',function(logoutUser){
			$scope.users = $scope.users.filter(function(user) {
				return user.username != logoutUser.username
			});
		});

		$scope.$on('$destroy', function (event) {
	        SocketSvc.removeAllListeners();
	    });

	    

}])
/**
*  Module
*
* Description
*/
angular.module('InNet')
.controller('TopNavCtrl', ['$scope', '$location','$state', '$interval', 'store', 'SocketSvc', 'UserSvc','$window',
	function ($scope, $location,$state, $interval, store, SocketSvc, UserSvc, $window) {

	$scope.currentTime =  moment().format('MMM Do, h:mm:ss a');
	$interval(function(){
		moment.locale('zh-tw');
		$scope.currentTime =  moment().format('MMM Do, h:mm:ss a');
	}, 1000);

	$scope.logout = function(){
		var account = UserSvc.currentAccount();
		SocketSvc.emit('logout');
		$state.go('anon.login');
	};
	
}])
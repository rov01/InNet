/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('LoginCtrl', ['$scope','UserSvc', 'store', '$state','jwtHelper','$http', 'SocketSvc',
	function ($scope, UserSvc, store, $state, jwtHelper, $http, SocketSvc) {

	var token = null;
	$scope.user = {};
	$scope.login = function(){
		UserSvc.login($scope.user).success(function(data){
			if (data.success) {
				store.set('jwt', data.token);
				$http.defaults.headers.common['x-access-token'] = data.token;
				token = data.token;
			}else{
				console.log("password is not existed!");
			};
		}).then(function(){
			SocketSvc.init(token);
			SocketSvc.emit('login');
		})
		.then(function(){
			if (jwtHelper.decodeToken(token).role == "admin") {

				var userBranch = jwtHelper.decodeToken(token).branch;
				if (userBranch.slice(userBranch.length-2 ,userBranch.length) == "大隊") {
					$state.go('dutyDesk.corps')
				} else{
					$state.go('dutyDesk.branch')
				};

			}else{
				$state.go('director.safety.index')
			}
		})
	};
}])
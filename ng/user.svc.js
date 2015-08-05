/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.service('UserSvc', [ '$http', 'store', 'jwtHelper', function ($http, store, jwtHelper) {

	this.fetchOnlineUser = function(){
		return $http.get('/api/users/userState');
	};

	this.register = function(){
		return $http.post('/api/users');
	};

	this.login = function(user){
		return $http.post('/api/users/authenticate', user);
	};

	this.isLoggedIn = function(){
		return store.get('jwt');
	};

	this.isValid = function( branch ){
		if (this.isLoggedIn) {
			if (jwtHelper.decodeToken(store.get('jwt')).branch == "第三救災救護大隊" || jwtHelper.decodeToken(store.get('jwt')).branch == branch) {
				return true; 
			}else {
				return false;
			};
		};

		return false 
	};

	this.userBranch = function(){
		if (this.isLoggedIn) {
			return jwtHelper.decodeToken(store.get('jwt')).branch;
		};
	};

	this.currentUser = function(){
		if (this.isLoggedIn) {
			return jwtHelper.decodeToken(store.get('jwt')).username;
		};
	};

	this.currentAccount = function(){
		if (this.isLoggedIn) {
			return jwtHelper.decodeToken(store.get('jwt')).account;
		}; 
	};

	this.accessLevel = function(){
		if (this.isLoggedIn) {
			return jwtHelper.decodeToken(store.get('jwt')).accessLevel;
		};
	};

	this.caseId = function(){
		if (this.isLoggedIn) {
			return jwtHelper.decodeToken(store.get('jwt')).caseId;
		};
	};

}]);
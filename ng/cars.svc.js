/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.service('CarSvc', ['$http',function ($http) {

	this.fetchByCorps = function(corps){
		return $http.get('/api/cars?corps=' + corps)
	}

	this.fetchByBranch = function( branch ){
		return $http.get('/api/cars?branch=' + branch )
	}
	
	this.update = function(data){
		return $http.put('/api/cars/' + data.id , data)
	}

}])
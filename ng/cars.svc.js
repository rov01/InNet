/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.service('CarSvc', ['$http',function ($http) {

	this.fetch = function(){
		return $http.get('/api/cars')
	}

	this.findByBranch = function( branch ){
		return $http.get('/api/cars/' + branch )
	}
	
	this.update = function(data){
		return $http.put('/api/cars/' + data.id , data)
	}

}])
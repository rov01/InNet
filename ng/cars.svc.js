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

	// this.create = function(case_info){
	// 	return $http.post('/api/cases', case_info)
	// }

	this.update = function(data){
		return $http.put('/api/cars/' + data.id , data)
	}

	// this.delete = function(case_id){
	// 	return $http.post('/api/cases/' + case_id)
	// }

}])
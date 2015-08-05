/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.service('BranchSvc', [ '$http', function ($http) {

	this.fetch = function(){
		return $http.get('/api/branch');
	};

	this.fetchByName = function(branch){
		return $http.get('/api/branch/name?branch=' + branch);
	};

	this.totalListFindByName = function(branch){
		return $http.get('/api/branch/name/total?branch=' + branch)
	}

	this.getDetails = function(id){
		return $http.get('/api/branch/' + id);
	};

	this.update = function(data){
		return $http.put('/api/branch/' + data.branch , data);
	};

	this.updateDirector = function(data){
		return $http.put('/api/branch?branch=' + data.branch, data)
	}
	
}])
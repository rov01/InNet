/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.service('CaseSvc', ['$http',function ($http) {

	this.fetch = function(){
		return $http.get('/api/cases');
	};

	this.fetchAll = function(){
		return $http.get('/api/cases/details');
	};

	this.fetchRelativeCase = function(branch){
		return $http.get('/api/cases/branch?branch=' + branch )
	}

	this.fetchDetails = function( case_id){
		return $http.get('/api/cases/details/' + case_id);
	};

	this.findById = function( case_id ){
		return $http.get('/api/cases/' + case_id );
	};

	this.create = function(case_info){
		return $http.post('/api/cases', case_info);
	};

	this.update = function(updated_case){
		return $http.put('/api/cases/' + updated_case.id , updated_case);
	};

	this.delete = function(case_id){
		return $http.post('/api/cases/' + case_id);
	};

	this.closeCase = function(data){
		return $http.put('/api/cases/close?id=' + data.id, data )
	}
}])
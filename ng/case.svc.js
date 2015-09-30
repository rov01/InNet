/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.service('CaseSvc', ['$http',function ($http) {

	this.fetch = function(corps, page, itemsPerPage){
		return $http.get('/api/cases?corps=' + corps + '&page=' + page + '&ipp=' + itemsPerPage );
	};

	this.fetchAll = function(){
		return $http.get('/api/cases/details');
	};

	this.fetchRelativeCase = function(con){
		return $http.get('/api/cases/branch?branch=' + con.branch + '&accessLevel=' + con.accessLevel + '&corps=' + con.corps );
	}

	this.fetchDetails = function( caseId){
		return $http.get('/api/cases/details/' + caseId);
	};

	this.fetchById = function( caseId ){
		return $http.get('/api/cases/' + caseId );
	};

	this.create = function(case_info){
		return $http.post('/api/cases', case_info);
	};

	this.delete = function(caseId){
		return $http.post('/api/cases/' + caseId);
	};

	this.update = function(updated_case){
		return $http.put('/api/cases/' + updated_case.caseId , updated_case);
	};

	this.closeCase = function(data){
		return $http.put('/api/cases/close?id=' + data.id, data )
	}
}])
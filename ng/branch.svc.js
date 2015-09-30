/**
* InNet Module
*
* Description
*/

'use strict';

angular.module('InNet')
.service('BranchSvc', [ '$http', function ($http) {

	this.fetchByCorps = function(corps){
		return $http.get('/api/branch?corps=' + corps);
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

	this.fetchOnDutyBranches = function(branches){
		return $http.post('/api/branch/onduty',branches)
	}

	this.update = function(data){
		return $http.put('/api/branch/' + data.branch , data);
	};

	this.updateMission = function(data){
		return $http.put('/api/branch?branch=' + data.branch, data)
	};
	
}])
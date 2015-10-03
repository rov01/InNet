/**
* InNet Module
*
* Description
*/

'use strict';

angular.module('InNet')
.service('BranchSvc', [ '$http', function ($http) {

	this.fetchByCorps = function(corps){
		return $http.get('/api/branches?corps=' + corps);
	};

	this.fetchByName = function(branch){
		return $http.get('/api/branches?branch=' + branch);
	};

	this.totalListFindByName = function(branch){
		return $http.get('/api/branches/' + branch)
	}

	this.getDetails = function(id){
		return $http.get('/api/branches/' + id);
	};

	this.fetchOnDutyBranches = function(branches){
		return $http.post('/api/branches/onduty',branches)
	}

	this.update = function(data){
		return $http.put('/api/branches/' + data.branch , data);
	};

	this.updateMission = function(data){
		return $http.put('/api/branches?branch=' + data.branch, data)
	};
	
}])
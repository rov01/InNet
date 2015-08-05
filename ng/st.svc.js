/**
* InNew Module
*
* Description
*/
angular.module('InNet')
.service('StSvc', [ '$http', function ($http) {
	this.fetch = function(caseId, branch){
		return $http.get('/api/strikeTeams?caseId=' + caseId + '&branch=' + branch);
	};

	this.fetchByCase = function(caseId){
		return $http.get('/api/strikeTeams/total?caseId=' + caseId);
	};

	this.dismissSt = function(data){
		return $http.put('/api/strikeTeams/dismiss?id=' + data.id);
	};

	this.updateSt = function(data){
		return $http.put('/api/strikeTeams/update?id=' + data.id, data);
	};

	this.updateTimeRecord = function(data){
		return $http.put('/api/strikeTeams/time?id=' + data.id, data);
	};

	this.create = function(strikeTeam){
		return $http.post('/api/strikeTeams', strikeTeam);
	};

	this.count = function(caseId){
		return $http.get('/api/strikeTeams/count?caseId=' + caseId);
	};
	
}])
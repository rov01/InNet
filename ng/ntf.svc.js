/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.service('NtfSvc', [ '$http', function ( $http) {

	this.fetch = function(){
		return $http.get('/api/nfts');	
	};
	
}])
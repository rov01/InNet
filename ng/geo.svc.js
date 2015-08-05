/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.service('GeoSvc', [ '$q', function ( $q ) {

	this.getGeolocationCoordinates = function() {
        var deferred = $q.defer();
        navigator.geolocation.getCurrentPosition(
            function(position) { deferred.resolve(position.coords); },
            function(error) { deferred.resolve(null); }
        );
        return deferred.promise;
    };

	
}])
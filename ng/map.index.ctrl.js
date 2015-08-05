/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('MapIndexCtrl', ['$scope', 'leafletData', 'GeoSvc',
    function ($scope, leafletData, GeoSvc) {
        
    GeoSvc.getGeolocationCoordinates().then(function(coord){
        $scope.nowPos.lat = coord.latitude;
        $scope.nowPos.lng = coord.longitude;
        $scope.nowPos.zoom = 17;
    })

    angular.extend($scope, {
        nowPos: {
            lat: 24.988,
            lng: 121.5752,
            zoom: 17
        },
        controls: {
            draw: {}
        }
    })

    leafletData.getMap().then(function(map) {
      var drawnItems = $scope.controls.edit.featureGroup;
      map.on('draw:created', function (e) {
        var layer = e.layer;
        drawnItems.addLayer(layer);
        
        FeatureCollections.push(layer.toGeoJSON())
        
      });
    })

	
}])
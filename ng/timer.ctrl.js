/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.controller('TimerCtrl', ['$scope', 'SocketSvc',
    function($scope, SocketSvc){

	$scope.timerRunning = true;

    $scope.startTimer = function(st, id){
    	$scope.$broadcast('timer-start');
    	$scope.timerRunning = true;
        SocketSvc.emit('timer', { stId : st._id, timerRunning : true } )
    };

    $scope.stopTimer = function(st,id){
    	$scope.$broadcast('timer-stop');
    	$scope.timerRunning = false;
        SocketSvc.emit('timer', { stId : st._id, timerRunning : false } )
    };

    $scope.resumeTimer = function(){
        $scope.$broadcast('timer-resume');
        $scope.timerRunning = false;
    };
	
}]);
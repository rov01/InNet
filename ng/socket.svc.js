/**
* InNet Module
*
* Description
*/
angular.module('InNet')
.service('SocketSvc',[ '$rootScope', 'store', '$q', '$timeout',
  function ($rootScope, store, $q, $timeout) {

  this.init =  function(token){
    var authToken = null
    if (token) {
      authToken = token 
    } else {
      authToken = store.get('jwt')
    };
    return io.connect('http://localhost:3000',{ query : 'token=' + authToken , 'forceNew':true });
  }

  var socket = this.init();

  this.on =  function (eventName, callback) {
    this.init().on(eventName, function () {  
      var args = arguments;
      $rootScope.$apply(function () {
        callback.apply(socket, args);
      });
    });
  }

  this.emit =  function (eventName, data, callback) {
    this.init().emit(eventName, data, function () {
      var args = arguments;
      $rootScope.$apply(function () {
        if (callback) {
          callback.apply(socket, args);
        }
      });
    })
  }

  this.removeAllListeners = function (eventName, callback) {
    this.init().removeAllListeners(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
    }); 
  }
  
}])
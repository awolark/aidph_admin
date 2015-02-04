(function() {

'use strict';  

angular.module('aidphApp')
  .factory('FlashService', ['$rootScope', function ($rootScope) {
    return {
      show: function(message) {
        $rootScope.flash = message;
      },
      clear: function() {
        $rootScope.flash = '';
      }
    };

  }]);


}).call(this);
 (function() {

'use strict';  

angular.module('aidphApp')
  .factory('SessionService', [function () {
    return {
      set: function(key, val) {
        return localStorage.setItem(key, val);
      },
      get: function(key) {
        return localStorage.getItem(key);
      },    
      unset: function(key) {
        return localStorage.removeItem(key);
      }
    };
  }]);

}).call(this);
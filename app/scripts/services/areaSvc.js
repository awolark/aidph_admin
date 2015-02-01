 (function() {

'use strict';  

angular.module('aidphApp')
 .factory('AreaService', function($http, SERVER) {

    return {
      get: function() {
        return $http.get(SERVER + '/areas');                
      }
    };
    
  });

}).call(this);
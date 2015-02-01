 (function() {

'use strict';  

angular.module('aidphApp')
 .factory('InfrasService', function(SERVER, $resource) {
    return $resource( SERVER + '/infras/:id', {id: '@id'}, {});
  });

}).call(this);
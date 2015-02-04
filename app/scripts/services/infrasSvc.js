 (function() {

'use strict';  

angular.module('aidphApp')
 .factory('InfrasResource', function($resource, SERVER) {
    return $resource( SERVER + '/infras/:infraId', {infraId: '@id'});           
  });

}).call(this);
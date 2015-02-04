 (function() {

'use strict';  

angular.module('aidphApp')
 .factory('Area', function($resource, SERVER) {
    return $resource( SERVER + '/areas/:id', {id: '@id'}, 
    	{
    		'query': {method: 'GET', 'params': {'page': 1},isArray: false},
    		'update': { method: 'PUT', headers: {'Content-type': 'application/x-www-form-urlencoded'},'params': { id: '@id'} }
    	});	
  });

}).call(this);
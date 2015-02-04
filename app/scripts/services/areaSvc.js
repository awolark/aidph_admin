 (function() {

'use strict';  

angular.module('aidphApp')
 .factory('Area', function($resource, SERVER) {
    return $resource( SERVER + '/areas/:id', {id: '@id'}, 
    	{
    		'query': {method: 'GET', 'params': {'page': 1},isArray: false},
    		'update': {method: 'POST', 'params': { id: '@id'} }
    	});	
  });

}).call(this);
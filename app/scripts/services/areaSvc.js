 (function() {

'use strict';  

angular.module('aidphApp')
 
 .factory('Area', ['$resource', 'SERVER', function($resource, SERVER) {
    return $resource( SERVER + '/areas/:id', {id: '@id'}, 
    	{
    		'query': {method: 'GET', 'params': {'page': 1}, isArray: false},
    		'update': {method: 'POST', 'params': { id: '@id'} }
    	});	

  }])

 .factory('AreaHelper', ['$http', 'SERVER', function ($http, SERVER) {
 	return {
 		getBrgys: function() {
 			return $http.get(SERVER + '/areas/barangays');
 		}
 	};
 }]);

}).call(this);
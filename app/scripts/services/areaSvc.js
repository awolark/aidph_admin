 (function() {

'use strict';  

angular.module('aidphApp')
 
 .factory('Area', ['$resource', 'SERVER', function($resource, SERVER) {
    return $resource( SERVER + '/areas/:id', {id: '@id'}, 
    	{
    		'update': {method: 'PUT'},
    		'query': {method: 'GET', 'params': {'page': 1}, isArray: false}
    	});	

  }])

 .factory('AreaHelper', ['$http', 'SERVER', 'AuthenticationService', 
 	function ($http, SERVER, AuthenticationService) {
 	return {
 		getBrgys: function() {
 			return $http.get(SERVER + '/areas/barangays');
 		};
 	}
 }]);

}).call(this);
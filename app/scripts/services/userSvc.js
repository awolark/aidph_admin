(function(){
	'use strict';

/**
 * @ngdoc service
 * @name aidphApp.users
 * @description
 * # users
 * Service in the aidphApp.
 */
angular.module('aidphApp')
  .service('User', ['$resource', 'SERVER', function ($resource, SERVER) {
     return $resource( SERVER + '/users/:id', {id: '@id'}, 
    	{
    		'query': {method: 'GET', 'params': {'page': 1}, isArray: false},
    		'update': {method: 'POST', 'params': { id: '@id'} }
    	});	 	
  }]);


})();

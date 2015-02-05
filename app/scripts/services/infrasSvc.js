'use strict';

/**
 * @ngdoc service
 * @name aidphApp.infras
 * @description
 * # infras
 * Service in the aidphApp.
 */
angular.module('aidphApp')
  .service('Infrastructure', ['$resource', 'SERVER', function ($resource, SERVER) {
     return $resource( SERVER + '/infras/:id', {id: '@id'}, 
    	{
    		'query': {method: 'GET', 'params': {'page': 1}, isArray: false},
    		'update': {method: 'POST', 'params': { id: '@id'} }
    	});	 	
  }]);

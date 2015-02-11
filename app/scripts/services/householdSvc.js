(function(){
	
'use strict';

angular.module('aidphApp')
  .service('Household', ['$resource', 'SERVER', function ($resource, SERVER) {
     return $resource( SERVER + '/households/:id', {id: '@id'}, 
    	{
    		'update': {method: 'PUT'},
    		'query': {method: 'GET', 'params': {'page': 1}, isArray: false}
    	});	 	
  }]);


})();

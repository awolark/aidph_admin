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
    		'update': {method: 'PUT'},
        'query': {method: 'GET', 'params': {'page': 1}, isArray: false}
    	});	 	
  }])

  .service('UserHelper', ['$http', 'SERVER', function 
    ($http, SERVER) {
  		
  		var self = this;

  			self.getAreasForUser = function(userId) {	       
		        return $http.get(SERVER + '/users/' + userId + '/areas' );
  			};
        
        self.generateUserName = function() {
            return $http.get(SERVER + '/users/generate_username' );
        };

        return self;
  }]);

})();

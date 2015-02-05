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
 }])


 .factory('Notify', ['$rootScope', function ($rootScope) {
 	var notify = {};
	
	notify.sendMsg = function(msg, data) {
		data = data || {};
		$rootScope.$emit(msg, data);

		console.log('message sent!');
	};

	notify.getMsg = function(msg, func, scope) {
		var unbind = $rootScope.$on(msg, func);

		if (scope) {
			scope.$on('destroy', unbind);
		}
	};

	return notify;

 }]);

}).call(this);
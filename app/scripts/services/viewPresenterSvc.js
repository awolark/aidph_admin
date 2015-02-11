(function(){
	'use strict';

	angular.module('aidphApp')

		.factory('ViewPresenterService', [function () {
	
			return {
				formatArrayOfErrors: function(errors, entity) {
               	   var log = ['<h4>Failed to add ' + entity +' </h4> '];
               
	               angular.forEach(errors, function(value, key) {
	               
	               	 this.push('* ' + value + '<br/>');                  
	               
	               }, log);					
				
				   return log;
				}
			};

		}]);

})();
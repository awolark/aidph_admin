(function() {

'use strict';  

angular.module('aidphApp')
  .controller('AppController', [
    '$scope', '$location', 'APP_NAME', function($scope, $location, APP_NAME) {

      $scope.isSpecificPage = function() {
        var path;
        path = $location.path();
        return _.contains(['/404', '/login'], path);
      };
      
      return $scope.main = {
        brand: APP_NAME,
        name: ''
      };

    }
  ]);

}).call(this);

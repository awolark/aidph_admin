(function() {

'use strict';  

angular.module('aidphApp')
  .controller('AppCtrl', [
    '$scope', '$location', 'APP_NAME', function($scope, $location, APP_NAME) {

      $scope.isSpecificPage = function() {
        var path;
        path = $location.path();
        return _.contains(['/404', '/pages/500', '/login', '/lock'], path);
      };
      
      return $scope.main = {
        brand: APP_NAME,
        name: 'Wayne Abarquez'
      };

    }
  ]);

}).call(this);

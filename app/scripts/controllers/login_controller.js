(function() {

'use strict';

/**
 * @ngdoc function
 * @name aidphApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the aidphApp
 */
angular.module('aidphApp')
  .controller('LoginController', function ($scope) {
    $scope.main = {
    	brand: 'Aidph'
    };
  });

}).call(this);
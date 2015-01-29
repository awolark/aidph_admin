(function() {

    'use strict';
/**
 * @ngdoc function
 * @name aidphApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the aidphApp
 */
angular.module('aidphApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

}).call(this);
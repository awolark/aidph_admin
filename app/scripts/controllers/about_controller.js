(function() {

    'use strict';

/**
 * @ngdoc function
 * @name aidphApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the aidphApp
 */
angular.module('aidphApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

}).call(this);
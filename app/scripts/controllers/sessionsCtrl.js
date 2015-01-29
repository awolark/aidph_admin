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
  .controller('SessionsCtrl', function($scope, $location, AuthenticationService, $modal, $rootScope) {

        $scope.credentials = { username: '', password: '' };

        $scope.login = function() {
        	AuthenticationService.login($scope.credentials)
            .success(function() {
              $location.path('/');

              
              var modalInstance;
              //open a modal
              modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'MyModalCtrl',
                resolve: {
                }               
              });

          });
         };

        $scope.logout = function() {
        	AuthenticationService.logout()
            .success(function() {
              $location.path('/login');
          });
        };

      $scope.alert = {
        type: 'danger'
      };

      $scope.closeAlert = function() {
        $rootScope.flash = '';
      };

  })
  .controller('MyModalCtrl', function($scope, $modalInstance) {
      $scope.ok = function() {
        $modalInstance.close('ok');
      };              
   });

}).call(this);
(function() {

'use strict';

angular.module('aidphApp')
  .controller('SessionsController', function($scope, $rootScope, $location, AuthenticationService, $modal, SERVER) {

       $scope.credentials = { username: '', password: '' };

       if(AuthenticationService.isLoggedIn()) {
         var userData = AuthenticationService.loggedUser();

         $rootScope.username = userData.username;

         $rootScope.image = userData.image_path ? (SERVER + userData.image_path) : '';
       }


        $scope.login = function() {
        	AuthenticationService.login($scope.credentials)
            .success(function(response) {

              var userData = response.data;

              $rootScope.username = userData.username;
              $rootScope.image = userData.image_path ? (SERVER + userData.image_path) : '';

              $location.path('/');

              var modalInstance;
              //open a modal
              modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'MyModalCtrl',
                resolve: {
                  // username: function() {
                  //   return userData.username;
                  // }
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

        $scope.lock = function() {
          AuthenticationService.lockUser();
          $location.path('/lock');
        };

        $scope.unlock = function() {
          var data = $scope.lockdata;
          data.username =  $rootScope.username;
          AuthenticationService.unlockUser(data);
          console.log($scope.data);
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

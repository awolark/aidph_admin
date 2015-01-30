(function() {

'use strict';  

angular.module('aidphApp')
  .controller('SessionsCtrl', function($scope, $location, AuthenticationService, $modal, $rootScope, SERVER) {

       var userData = AuthenticationService.loggedUser();
       if(AuthenticationService.isLoggedIn()) {
         $rootScope.username = userData.username; 
         $rootScope.image = SERVER + userData.image_path;       
       }

        $scope.credentials = { username: '', password: '' };

        $scope.login = function() {
        	AuthenticationService.login($scope.credentials)
            .success(function(response) {
              $rootScope.user = response;



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
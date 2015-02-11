(function() {

  'use strict';

  var aidphApp = angular.module('aidphApp');
  
  aidphApp.controller('UsersController', ['$scope', '$rootScope', '$filter', 'responseData', 'User', 'modalService', 'logger', 'AuthenticationService',
    function ($scope, $rootScope, $filter, responseData, User, modalService, logger, AuthenticationService) {

     var self = this;
     self.numPerPageOpt = [10, 25, 35, 50];
     self.numPerPage = self.numPerPageOpt[1];
     self.data = [];
     self.totalData = 0;
     self.currentPage = 1;

     self.loggedUser = AuthenticationService.loggedUser();

   // Resource Object
   var resource = User;

   var resolveData = function(response){
    self.data = response.data;
    self.totalData = response.meta.pagination.total;
    self.numPerPage = response.meta.pagination.per_page;
    self.currentPage = response.meta.pagination.current_page;
  };

  self.currentPage = 1;

    // resolve promise to fill table with data
    responseData.$promise.then( function(response){
      self.data = response.data;
      console.log(response.data);
      self.totalData = response.meta.pagination.total;
    });

    self.pageChanged = function(newPage) {
      requestData(newPage, self.numPerPage, resolveData);
    };

    self.numPerPageChanged = function() {
      self.currentPage = 1;
    };

    function requestData(newPage, numPerPage, callback) {
      var params = {page: newPage, limit: numPerPage, loggedUserId: AuthenticationService.loggedUser().user_id};
      resource.query(params).$promise.then(callback);
    }

    self.remove = function(selectedUser) {
      var id = selectedUser.referenceId;
      
      if(selectedUser) {           
          resource.delete({id: id}).$promise.then(function(response){
           logger.log('Data Successfully Deleted');              

           for (var i in self.data) {
            if (self.data[i] === selectedUser) {
              self.data.splice(i, 1);
            }
          }

           }, function(errorResponse) {              
            logger.logError('Cannot Delete data');
          });
      } else {
         resource.delete({id: id});
      }
   };
  /*
    Modals here 
    */
    self.modalCreate = function() {

      var modalDefaults = {
      		// TODO create add.html
          // REPLACE 
          templateUrl: 'views/users/add.html',
          controller: function($scope, $modalInstance) {            
            $scope.ok = function() {
              $modalInstance.close();
            };

            $scope.cancel = function() {
              $modalInstance.dismiss('cancel');
            };
          }
        };

        var modalOptions = {};

        modalService.showModal(modalDefaults, modalOptions);
      };

  // Delete a Record
  self.modalRemove = function(selectedData) {
    var modalDefaults = {
     templateUrl: 'views/templates/confirm-delete-tpl.html',
     controller: function($scope, $modalInstance) {

      $scope.ok = function() {
        self.remove(selectedData);

        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

    }
  };
  var modalOptions = {};
  modalService.showModal(modalDefaults, modalOptions);
};


  // For Alert Options
  self.alert = {
    type: 'danger'
  };

  self.closeAlert = function() {
    $rootScope.flash = '';
  };

}]);



/*    UsersCreateController   */  

// REPLACE
aidphApp.controller('UsersCreateController', ['$scope', 'User', 'modalService', '$location', 'Notify', 'Area', 'logger', 'AuthenticationService', 'UserHelper', 'ViewPresenterService',
  function ($scope,  User, modalService, $location, Notify, Area, logger, AuthenticationService, UserHelper, ViewPresenterService) {
    var self = this;
    self.flash = '';
    var resource = User;
    self.loggedUserAreas = [];
    
    self.roles = [
    {
      id: 1,
      name: 'ADMIN'
    },
    {
      id: 2,
      name: 'USER'        
    }];


    self.selectedRole = '';
    self.selectedAreaId = '';
    self.email = '';



    // Create new Data
    // REPLACE
    self.create = function() 
    {
      // self.area_id = self.selectedArea.id;
      var data = new User({
        area_id: self.selectedAreaId,
        email: this.email,
        role: this.selectedRole,
      });

      console.log(data);

      data = resource.save(data).$promise.then(function(response){

        logger.logSuccess(response.message);
        
        Notify.sendMsg(response.message, {'id': response.id});

      }, function(errorResponse) {
        console.log(errorResponse);

        var errors = errorResponse.data.error.message;

        var formattedError = ViewPresenterService.formatArrayOfErrors(errors, 'User');

        logger.logError(formattedError); 

      });
    };

    self.selectRole = function(role)
    {
      self.selectedRole = role.id;
    };


    /* Called in add.html ng-init */

    self.getLoggedUserAreas = function() {
      AuthenticationService.getLoggedUserAreas().success(function(response){
        console.log(response);
          self.loggedUserAreas = response;         
      });   
    };


     self.alert = {
       type: 'danger'
     };

}]);



/* InfrasUpdateController */


// REPLACE
// aidphApp.controller('UsersUpdateController', ['$scope', 'User', 'logger', 
//   function ($scope, User, logger) {


//     var self = this,
//         resource = User;

//     self.roles = ['ADMIN', 'USER'];

//     self.update =  function(updatedData) { 
//       console.log(updatedData);
//       resource.update({id: updatedData.id}, updatedData).$promise.then(function(response){
//               logger.logSuccess('Data Successfully Updated');
//           }, function(errorResponse) {
//               logger.logError(errorResponse.data.error.message); 
//           });
//     };

//     self.alert = {
//       type: 'danger'
//     };

//     self.closeAlert = function() {
//       self.flash.error = '';
//     };

// }]);


}).call();
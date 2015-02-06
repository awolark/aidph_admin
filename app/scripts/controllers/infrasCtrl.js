(function() {

'use strict';

var aidphApp = angular.module('aidphApp');
  
  aidphApp.controller('InfrasController', ['$scope', '$rootScope', '$filter', 'responseData', 'Infrastructure', 'modalService', 'logger', 
    function ($scope, $rootScope, $filter, responseData, Infrastructure, modalService, logger) {

   var self = this;
   self.numPerPageOpt = [10, 25, 35, 50];
   self.numPerPage = self.numPerPageOpt[1];
   self.data = [];
   self.totalData = 0;
   self.currentPage = 1;
   
   // Resource Object
   var resource = Infrastructure;

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
                self.totalData = response.meta.pagination.total;
              });

   self.pageChanged = function(newPage) {
      requestData(newPage, self.numPerPage, resolveData);
   };

   function requestData(newPage, numPerPage, callback) {
      var params = {page: newPage, limit: numPerPage};
      resource.query(params).$promise.then(callback);
   }

   function remove(selectedArea) {
      var selectedId = selectedArea.id;
      
      if(selectedArea) {           
          resource.delete({id: selectedId}).$promise.then(function(response){
             logger.log('Data Successfully Deleted');              
              
              for (var i in self.data) {
                if (self.data[i] === selectedArea) {
                  self.data.splice(i, 1);
                }
              }
              
          }, function(errorResponse) {              
             logger.logError('Cannot Delete data');
          });


      } else {
         resource.delete({id: selectedId});
      }
   }
  /*
    Modals here 
   */
  self.modalCreate = function() {
      var modalDefaults = {
      		// TODO create add.html
          // REPLACE 
            templateUrl: 'views/infras/add.html',
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
          remove(selectedData);
          
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

  // Update a Record
  self.modalUpdate = function(selectedData) {
      var modalDefaults = {
      	// TODO create update.html  
        // REPLACE     	
        templateUrl: 'views/infras/update.html',
        controller: function($scope, $modalInstance, data) {
          $scope.data = data;

          console.log(data);

          $scope.ok = function() {
            $modalInstance.close($scope.data);   
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
            var data = resource.query({limit: 25}).$promise.then(function(response){
              self.currentPage = 1;
              data = response.data;
            });
          };

        },
        resolve: {
          data: function() {
            return selectedData;
          }
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
  
  // watcher for filters
  // $scope.$watch('q', function (key) {
  //     var q = null;
  //     if (key) {
  //         q = {
  //             q: key
  //         };
  //     }
  //     $scope.projects = Area.query(q);
  // });
  

  // $scope.find() = function() {
  //   $scope.area = Area.get({
  //     id: self.id
  //   });
  // };

}]);



/*    InfrasCreateController   */  


// REPLACE
aidphApp.controller('InfrasCreateController', ['$scope', 'Infrastructure', 'modalService', '$location', 'Notify', 'Area', 'AreaHelper',
  function ($scope,  Infrastructure, modalService, $location, Notify, Area, AreaHelper) {
    var self = this;
    self.flash = '';
    self.types = ['BRIDGE', 'BUILDING', 'DAM'];
    var resource = Infrastructure;
    self.brgys = [];

    AreaHelper.getBrgys().success(function(response){
      self.brgys = response;
    });

    self.create = function() {
          // Create new Data
          // REPLACE
          var data = new Infrastructure({
            name: this.name,
            type: this.type,
            location: this.location,
            remarks: this.remarks,
            status: this.status,
            brgy_area_id: this.brgy_area_id
            // latlng: this.name,
            // bounds: this.name,
            // parent_id: self.parent_id,
          });
          
          console.log(data);

          data = resource.save(data).$promise.then(function(response){
              console.log(response);
              Notify.sendMsg(response.message, {'id': response.id});
          }, function(errorResponse) {
              self.flash = errorResponse.data.error.message; 
          });
      };

    self.alert = {
      type: 'danger'
    };

  }]);



/* InfrasUpdateController */


// REPLACE
aidphApp.controller('InfrasUpdateController', ['$scope', 'Infrastructure', 'logger', 'AreaHelper',
  function ($scope, Infrastructure, logger, AreaHelper) {

    var self = this;
    var resource = Infrastructure;
    self.types = ['BRIDGE', 'BUILDING', 'DAM'];

    AreaHelper.getBrgys().success(function(response){
      self.brgys = response;
    });

    self.update =  function(updatedData) { 
      console.log(updatedData);
      resource.update({id: updatedData.id}, updatedData).$promise.then(function(response){
              logger.logSuccess('Data Successfully Updated');
          }, function(errorResponse) {
              logger.logError(errorResponse.data.error.message); 
          });
    };

    self.alert = {
      type: 'danger'
    };

    self.closeAlert = function() {
      self.flash.error = '';
    };

}]);


}).call();
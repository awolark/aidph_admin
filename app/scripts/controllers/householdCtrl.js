(function() {

'use strict';

var aidphApp = angular.module('aidphApp');
  
  aidphApp.controller('HouseholdsController', ['$scope', '$rootScope', '$filter', 'responseData', 'Household', 'modalService', 'logger', 
    function ($scope, $rootScope, $filter, responseData, Household, modalService, logger) {

   var self = this;
   self.numPerPageOpt = [10, 25, 35, 50];
   self.numPerPage = self.numPerPageOpt[1];
   self.data = [];
   self.totalData = 0;
   self.currentPage = 1;
   
   // Resource Object
   var resource = Household;

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

   self.numPerPageChanged = function() {
      self.currentPage = 1;
   };

   function requestData(newPage, numPerPage, callback) {
      var params = {page: newPage, limit: numPerPage};
      resource.query(params).$promise.then(callback);
   }

   function remove(selectedHousehold) {
      var id = selectedHousehold.referenceId;
      
      if(selectedHousehold) {           
          resource.delete({id: id}).$promise.then(function(response){
             logger.log('Data Successfully Deleted');              
              
              for (var i in self.data) {
                if (self.data[i] === selectedHousehold) {
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
            templateUrl: 'views/households/add.html',
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
        templateUrl: 'views/households/update.html',
        controller: function($scope, $modalInstance, data) {
          $scope.data = data;

          console.log(data);

          $scope.ok = function() {
            $modalInstance.close($scope.data);   
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
            var data = resource.query({limit: self.numPerPage, page: self.currentPage}).$promise.then(function(response){
              self.data = response.data;
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



/*    householdsCreateController   */  


// REPLACE
aidphApp.controller('HouseholdsCreateController', ['$scope', 'Household', 'modalService', '$location', 'Notify', 'Area', 'AreaHelper', 'logger',
  function ($scope,  Household, modalService, $location, Notify, Area, AreaHelper, logger) {
    var self = this;
    self.flash = '';
    var resource = Household;
    
    self.brgys = [];
    self.head_persons = [];




    // PersonHelper.getPersons().success(function(response){
    // 	self.head_persons = [];
    // });


    self.create = function() {
          // Create new Data
          // REPLACE
          var data = new Household({
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

          data = resource.save(data).$promise.then(function(response){
              logger.logSuccess(response.message);
              Notify.sendMsg(response.message, {'id': response.id});
          }, function(errorResponse) {
              self.flash = errorResponse.data.error.message; 
          });
      };

      self.getBrgys = function() {
        AreaHelper.getBrgys().success(function(response) {
          console.log(response);
          // self.brgys = response;
        });
      };

    self.alert = {
      type: 'danger'
    };

  }]);



/* householdsUpdateController */


// REPLACE
aidphApp.controller('HouseholdsUpdateController', ['$scope', 'Household', 'logger', 'AreaHelper',
  function ($scope, Household, logger, AreaHelper) {

    var self = this;
    var resource = Household;


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
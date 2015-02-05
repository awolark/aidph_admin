(function() {

'use strict';

var aidphApp = angular.module('aidphApp');
  
  aidphApp.controller('AreasController', ['$scope', '$rootScope', '$filter', 'areaData', 'Area', 'modalService', 'logger', 
    function ($scope, $rootScope, $filter, areaData, Area, modalService, logger) {

   var self = this;
   self.numPerPageOpt = [10, 25, 35, 50];
   self.numPerPage = self.numPerPageOpt[1];
   self.areas = [];
   self.totalData = 0;
   self.currentPage = 1;

   var resolveData = function(response){
        self.areas = response.data;
        self.totalData = response.meta.pagination.total;
        self.numPerPage = response.meta.pagination.per_page;
        self.currentPage = response.meta.pagination.current_page;
       };
   
   self.currentPage = 1;

    // resolve promise to fill table with data
   areaData.$promise.then( function(response){
                self.areas = response.data;
                self.totalData = response.meta.pagination.total;
              });

   self.pageChanged = function(newPage) {
      requestData(newPage, self.numPerPage, resolveData);
   };

   function requestData(newPage, numPerPage, callback) {
      var params = {page: newPage, limit: numPerPage};
      Area.query(params).$promise.then(callback);
   }

   function remove(selectedArea) {
      var selectedId = selectedArea.id;
      
      if(selectedArea) {           
          Area.delete({id: selectedId}).$promise.then(function(response){
             logger.log('Data Successfully Deleted');              
              
              for (var i in self.areas) {
                if (self.areas[i] === selectedArea) {
                  self.areas.splice(i, 1);
                }
              }
              
          }, function(errorResponse) {              
             logger.logError('Cannot Delete data');
          });


      } else {
         Area.delete({id: selectedId});
      }
   }
  /*
    Modals here 
   */
  self.modalCreate = function() {
      var modalDefaults = {
            templateUrl: 'views/areas/add-areas.html',
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
  self.modalRemove = function(selectedArea) {
    var modalDefaults = {
       templateUrl: 'views/templates/confirm-delete-tpl.html',
       controller: function($scope, $modalInstance) {
        
        $scope.ok = function() {
          remove(selectedArea);
          
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
  self.modalUpdate = function(selectedArea) {
      var modalDefaults = {
        templateUrl: 'views/areas/update-areas.html',
        controller: function($scope, $modalInstance, area) {
          $scope.area = area;

          $scope.ok = function() {
            $modalInstance.close($scope.area);   
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
            var data = Area.query({limit: 25}).$promise.then(function(response){
              self.currentPage = 1;
              self.areas = response.data;
            });
          };

        },
        resolve: {
          area: function() {
            return selectedArea;
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
  // 

  // $scope.find() = function() {
  //   $scope.area = Area.get({
  //     id: $stateParams.id
  //   });
  // };

}]);


aidphApp.controller('AreasCreateController', ['$scope', 'Area', 'modalService', '$location', 'Notify', 
  function ($scope,  Area, modalService, $location, Notify) {
    var self = this;
    self.areaTypes = ['NATIONAL', 'REGION','PROVINCE', 'CITY', 'BRGY'];
    self.flash = '';

    self.create = function() {
          // Create new Area
          var area = new Area({
            name: this.name,
            type: this.type,
            contact_person: this.contact_person,
            contact_no: this.contact_no,
            status: this.status
            // latlng: this.name,
            // bounds: this.name,
            // parent_id: self.parent_id,
          });
          
          area = Area.save(area).$promise.then(function(response){
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

aidphApp.controller('AreasUpdateController', ['$scope', 'Area', 'logger', 
  function ($scope, Area, logger) {

    var self = this;

    self.areaTypes = ['NATIONAL', 'REGION','PROVINCE', 'CITY', 'BRGY'];

    self.update =  function(updatedArea) { 
      Area.update({id: updatedArea.id}, updatedArea).$promise.then(function(response){
              logger.logSuccess('Data Successfully Updated');
          }, function(errorResponse) {
              logger.logWarning(errorResponse.data.error.message); 
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
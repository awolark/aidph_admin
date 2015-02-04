(function() {

'use strict';

var aidphApp = angular.module('aidphApp');
  
  aidphApp.controller('AreasController', ['$scope', '$filter', 'areaData', '$log', 'Area', 'modalService',
    function ($scope, $filter, areaData, $log, Area, modalService) {

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

  /*
    Modal here 
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

  self.remove = function(selectedId) {
    Area.delete({id: selectedId});
  };

  self.modalUpdate = function(selectedArea) {
      var modalDefaults = {
        templateUrl: 'views/areas/update-areas.html',
        controller: function($scope, $modalInstance, area) {
          $scope.area = area;

          $scope.ok = function() {
            if(updateAreaForm.$valid) {
              $modalInstance.close($scope.area);              
            }
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
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


aidphApp.controller('AreasCreateController', ['$scope', 'Area', 'modalService', '$location', 
  function ($scope,  Area, modalService, $location) {
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
          $location.path('/areas');
          $rootScope.flash = response.message;
      }, function(errorResponse) {
          errorResponse.error.message = self.flash; 
      });
   };


    self.alert = {
      type: 'danger'
    };




  }]);

aidphApp.controller('AreasUpdateController', ['$scope', 'Area',  
  function ($scope, Area) {

    var self = this;

    self.areaTypes = ['NATIONAL', 'REGION','PROVINCE', 'CITY', 'BRGY'];

    self.update =  function(updatedArea) { 
      Area.update({id: updatedArea.id}, updatedArea);
    };

    self.alert = {
      type: 'danger'
    };

    self.closeAlert = function() {
      self.flash.error = '';
    };

    self.canSubmit = function() {
      return self.updateAreaForm.$valid;
    };

}]);


 


}).call();
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
              $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
              };
               $scope.submitForm = function() {
                console.log('submit the form');
               };

            }
      };
      var modalOptions = {};
      modalService.showModal(modalDefaults, modalOptions);
  };

  self.modalUpdate = function(selectedArea) {
      var modalDefaults = {
        templateUrl: 'views/areas/update-areas.html',
        controller: function($scope, $modalInstance, area) {
          $scope.area = area;

          // $scope.submitForm = function() {
          //  console.log('submit the form');
          // };

          $scope.ok = function() {
            $modalInstance.close($scope.area);
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };

        },
        resolve: {
          area: function() {
            console.log(selectedArea);
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
    
    $scope.create = function() {
      // Create new Area
      var area = new Area({
        parent_id: this.parent_id,
        name: this.name,
        type: this.name,
        contact_person: this.name,
        contact_no: this.name,
        latlng: this.name,
        bounds: this.name,
        status: this.status
      });

      Area.$save(function(response) {
        $location.path('areas/' + response.id);

        $scope.parent_id = '';
        $scope.name = '';
        $scope.type = '';
        $scope.contact_person = '';
        $scope.contact_no = '';
        $scope.latlng = '';
        $scope.bounds = '';
        $scope.status = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
   };

  }]);

aidphApp.controller('AreasUpdateController', ['$scope', 'Area', 
  function ($scope, Area) {

    var self = this;

    self.update =  function(updatedArea) {
      var area = updatedArea;
      console.log('updating area');
      console.log(area);

      // Area.$update(function() {
      // }, function() {
      //   self.flash.error = errorResponse.data.message;
      // });
    };

    self.alert = {
      type: 'danger'
    };

    self.closeAlert = function() {
      self.flash.error = '';
    };

}]);



}).call();
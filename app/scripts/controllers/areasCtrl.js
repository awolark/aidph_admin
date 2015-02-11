(function() {

  'use strict';

  var aidphApp = angular.module('aidphApp');
  
  aidphApp.controller('AreasController', ['$scope', '$rootScope', '$filter', 'areaData', 'Area', 'modalService', 'logger', '$http',    
    function ($scope, $rootScope, $filter, areaData, Area, modalService, logger, $http) {

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

    self.numPerPageChanged = function() {
      self.currentPage = 1;
    };

    function requestData(newPage, numPerPage, callback) {
      var params = {page: newPage, limit: numPerPage};
      Area.query(params).$promise.then(callback);
    }

    function remove(selectedArea) {
      var id = selectedArea.referenceId;
      
      if(selectedArea) {      
          Area.delete({id: id}).$promise.then(function(response){
             logger.log('Data Successfully Deleted');              

              for (var i in self.areas) {
                if (self.areas[i] === selectedArea) {
                  self.areas.splice(i, 1);
                }
              }

          }, function(errorResponse) {   
             console.log(errorResponse);           
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
        templateUrl: 'views/areas/add.html',
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
      templateUrl: 'views/areas/update.html',
      controller: function($scope, $modalInstance, area) {
        $scope.area = area;

        $scope.ok = function() {
          $modalInstance.close($scope.area);   
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
          var data = Area.query({limit: self.numPerPage, page: self.currentPage}).$promise.then(function(response){
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


aidphApp.controller('AreasCreateController', ['Area', 'Notify', 'logger', 'ViewPresenterService',
  function (Area, Notify, logger, ViewPresenterService) {
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
          
          area = Area.save(area).$promise.then(
            function(response){

              logger.logSuccess(response.message);
              Notify.sendMsg(response.message, {'id': response.id});


            }, function(errorResponse) {
  
               console.log(errorResponse);
               
               var errors = errorResponse.data.error.message;
               
               var formattedError = ViewPresenterService.formatArrayOfErrors(errors, 'Area');

               logger.logError(formattedError); 

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
        logger.logSuccess(response.message);
      }, function(errorResponse) {
       console.log(errorResponse);
              // var errors = errorResponse.data.error.message;
              // var log = ['<h4>Failed to update area</h4> '];
              // angular.forEach(errors, function(value, key) {
              //   this.push('* ' + value + '<br/>');                  
              // }, log);
              // logger.logError(log); 
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
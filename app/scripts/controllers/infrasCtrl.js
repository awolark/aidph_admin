(function() {

'use strict';

var app = angular.module('aidphApp');
  
  app.controller('InfrasController', ['$scope', '$filter', 'infras', '$modal', '$log',
    function ($scope, $filter, infras, $modal, $log) {
    var init = {};

    $scope.data = infras.data;
    $scope.pageDetail = infras.meta;

	  $scope.searchKeywords = '';
	  $scope.filteredData = [];
	  $scope.row = '';

    $scope.numPerPageOpt = [3, 5, 10, 20];
    $scope.numPerPage = $scope.numPerPageOpt[2];
    $scope.currentPage = 1;
    $scope.currentPageData = [];


      $scope.setPage = function () {
        $scope.select($scope.currentPage);
      };
      $scope.select = function(page) {
        var end, start;
        start = (page - 1) * $scope.numPerPage;
        end = start + $scope.numPerPage;
        return $scope.currentPageData = $scope.filteredData.slice(start, end);
      };

      $scope.onFilterChange = function() {
        $scope.select(1);
        $scope.currentPage = 1;
        return $scope.row = '';
      };

      $scope.onNumPerPageChange = function() {
        $scope.select(1);
        return $scope.currentPage = 1;
      };

      $scope.onOrderChange = function() {
        $scope.select(1);
        return $scope.currentPage = 1;
      };

      $scope.search = function() {
        $scope.filteredData = $filter('filter')($scope.data, $scope.searchKeywords);
        return $scope.onFilterChange();
      };

      $scope.order = function(rowName) {
        if ($scope.row === rowName) {
          return;
        }
        $scope.row = rowName;
        $scope.filteredData = $filter('orderBy')($scope.data, rowName);
        return $scope.onOrderChange();
      };

  $scope.modalUpdate = function (size, selectedInfra) {

    var modalInstance = $modal.open({
      templateUrl: 'views/infras/edit-infra.html',
      controller: function ($scope, $modalInstance, infra) {
          $scope.infra = infra;
      },
      size: size,
      resolve: {
        infra: function () {
          return selectedInfra;
        }
      }
    });

    modalInstance.result.then(function (selectedInfra) {
      $scope.selected = selectedInfra;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };


      init = function() {
        $scope.search();
        return $scope.select($scope.currentPage);
      };

        return init();

      }
  ]).controller('infrasEditState', ['$scope', function ($scope) {
    
  }]);

}).call(this);

(function() {

'use strict';

angular.module('aidphApp')
  .controller('InfrasCtrl', function (SERVER, $scope, $resource) {
	
    // var Infras = $resource(SERVER + '/infras/:id', {id: '@id'}, { 'query': { method: 'GET'}});
    var Infras = $resource(SERVER + '/infras/:id', {id: '@id'}, {'query': {method: 'GET', isArray: false}}); 
	   // $resource('/posts', {}, {'query': {method: 'GET', isArray: false}}); 
    var promise = Infras.query();
    console.log(promise.getData());
    // 
    // $scope.infras = promise;
    // data.$promise(function(response){
    //   console.log(response);
    // });

    // var entries = AreaService.query(function() {
    //   console.log("Query: "+entries);
    // });

	  // $scope.areas = areaResponse.data.data;
	  // $scope.pageDetail = areaResponse.data.meta;

   //  $scope.currentPage = 1;
	  // $scope.searchKeywords = '';
	  // $scope.filteredAreas = [];
	  // $scope.row = '';
   //  $scope.numPerPageOpt = [3, 5, 10, 20];
   //  $scope.numPerPage = $scope.numPerPageOpt[2];
   //  $scope.currentPageAreas = [];


   //    $scope.setPage = function (pageNo) {
   //      $scope.currentPage = pageNo;
   //    };
   //    $scope.select = function(page) {
   //      var end, start;
   //      start = (page - 1) * $scope.numPerPage;
   //      end = start + $scope.numPerPage;
   //      return $scope.currentPageAreas = $scope.filteredAreas.slice(start, end);
   //    };

   //    $scope.onFilterChange = function() {
   //      $scope.select(1);
   //      $scope.currentPage = 1;
   //      return $scope.row = '';
   //    };
   //    $scope.onNumPerPageChange = function() {
   //      $scope.select(1);
   //      return $scope.currentPage = 1;
   //    };
   //    $scope.onOrderChange = function() {
   //      $scope.select(1);
   //      return $scope.currentPage = 1;
   //    };

   //    $scope.search = function() {
   //      $scope.filteredAreas = $filter('filter')($scope.areas, $scope.searchKeywords);
   //      return $scope.onFilterChange();
   //    };

   //    $scope.order = function(rowName) {
   //      if ($scope.row === rowName) {
   //        return;
   //      }
   //      $scope.row = rowName;
   //      $scope.filteredAreas = $filter('orderBy')($scope.areas, rowName);
   //      return $scope.onOrderChange();
   //    };

   //    init = function() {
   //      $scope.search();
   //      return $scope.select($scope.currentPage);
   //    };
   //    return init();

  });
}).call(this);
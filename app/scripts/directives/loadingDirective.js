(function(){
  'use strict';

angular.module('aidphApp')
  // .directive('loader', function($rootScope) {
  //     return function ($scope, element, attrs) {
  //       $scope.$on('loader_show', function() {
  //         return element.show();
  //       });
  //       $scope.$on('loader_hide', function() {
  //         return element.hide();
  //       });
  //     };
  //   });


.directive('loader', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'A',
    link: function ($scope, element, attrs) {
      $scope.$on('loader_show', function() {
        return element.show();
      });
      $scope.$on('loader_hide', function() {
        return element.hide();
      });
    }
  };
}]);

})();


 (function() {

'use strict';  

angular.module('aidphApp')

  .directive('areaList', [function () {
    return {
      templateUrl: 'views/templates/areas-list-template.html',
      restrict: 'E',
      transclude: true
    };
  }]);


}).call(this);
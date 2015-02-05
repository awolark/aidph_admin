(function() {
  'use strict';
  var aidphApp = angular.module('app.ui.directives', []);
  aidphApp.directive('uiWeather', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          var color, icon, skycons;
          color = attrs.color;
          icon = Skycons[attrs.icon];
          skycons = new Skycons({
            'color': color,
            'resizeClear': true
          });
          skycons.add(ele[0], icon);
          return skycons.play();
        }
      };
    }
    ]);

}).call(this);

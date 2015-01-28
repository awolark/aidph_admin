(function() {

    'use strict';

/**
 * @ngdoc overview
 * @name aidphAdminApp
 * @description
 * # aidphAdminApp
 *
 * Main module of the application.
 */
angular
  .module('aidphApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    // 3rd Party Modules
    'ui.bootstrap',
    //'easypiechart',
    //'mgo-angular-wizard',
    //'ui.tree',
    //'ngMap',
    //'ngTagsInput',

    //Custom modules
    'app.ui.ctrls',
    'app.ui.directives',
    'app.ui.services',
    'app.controllers',
    'app.directives',
    //'app.form.validation',
    //'app.ui.form.ctrls',
    //'app.ui.form.directives',
    //'app.tables',
    //'app.map',
    'app.task',
    'app.localization',
    //'app.chart.ctrls',
    //'app.chart.directives',
    'app.page.ctrls'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/dashboard.html'
      })
      .when('/login', {
        templateUrl: 'views/signin.html',
        controller: 'LoginController'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/login'
      });
  });

}).call(this);
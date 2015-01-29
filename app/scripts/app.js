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
var app = angular
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
    'app.config',
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
  ]);

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/dashboard.html'
      })
      .when('/login', {
        templateUrl: 'views/signin.html',
        controller: 'SessionsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

  app.run(function($rootScope, $location, AuthenticationService, FlashService) {

    var routesThatRequireAuth = ['/'];

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if(_(routesThatRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn()) {
        $location.path('/login');
        FlashService.show('Please Login to Continue');
      }
    });

  });

  app.factory('SessionService', [function () {
    return {
      get: function(key) {
        return sessionStorage.getItem(key);
      },
      set: function(key, val) {
        return sessionStorage.setItem(key, val);
      },
      unset: function(key, val) {
        return sessionStorage.removeItem(key);
      }
    };
  }])

  app.factory('AuthenticationService', function ($http, $location, SERVER, SessionService, FlashService) {
    
    var cacheSession = function() {
      SessionService.set('authenticated', true);
    };

    var uncacheSession = function() {
      SessionService.unset('authenticated');
    };

    var loginError = function(response) {
      FlashService.show(response.error.message);
    };

    return {
      login: function(credentials) {
        var login = $http.post( SERVER + '/auth/login', credentials);
       
        login.success(cacheSession);
        login.success(FlashService.clear);

        login.error(loginError);

        return login;
      },
      logout: function() {
        var logout = $http.get(  SERVER + '/auth/logout');
        logout.success(uncacheSession); 
        return logout;
      },
      isLoggedIn: function() {
        return SessionService.get('authenticated');
      }
    };
  });

  app.factory('FlashService', ['$rootScope', function ($rootScope) {
  
    return {
      show: function(message) {
        $rootScope.flash = message;
      },
      clear: function() {
        $rootScope.flash = '';
      }
    };

  }])


}).call(this);
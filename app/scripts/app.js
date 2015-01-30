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

  app.config(function($provide, $httpProvider) {
     $provide.factory('myHttpInterceptor', function ($q, $location, SessionService, FlashService, SERVER) { 
       return {
         'response': function(response) {
           // $.get(SERVER + '/auth/check')
           //    .success(function(data, status, headers, config) {
           //      console.log(data.flash);
           //    })
           //    .error(function(data, status, headers, config) {
           //      console.log(data.error.message);                
           //    });
           return response;
         },
         'responseError': function(rejection) {
           if(rejection.status === 401) {
             SessionService.unset('authenticated');
             $location.path('/login');
             FlashService.show(response.data.error);        
           }
           return $q.reject(rejection);
         }
       };
     });

    $httpProvider.interceptors.push('myHttpInterceptor');
  });

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/dashboard.html'
      })
      .when('/login', {
        templateUrl: 'views/pages/signin.html',
        controller: 'SessionsCtrl'
      })
      .when('/lock', {
        templateUrl: 'views/pages/lock-screen.html',
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

      var routesThatDoesntRequireAuth = ['/login'];

      if(_(routesThatDoesntRequireAuth).contains($location.path()) && AuthenticationService.isLoggedIn()) {
         $location.path('/');
      }

      if($location.path() === '/lock' && !AuthenticationService.isLoggedIn()) {
         $location.path('/login');
      }

    });

  });

  app.factory('SessionService', [function () {
    return {
      set: function(key, val) {
        return localStorage.setItem(key, val);
      },
      get: function(key) {
        return localStorage.getItem(key);
      },    
      unset: function(key, val) {
        return localStorage.removeItem(key);
      },
      setUserData: function(obj) {
        return localStorage.setItem('user_data', JSON.stringify(obj));
      },
      getUserData: function() {
        return JSON.parse(localStorage.getItem('user_data'));        
      }
    };
  }])

  app.factory('AuthenticationService', function ($http, $location, SERVER, SessionService, FlashService) {
    
    var cacheSession = function() {
      SessionService.set('authenticated', true);
    };

    var cacheUserData = function(response) {
      SessionService.setUserData(response.data);
    };

    var uncacheSession = function() {
      SessionService.unset('authenticated');
    };

    var uncacheUserData = function() {
      SessionService.unset('user_data');
    };

    var loginError = function(response) {
      FlashService.show(response.error.message);
    };

    return {
      login: function(credentials) {
        var login = $http.post( SERVER + '/auth/login', credentials);
       
        login.success(cacheSession);
        login.success(FlashService.clear);
        login.success(cacheUserData);

        login.error(loginError);

        return login;
      },
      logout: function() {
        var logout = $http.delete(  SERVER + '/auth/logout');
        logout.success(uncacheSession); 
        logout.success(uncacheUserData); 

        return logout;
      },
      isLoggedIn: function() {
        return SessionService.get('authenticated');
      },
      loggedUser: function() {
        return SessionService.getUserData();
      },
      lockUser: function() {
        SessionService.set('lock', true);
      },
      unlockUser: function(credentials) {
        var unlock = $http.post( SERVER + '/auth/unlock', credentials);        
        unlock.success(function(response) {
            SessionService.unset('lock');  
            FlashService.clear();            
        })
        .error(function(rejection) {
          FlashService.show(rejection.data.error);   
        });
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

  }]);


}).call(this);
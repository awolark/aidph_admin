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
    //Custom modules
    'app.ui.ctrls',
    'app.ui.directives',
    'app.ui.services',
    'app.directives',
    'app.tables',
    'app.task'
  ])

   .constant('APP_NAME', '#aidPH')
   .constant('SERVER', 'http://api.aidph.dev:80')
   
   .config(function($provide, $httpProvider) {
     $provide.factory('myHttpInterceptor', function ($q, $location, SessionService, FlashService) { 
       return {
         'response': function(response) {
           return response;
         },
         'responseError': function(rejection) {
           if(rejection.status === 401) {
             SessionService.unset('authenticated');
             SessionService.unset('user_data');
             SessionService.unset('lock');

             $location.path('/login');
             FlashService.show(rejection.data.error);        
           }
           return $q.reject(rejection);
         }
       };
     });

    $httpProvider.interceptors.push('myHttpInterceptor');
  })

  .config(function ($routeProvider) {
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
      .when('/areas', {
        templateUrl: 'views/pages/areas.html',
        controller: 'AreasCtrl',
        resolve: {
          areaResponse : function(AreaService) {
            return AreaService.get();
          }
        }
      })
      .when('/infrastructures', {
        templateUrl: 'views/pages/infras.html',
        controller: 'InfrasCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

  .run(function($rootScope, $location, AuthenticationService, FlashService) {

    var routesThatRequireAuth = ['/', '#/', '/areas'];

    $rootScope.$on('$routeChangeStart', function(event, next, current) {

      if(_(routesThatRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn()) {
        $location.path('/login');
        FlashService.show('Please Login to Continue');
        return;
      }

      var routesThatDoesntRequireAuth = ['/login'];

      if(_(routesThatDoesntRequireAuth).contains($location.path()) && AuthenticationService.isLoggedIn()) {
         $location.path('/');
         return;
      }

      if($location.path() === '/lock' && !AuthenticationService.isLoggedIn()) {
         $location.path('/login');
         return;
      }

    });

  });


}).call(this);
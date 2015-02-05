(function() {

    'use strict';

/**
 * @ngdoc overview
 * @name aidphApp
 * @description
 * # aidphApp
 *
 * Main module of the application.
 */
angular
  .module('aidphApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ui.router',
    'ngSanitize',
    // 3rd Party Modules
    'ui.bootstrap',
    'angularUtils.directives.dirPagination',
    //Custom modules
    'app.ui.ctrls',
    'app.ui.directives',
    'app.ui.services',
    'app.directives',
    'app.task',
    'app.custom.filters'
  ])
   .constant('APP_NAME', '#aidPH')
   .constant('SERVER', 'http://api.aidph.dev:80')
   
   .config(function($provide, $httpProvider) {
     $provide.factory('myHttpInterceptor',
      function ($q, $location, SessionService, FlashService, logger) { 
       return {
         'response': function(response) {
           return response;
         },
         'responseError': function(rejection) {
           // if(rejection.status === 401 && SessionService.get('lock')){
           //   $location.path('/lock');
           //   logger.log('User is locked');
           // }
           if(rejection.status === 401) {
             $location.path('/login');
             FlashService.show(rejection.data.error);        
           }
           return $q.reject(rejection);
         }
       };
     });

    $httpProvider.interceptors.push('myHttpInterceptor');
  })

// Routing
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      // Home Page
      .state('indexState', {
        url: '/',
        templateUrl: 'views/dashboard.html'
      })
      // Login
      .state('loginState', {
        url: '/login',
        templateUrl: 'views/pages/signin.html',
        controller: 'SessionsController'
      })
      // Lock
      .state('lockState', {
        url: '/lock',
        templateUrl: 'views/pages/lock-screen.html',
        controller: 'SessionsController'        
      })
      
      // Areas
      .state('areasState', {
        url: '/areas',
        templateUrl: 'views/areas/areas.html',
        controller: 'AreasController',
        controllerAs: 'areasCtrl',
        resolve: {
          areasService: 'Area',
          areaData: function(areasService) {
            return areasService.query({limit: 25}).$promise;
          }
        }
      })

      // Infrastructures
      .state('infrasState', {
        url: '/infras',
        templateUrl: 'views/infras/infras.html',
        controller: 'InfrasController',
        controllerAs: 'infrasCtrl',
        resolve: {
          infrasService: 'Infrastructure',
          responseData: function(infrasService) {
            return infrasService.query({limit: 25}).$promise;
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  })
// Routing Ends here

// Route Watcher
  .run(function($rootScope, $state, $location, AuthenticationService, SessionService, FlashService) {

    var routesThatRequireAuth = ['/', '#/', '/lock', '/areas', '/infrastructures'];
    var routesThatDoesntRequireAuth = ['/login'];

    $rootScope.$on('$stateChangeStart', function(event, next, current) {

      /* Redirect to login page if user is not logged in */

      if(_(routesThatRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn()) {
        $location.path('/login', {});
        FlashService.show('Please Login to Continue');
        return;
      }

      if(SessionService.get('lock') && AuthenticationService.isLoggedIn()){
        $location.path('/lock');
        // logger.log('User is locked');
      }


      /* Redirect to index if user is logged in */

      if(_(routesThatDoesntRequireAuth).contains($location.path()) && AuthenticationService.isLoggedIn()) {
         $location.path('/');
         return;
      }


      /* Redirect to login if user */

      // if($location.path() === '/lock' && !AuthenticationService.isLoggedIn()) {
      //    $location.path('/login');
      //    return;
      // }

    });

  })

// Paginator Template Config
  .config(function(paginationTemplateProvider) {
      paginationTemplateProvider.setPath('views/templates/dirPagination.tpl.html');
  });


}).call(this);
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

      $httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

       $provide.factory('myHttpInterceptor',
        function ($q, $location, $rootScope, SessionService, logger) { 
         return {
           'response': function(response) {
             $rootScope.$broadcast('loader_hide');

             return response || $q.when(response);
           },
           'responseError': function(rejection) {
             $rootScope.$broadcast('loader_hide');

             if(rejection.status === 401) {
               $location.path('/login');
               
               logger.logFail(rejection.data.error);        
             }
             // else if(rejection.status === 404) {
             //    $location.path('/404');
             // }
             return $q.reject(rejection);
           },
           'request': function(config) {
              /* Start loading animation */
              $rootScope.$broadcast('loader_show');
              return config  || $q.when(config);
           },
           'requestError' : function(rejection) {
              $rootScope.$broadcast('loader_hide');

              return $q.reject(rejection);
           }
         };
       });

      $httpProvider.interceptors.push('myHttpInterceptor');
  })

  /* Route Watcher */ 
  
  .run(function($rootScope, $state, $location, AuthenticationService, SessionService, FlashService) {

    var routesThatRequireAuth = ['/', '#/', '/areas', '/users', '/infrastructures', '/households'];
    var routesThatDoesntRequireAuth = ['/login'];

    $rootScope.$on('$stateChangeStart', function(event, next, current) {

      /* Restart loading animation */
      Pace.restart();

      /* Redirect to login page if user is not logged in */

      if(_(routesThatRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn()) {
        $location.path('/login', {});
        FlashService.show('Please Login to Continue');
        return;
      }
      
      /* Redirect to index if user is logged in */
      if( _(routesThatDoesntRequireAuth).contains($location.path()) && AuthenticationService.isLoggedIn() ) {
           $location.path('/');
           return;
      }

    });

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

      // Areas
      .state('areasState', {
        url: '/areas',
        templateUrl: 'views/areas/areas.html',
        controller: 'AreasController',
        controllerAs: 'areasCtrl',
        resolve: {
          areasService: 'Area',
          areaData: function(areasService, AuthenticationService) {
            return areasService.query({limit: 25, loggedUserId: AuthenticationService.loggedUser().user_id}).$promise;
          }
        }
      })
      // Users
      .state('usersState', {
        url: '/users',
        templateUrl: 'views/users/users.html',
        controller: 'UsersController',
        controllerAs: 'usersCtrl',
        resolve: {
          usersService: 'User',
          responseData: function(usersService, AuthenticationService) {
            return usersService.query({limit: 25, loggedUserId: AuthenticationService.loggedUser().user_id}).$promise;
          }
        }
      })

      // Infrastructures
      .state('householdsState', {
        url: '/households',
        templateUrl: 'views/households/households.html',
        controller: 'HouseholdsController',
        controllerAs: 'hhCtrl',
        resolve: {
          householdService: 'Household',
          responseData: function(householdService, AuthenticationService) {
            return householdService.query({limit: 25, loggedUserId: AuthenticationService.loggedUser().user_id}).$promise;
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
          responseData: function(infrasService, AuthenticationService) {
            return infrasService.query({limit: 25, loggedUserId: AuthenticationService.loggedUser().user_id}).$promise;
          }
        }
      })

      .state('pageNotFoundState', {
        url: '/404',
        templateUrl: 'views/pages/404.html'
      });

    $urlRouterProvider.otherwise('/404');
  })


// Paginator Template Config
  .config(function(paginationTemplateProvider) {
      paginationTemplateProvider.setPath('views/templates/dirPagination.tpl.html');
  });


}).call(this);
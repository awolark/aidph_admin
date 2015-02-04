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
    // .state('createAreaState', {
    //   url: '/areas/new',
    //   templateUrl: 'views/areas/add-areas.html'
    // })        
    // .state('viewAreaState', {
    //   url: '/areas/:id',
    //   templateUrl: 'views/areas/view-areas.html'
    // })       
    // .state('updateAreaState', {
    //   url: '/areas/:id',
    //   templateUrl: 'views/areas/edit-areas.html'
    // })       
    // Infrastructures
    .state('infrasState', {
      url: '/infrastructures',
      templateUrl: 'views/infras/infras.html',
      controller: 'InfrasController',
      resolve: {
        infrasResource: 'InfrasResource',
        infras: function(infrasResource) {
          return infrasResource.get().$promise;
        }
      }
    });
  // .state('infrasEditState', {
  //   url: '/infrastructures/edit/:infraId',
  //   templateUrl: 'views/infras/edit-infra.html',
  //   controller: 'EditInfrasController'
  // });
      
    $urlRouterProvider.otherwise('/');
  })
// Routing Ends here

// Route Watcher
  .run(function($rootScope, $state, $location, AuthenticationService, FlashService) {

    var routesThatRequireAuth = ['/', '#/', '/areas', '/infrastructures'];

    $rootScope.$on('$stateChangeStart', function(event, next, current) {

      if(_(routesThatRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn()) {
        $location.path('/login', {});
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

  })

// Paginator Template Config
  .config(function(paginationTemplateProvider) {
      paginationTemplateProvider.setPath('views/templates/dirPagination.tpl.html');
  });


}).call(this);
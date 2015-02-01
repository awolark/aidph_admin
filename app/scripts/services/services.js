(function() {

'use strict';  

angular.module('aidphApp')
  .factory('SessionService', [function () {
    return {
      set: function(key, val) {
        return localStorage.setItem(key, val);
      },
      get: function(key) {
        return localStorage.getItem(key);
      },    
      unset: function(key) {
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
  .factory('AuthenticationService', function ($http, $location, SERVER, SessionService, FlashService) {
    
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

    var uncacheUserLock = function() {
      SessionService.unset('lock');
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
        logout.success(uncacheUserLock);
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
        unlock.success(function() {
            SessionService.unset('lock');  
            FlashService.clear();            
        })
        .error(function(rejection) {
          FlashService.show(rejection.data.error);   
        });
      }
    };
  })
  .factory('FlashService', ['$rootScope', function ($rootScope) {
  
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
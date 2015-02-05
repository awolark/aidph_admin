 (function() {

'use strict';  

angular.module('aidphApp')
 .factory('AuthenticationService', function ($http, $location, SERVER, $sanitize, SessionService, FlashService) {
    
    var cacheSession = function(response) {  
      SessionService.set('authenticated', true);
      SessionService.set('user_data',JSON.stringify(response.data));
    };

    var cacheUserData = function(response) {
    };


    var uncacheSession = function() {
      SessionService.unset('authenticated');
      SessionService.unset('user_data');   
      SessionService.unset('lock');         
    };

    var loginError = function(response) {
      FlashService.show(response.error.message);
    };

    var sanitizeCredentials = function(credentials) {
      return {
        username: $sanitize(credentials.username),
        password: $sanitize(credentials.password)
      };
    };

    return {
      login: function(credentials) {
        var login = $http.post( SERVER + '/auth/login', sanitizeCredentials(credentials));
       
        login.success(cacheSession);
        login.success(FlashService.clear);

        login.error(loginError);

        return login;
      },
      logout: function() {
        var logout = $http.delete(  SERVER + '/auth/logout');
        logout.success(uncacheSession); 
        return logout;
      },
      isLoggedIn: function() {
        return SessionService.get('authenticated');
      },
      loggedUser: function() {
        return JSON.parse(SessionService.get('user_data'));
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
  });

}).call(this);
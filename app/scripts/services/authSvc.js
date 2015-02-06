 (function() {

'use strict';  

angular.module('aidphApp')
 .factory('AuthenticationService', function ($http, $location, SERVER, $sanitize, SessionService, FlashService) {

      this.login = function(credentials) {
        var self = this;
        var login = $http.post( SERVER + '/auth/login', self.sanitizeCredentials(credentials));
       
        login.success(self.cacheSession);
        login.success(FlashService.clear);

        login.error(function(response) {
          FlashService.show(response.error.message);
        });

        return login;
      };
      
      this.logout = function() {
        var logout = $http.delete(  SERVER + '/auth/logout'),
            self = this;
        logout.success(self.uncacheSession);
        return logout;
      };

      this.isLoggedIn = function() {
        return SessionService.get('authenticated');
      };

      this.loggedUser = function() {
        return JSON.parse(SessionService.get('user_data'));
      };

      this.sanitizeCredentials = function(credentials) {
        return {
          username: $sanitize(credentials.username),
          password: $sanitize(credentials.password)
        };
      };

      this.cacheSession = function(response) {  
        SessionService.set('authenticated', true);
        SessionService.set('user_data',JSON.stringify(response.data));
      };

      this.uncacheSession = function() {
        SessionService.unset('authenticated');
        SessionService.unset('user_data');         
      };

      return this;
  });

}).call(this);
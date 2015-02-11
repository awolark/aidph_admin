 (function() {

'use strict';  

angular.module('aidphApp')

  .directive('areaList', ['Area', 'Notify', 'logger', function (Area, Notify, logger) {
    return {
      templateUrl: 'views/templates/areas-list-template.html',
      restrict: 'E',
      transclude: true,
      link: function(scope, element, attrs) {
      	
      	//when a new customer is added refresh the list
      	      	
      	Notify.getMsg('Area successfully created', function(event, data) {
      		      	
      		Area.query({limit: scope.areasCtrl.numPerPage, page: scope.areasCtrl.currentPage}).$promise.then(function(response){
      				scope.areasCtrl.areas = response.data;	
      				scope.areasCtrl.totalData = response.meta.pagination.total;
      		});
          
      	});
      }
    };
  }])

  // REPLACE
  .directive('infrasList', ['Infrastructure', 'Notify', 'logger', function (Infrastructure, Notify, logger) {
    return {
      templateUrl: 'views/templates/infras-list-template.html',
      restrict: 'E',
      transclude: true,
      link: function(scope, element, attrs) {
        
        //when a new customer is added refresh the list
                
        Notify.getMsg('Infrastructure successfully created', function(event, data) {
                
          Infrastructure.query({limit: scope.usersCtrl.numPerPage, page: scope.usersCtrl.currentPage}).$promise.then(function(response){
              scope.usersCtrl.data = response.data;  
              scope.usersCtrl.totalData = response.meta.pagination.total;
          });
        
        });
      }
    };
  }])

  .directive('usersList', ['User', 'Notify', 'logger', function (User, Notify, logger) {
    return {
      templateUrl: 'views/templates/users-list-template.html',
      restrict: 'E',
      transclude: true,
      link: function(scope, element, attrs) {
        
        //when a new customer is added refresh the list
                
        Notify.getMsg('User successfully created', function(event, data) {
                
          User.query({limit: scope.usersCtrl.numPerPage, page: scope.usersCtrl.currentPage}).$promise.then(function(response){
              scope.usersCtrl.data = response.data;  
              scope.usersCtrl.totalData = response.meta.pagination.total;
          });
        
        });
      }
    };
  }])

  .directive('householdsList', ['Household', 'Notify', 'logger', function (Household, Notify, logger) {
    return {
      templateUrl: 'views/templates/households-list-template.html',
      restrict: 'E',
      transclude: true,
      link: function(scope, element, attrs) {
        
        //when a new customer is added refresh the list
                
        Notify.getMsg('Household successfully created', function(event, data) {
                
          Household.query({limit: scope.hhCtrl.numPerPage, page: scope.hhCtrl.currentPage}).$promise.then(function(response){
              scope.hhCtrl.data = response.data;  
              scope.hhCtrl.totalData = response.meta.pagination.total;
          });
        
        });
      }
    };
  }]);


}).call(this);
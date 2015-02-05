'use strict';

describe('Controller: InfrasCtrl', function () {

  // load the controller's module
  beforeEach(module('aidphAdminApp'));

  var InfrasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InfrasCtrl = $controller('InfrasCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

'use strict';

describe('Controller: HouseholdCtrl', function () {

  // load the controller's module
  beforeEach(module('aidphApp'));

  var HouseholdCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HouseholdCtrl = $controller('HouseholdCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

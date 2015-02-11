'use strict';

describe('Directive: household', function () {

  // load the directive's module
  beforeEach(module('aidphApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<household></household>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the household directive');
  }));
});

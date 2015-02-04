'use strict';

describe('Directive: listDirectives', function () {

  // load the directive's module
  beforeEach(module('aidphAdminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<list-directives></list-directives>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the listDirectives directive');
  }));
});

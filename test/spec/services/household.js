'use strict';

describe('Service: household', function () {

  // load the service's module
  beforeEach(module('aidphApp'));

  // instantiate service
  var household;
  beforeEach(inject(function (_household_) {
    household = _household_;
  }));

  it('should do something', function () {
    expect(!!household).toBe(true);
  });

});

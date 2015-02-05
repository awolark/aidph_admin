'use strict';

describe('Service: infras', function () {

  // load the service's module
  beforeEach(module('aidphApp'));

  // instantiate service
  var infras;
  beforeEach(inject(function (_infras_) {
    infras = _infras_;
  }));

  it('should do something', function () {
    expect(!!infras).toBe(true);
  });

});

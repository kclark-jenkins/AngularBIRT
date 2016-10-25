'use strict';

describe('reportFilters.version module', function() {
  beforeEach(module('reportFilters.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
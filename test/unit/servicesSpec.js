'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('myApp.services'));


  describe('version', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
  
  
  describe('$chartUtils', function() {
    it('should return the max of an array with several series', inject(function($chartUtils) {
      var fakeData = [
        {x: 0, y: 1, y2: 2},
        {x: 1, y: 3, y2: 6},
        {x: 2, y: -4, y2: 2},
        {x: 4, y: 0, y2: 0}
      ];
      
      
      var fakeOptions = {
        abscissas: 'x',
        series: [
          {y: 'y'}
        ]
      };
      
      expect($chartUtils.max(fakeData, fakeOptions)).toEqual(3);
      
      fakeOptions = {
        abscissas: 'x',
        series: [
          {y: 'y'},
          {y: 'y2'}
        ]
      };
      
      expect($chartUtils.max(fakeData, fakeOptions)).toEqual(6);
    }));
  });
  
});

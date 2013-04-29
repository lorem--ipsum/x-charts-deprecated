'use strict';

describe('x-utils', function() {
  beforeEach(module('x-utils'));

  describe('xUtil', function() {
    it('should return proper average step', inject(function(xUtil) {
      var fakeData = [
        {x: 0, y: 1, y2: 2},
        {x: 1, y: 3, y2: 6},
        {x: 2, y: -4, y2: 2},
        {x: 3, y: 0, y2: 0}
      ];
      
      expect(xUtil.getAverageStep(fakeData, 'x')).toEqual(1);
      
      fakeData = [
        {x: 0, y: 1, y2: 2},
        {x: 0.1, y: 3, y2: 6},
        {x: 0.2, y: -4, y2: 2},
        {x: 0.3, y: 0, y2: 0}
      ];
      expect(xUtil.getAverageStep(fakeData, 'x')).toBeCloseTo(0.1, 16);
    }));
    
    it('should compute columns data', inject(function(xUtil) {
      var data = [
        {x: 0, y: 1, y2: 2},
        {x: 1, y: 3, y2: 6},
        {x: 2, y: -4, y2: 2},
        {x: 3, y: 0, y2: 0}
      ];
      
      var options = {
        abscissas: 'x',
        series: [
          {y: 'y', type: 'plot'},
          {y: 'y2', type: 'column'}
        ]
      };
      
      var expected = [{
        values: [{seriesIndex: 0, name: 'y2', value: 2, axis: 'y', abscissa: 0}],
        x: 0
      }, {
        values: [{seriesIndex: 0, name: 'y2', value: 6, axis: 'y', abscissa: 1}],
        x:1
      }, {
        values: [{seriesIndex: 0, name: 'y2', value: 2, axis : 'y', abscissa:2}],
        x: 2
      }, {
        values: [{seriesIndex: 0, name: 'y2', value: 0, axis: 'y', abscissa: 3}],
        x: 3
      }];
      
      expect(expected).toEqual(xUtil.getColumnData(options.series, options.abscissas, data));
    }));
    
  });
  
});

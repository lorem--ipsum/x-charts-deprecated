'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
  .value('version', '0.1')
  .factory('$chartUtils', function() {
    return {
      max: function(data, options) {
        var max = Number.NEGATIVE_INFINITY;
        
        angular.forEach(data, function(row) {
          angular.forEach(options.series, function(serie) {
            max = Math.max(max, row[serie.y]);
          })
        })
        
        return max;
      }
    }
  })
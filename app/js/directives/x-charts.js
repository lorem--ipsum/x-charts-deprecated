'use strict';

angular.module('x-charts', [])

.directive('barChart', function() {
  var link = function(scope, element, attrs, ctrl) {
   var chart = d3.select(element[0]).attr("class", "chart");
   
   chart.selectAll("div")
      .data(scope.data)
    .enter().append("div")
      .style("width", function(d) { return d * 10 + "px"; })
      .text(function(d) { return d; });
  }
  
  return {
    restrict: "E",
    replace: true,
    transclude: true,
    scope: {
      data: "=data"
    },
    template: '<div></div>',
    link: link
  };
})

.directive('columnChart', ['$chartUtils', function($chartUtils) {
  var link = function(scope, element, attrs, ctrl) {
    
    scope.draw = function() {
      if (!scope.data || !scope.options) {
        return;
      }
      
      var chart = d3.select(element[0])
        .attr("class", "chart")
        .style('position', 'relative');
      
      var max = $chartUtils.max(scope.data, scope.options);
      var colWidth = 19;
      
      chart.selectAll("div")
        .data(scope.data, ['one'])
        .enter().append("div")
          .style('height', function(d) { return d * 10 + "px"; })
          .style('width', colWidth + 'px')
          .style('text-align', 'center')
          .style('position', 'absolute')
          .style('top', function(d) {return (max - d)*10 + 'px';})
          .style('left', function(d, i) {return i*(colWidth + 7) + 'px';})
          .style('display', 'inline-block')
          .text(function(d) {console.log(d);return d; });
    }
      
    scope.$watch('options', scope.draw);
    scope.$watch('data', scope.draw);
    
    scope.draw();
  }
  
  
  return {
    restrict: "E",
    replace: true,
    transclude: true,
    scope: {
      data: "=data",
      options: "=options"
    },
    template: '<div></div>',
    link: link
  };
}])
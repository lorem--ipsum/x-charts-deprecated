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
    
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
    

    var x = d3.scale.linear()
      .range([0, width]);

    var y = d3.scale.linear()
      .range([height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")

    var svg = d3.select(element[0]).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
    scope.redraw = function() {
      var data = scope.data;
      var options = scope.options;
      
      if (!data || !options) {
        return;
      }
      
      data.forEach(function(d) {
        d.values = options.series.map(function(s) {
          return {name: s.y, value: d[s.y]}}
        );
      })
      
      x.domain([0, d3.max(data, function(d) {return d.x; })]);
      
      var minY = Number.POSITIVE_INFINITY;
      var maxY = Number.NEGATIVE_INFINITY;
      
      angular.forEach(options.series, function(serie) {
        minY = Math.min(minY, d3.min(data, function(d) {return d[serie.y]}));
        maxY = Math.max(maxY, d3.max(data, function(d) {return d[serie.y]}));
      });
      
      y.domain([minY, maxY]).nice();

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("One");
      
      angular.forEach(options.series, function(serie) {
        svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.x); })
            .attr("width", x.range()[1]/data.length/2)
            .attr("y", function(d) { return  y(Math.max(0, d[serie.y])); })
            .attr("height", function(d) { return Math.abs(y(d[serie.y]) - y(0));});
      });
      
    }
      
    scope.$watch('options', scope.redraw);
    scope.$watch('data', scope.redraw);
    
    scope.redraw();
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
'use strict';

angular.module('x-plot', []).directive('plotChart', ['$chartUtils', function($chartUtils) {
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
    
    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    
    var svg = d3.select(element[0]).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var div = d3.select("body").append("div")   
      .attr("class", "tooltip")               
      .style("opacity", 0);
      
    scope.redraw = function() {
      var data = scope.data;
      var options = scope.options;
      
      svg.selectAll('*').remove()
      
      if (!data || !options) {
        return;
      }
      
      data.forEach(function(d) {
        d.values = options.series.map(function(s, i) {
          return {seriesIndex:i, name: s.y, value: d[s.y], abscissa: d[options.abscissas]}}
        );
      })
      
      x.domain(d3.extent(data, function(d) {return d.x;}));
      
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
      
      var abscissa = svg.selectAll(".abscissa")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x(d.x) + ",0)"; });

      abscissa.selectAll(".dot")
        .data(function(d) { return d.values; })
        .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 2.5)
          .attr("cy", function(d) { return y(d.value); })
        .style("fill", function(d) { return color(d.name); })
        .style("fill-opacity", .8)
        .on("mouseover", function(d) {
            d3.select(this).style("fill-opacity", 1.0);
            
            div.transition()
              .duration(200)
              .style("opacity", .9);
            
            div.html(d.abscissa + " : "  + d.value)
              .style("left", (d3.event.pageX) + "px")
              .style('background', color(d.name))
              .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            d3.select(this).style("fill-opacity", .8);
            div.transition()
              .duration(500)
              .style("opacity", 0);
        })
    }
      
    scope.$watch('options', scope.redraw, true); // true -> deep watching
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
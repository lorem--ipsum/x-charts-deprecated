'use strict';

angular.module('x-column', [])

.directive('columnChart', ['xUtil', function(xUtil) {
  var link = function(scope, element, attrs, ctrl) {
    
    // TODO : make the left and right padding on the x-axis smarter :
    // i.e. make it able to detect the step between two data, instead of just
    // doing +1 and -1 to the bounds.
    
    // TODO : add better support of few data : column width and padding must be
    // better computed.
    
    // TODO : add a real color scale
    
    // TODO : improve tooltip
    
    // TODO : CLEAN THIS MESS.
    
    var b = xUtil.bootstrap(960, 500, element[0]);
      
    var x1 = d3.scale.ordinal();
    var colors = xUtil.colorScale();
    
    scope.redraw = function() {
      b.svg.selectAll('*').remove()
      
      var data = scope.data;
      var options = scope.options;
      if (!data || !options) {
        return;
      }
      
      var padding = Math.max(0, options.seriesPadding);
      var seriesWidth = Math.max(5, b.width / data.length / options.series.length - padding);
      
      x1.domain(options.series.map(function(serie) {return serie.y;}))
        .rangeRoundBands([0, options.series.length * seriesWidth]);
    
      b.scales.x.domain(d3.extent(data, function(d) {return d[options.abscissas];}));
      b.scales.y.domain(xUtil.yExtent(options.series, data)).nice();
      b.scales.y2.domain(xUtil.y2Extent(options.series, data)).nice();
      
      xUtil.addXAxis(b);
      xUtil.addYAxis(b, options.axes.y.label);
      
      if (xUtil.hasRightAxis(options.series)) {
        xUtil.addY2Axis(b, options.axes.y2.label);
      }
      
      var abscissa = b.svg.selectAll(".abscissa")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) {
            return "translate(" + (
                b.scales.x(d[options.abscissas]) - options.series.length*seriesWidth/2
            ) + ",0)";
        });

      xUtil.straightenData(options.series, options.abscissas, data);
      
      abscissa.selectAll("rect")
        .data(function(d) { return d.values; })
        .enter().append("rect")
        .attr("width", seriesWidth)
        .attr("x", function(d) { return x1(d.seriesIndex); })
        .attr("y", function(d) { return b.scales[d.axis](Math.max(0, d.value)); })
        .attr("height", function(d) { return Math.abs(b.scales[d.axis](d.value) - b.scales[d.axis](0)); })
        .style("fill", function(d) { return colors(d.name); })
        .style("fill-opacity", .8)
        .on("mouseover", function(d) {
          xUtil.tooltipEnter(d3.select(this), b.tooltip, d, colors);
        })
        .on("mouseout", function(d) {
          xUtil.tooltipExit(d3.select(this), b.tooltip, d, colors);
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

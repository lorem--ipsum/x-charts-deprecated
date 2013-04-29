'use strict';

angular.module('x-chart', [])

.directive('chart', ['xUtil', function(xUtil) {
  var link = function(scope, element, attrs, ctrl) {
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
      
      var columnSeries = options.series.filter(function(s) {return s.type === 'column'});
      
      var padding = Math.max(0, options.seriesPadding);
      var seriesWidth = Math.max(5, b.width / data.length / columnSeries.length - padding);
      
      x1.domain(columnSeries.map(function(serie) {return serie.y;}))
        .rangeRoundBands([0, columnSeries.length * seriesWidth]);
      
      
      var step = columnSeries.length ? xUtil.getAverageStep(data, options.abscissas) : 0;
      b.scales.x.domain([
        d3.min(data, function(d) {return d[options.abscissas];}) - step,
        d3.max(data, function(d) {return d[options.abscissas];}) + step
      ]);
      b.scales.y.domain(xUtil.yExtent(options.series, data)).nice();
      b.scales.y2.domain(xUtil.y2Extent(options.series, data)).nice();
      
      xUtil.addXAxis(b);
      xUtil.addYAxis(b, options.axes.y.label);
      
      if (xUtil.hasRightAxis(options.series)) {
        xUtil.addY2Axis(b, options.axes.y2.label);
      }
      
      var colData = xUtil.getColumnData(options.series, options.abscissas, data);
      
      var colGroup = b.svg.selectAll(".colGroup")
        .data(colData)
        .enter().append("g")
          .attr("class", ".colGroup")
          .attr("transform", function(d) {
            return "translate(" + (
              b.scales.x(d[options.abscissas]) - columnSeries.length*seriesWidth/2
            ) + ",0)";
          }); 

      colGroup.selectAll("rect")
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

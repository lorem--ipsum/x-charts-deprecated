'use strict';

angular.module('x-chart', [])

.directive('chart', ['xUtil', function(xUtil) {
  var link = function(scope, element, attrs, ctrl) {
    var b = xUtil.bootstrap(960, 500, element[0]);
      
    var x1 = d3.scale.ordinal();
    var colors = xUtil.colorScale();
    
    scope.redraw = function() {
      var start = new Date().getTime();
      
      b.svg.selectAll('*').remove()
      
      var options = scope.options.options;
      if (!options) {
        return;
      }
      
      var data = scope.options.data;
      if (!data) {
        return;
      }
      
      // SCALES
      b.scales.x.domain(d3.extent(data, function(d) {return d[options.abscissas];}));
      b.scales.y.domain(xUtil.yExtent(options.series, data)).nice();
      b.scales.y2.domain(xUtil.y2Extent(options.series, data)).nice();
      
      
      // AREAS
      
      
      // COLUMNS
      var columnSeries = options.series.filter(function(s) {return s.type === 'column'});
      
      if (columnSeries.length > 0) {
        var step = xUtil.getAverageStep(data, options.abscissas);
        var d = b.scales.x.domain();
        b.scales.x.domain([d[0] - step, d[1] + step])
      }
      
      var padding = Math.max(0, options.seriesPadding);
      var seriesWidth = Math.max(5, b.width / data.length / columnSeries.length - padding);
      
      
      x1.domain(columnSeries.map(function(serie) {return serie.y;}))
        .rangeRoundBands([0, columnSeries.length * seriesWidth]);
      
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
      
      
      // LINES
      var lineData = xUtil.getLineData(options.series, options.abscissas, data);
      
      var line = d3.svg.line()
        // .interpolate('basis')
        .x(function(d) {return b.scales.x(d.x);})
        .y(function(d) {return b.scales[d.axis](d.value);});
      
      var lineGroup = b.svg.selectAll(".lineGroup")
          .data(lineData)
        .enter().append("g")
          .attr("class", ".lineGroup");

      lineGroup.append("path")
        .attr("class", "line")
        .attr("d", function(d) {return line(d.values);})
        .style("stroke", function(d) {return colors(d.name);});
      
      
      // PLOTS
      var plotData = xUtil.getPlotData(options.series, options.abscissas, data);
      var plots = b.svg.selectAll(".plots")
        .data(plotData)
        .enter().append("g")
          .attr("class", "plots")
          .attr("transform", function(d) {
            return "translate(" + b.scales.x(d[options.abscissas]) + ",0)";
          });

      plots.selectAll(".dot")
        .data(function(d) { return d.values; })
        .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 2.5)
          .attr("cy", function(d) { return b.scales[d.axis](d.value); })
        .style("fill", function(d) { return colors(d.name); })
        .style("fill-opacity", .8)
        .on("mouseover", function(d) {
          xUtil.tooltipEnter(d3.select(this), b.tooltip, d, colors);
        })
        .on("mouseout", function(d) {
          xUtil.tooltipExit(d3.select(this), b.tooltip, d, colors);
        })
      
      
      // AXES
      xUtil.addXAxis(b);
      xUtil.addYAxis(b, options.axes.y.label);
      
      if (xUtil.hasRightAxis(options.series)) {
        xUtil.addY2Axis(b, options.axes.y2.label);
      }
      
      console.debug(new Date().getTime() - start + "ms");
    }
      
    scope.$watch('options', scope.redraw, true); // true -> deep watching
  }
  
  
  return {
    restrict: "E",
    replace: true,
    transclude: true,
    scope: {
      options: "=options"
    },
    template: '<div></div>',
    link: link
  };
}])

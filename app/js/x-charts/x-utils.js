angular.module('x-utils', [])
  .factory('xUtil', function() {
    return {
      bootstrap: function(width, height, element) {
        var margin = {top: 20, right: 50, bottom: 30, left: 50};
        
        width = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;
        
        var x = d3.scale.linear().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);
        var y2 = d3.scale.linear().range([height, 0]);

        var svg = d3.select(element).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        var tooltip = d3.select(element).append("div")   
          .attr("class", "tooltip")               
          .style("opacity", 0);
        
        return {
          axes: {
            x: d3.svg.axis().scale(x).orient("bottom"),
            y: d3.svg.axis().scale(y).orient("left"),
            y2: d3.svg.axis().scale(y2).orient("right")
          },
          scales: {x: x, y: y, y2: y2},
          tooltip: tooltip,
          svg: svg,
          width: width,
          height: height
        }
      },
      colorScale: function(amount) {
        return d3.scale.ordinal()
            .range([
                "#98abc5",
                "#8a89a6",
                "#7b6888",
                "#6b486b",
                "#a05d56",
                "#d0743c",
                "#ff8c00"
            ]);
      },
      
      addXAxis: function(b) {
        return b.svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + b.height + ")")
          .call(b.axes.x);
      },
      
      addYAxis: function(b, label) {
        b.svg.append("g")
          .attr("class", "y axis")
          .call(b.axes.y)
          .append("text")
            .attr("transform", "translate(-50, " + b.height*.5 + "), rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .text(label);
      },
      
      addY2Axis: function(b, label) {
        b.svg.append("g")
          .attr("class", "y2 axis")
          .attr("transform", "translate(" + b.width + ", 0)")
          .call(b.axes.y2)
          .append("text")
            .attr("transform", "translate(50, " + b.height * .5 + "), rotate(90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .text(label);
      },
      
      yExtent: function(series, data) {
          var minY = Number.POSITIVE_INFINITY;
          var maxY = Number.NEGATIVE_INFINITY;
          
          series.forEach(function(s) {
            if (s.axis !== 'y') {
              return;
            }
            
            minY = Math.min(minY, d3.min(data, function(d) {return d[s.y]}));
            maxY = Math.max(maxY, d3.max(data, function(d) {return d[s.y]}));
          });
          
          return [minY, maxY];
      },
      
      y2Extent: function(series, data) {
          var minY = Number.POSITIVE_INFINITY;
          var maxY = Number.NEGATIVE_INFINITY;
          
          series.forEach(function(s) {
            if (s.axis !== 'y2') {
              return;
            }
            
            minY = Math.min(minY, d3.min(data, function(d) {return d[s.y]}));
            maxY = Math.max(maxY, d3.max(data, function(d) {return d[s.y]}));
          });
          
          return [minY, maxY];
      },
      
      hasRightAxis: function(series) {
        var has = false;
        
        series.forEach(function(s) {
          has = has || s.axis === 'y2';
        });
        
        return has;
      },
      
      tooltipEnter: function(target, div, data, colorScale) {
        target.style("fill-opacity", 1.0);
        
        div.transition()
          .duration(200)
          .style("opacity", .9);
        
        div.html(data.abscissa + " : "  + data.value)
          .style("left", (d3.event.pageX) + "px")
          .style('background', colorScale(data.name))
          .style("top", (d3.event.pageY - 28) + "px");
      },
      
      tooltipExit: function(target, div) {
        target.style("fill-opacity", .8);
        
        div.transition()
          .duration(500)
          .style("opacity", 0);
      },
      
      getAverageStep: function(data, field) {
        var sum = 0;
        var n = data.length - 1;
        
        for (var i = 0; i<n; i++) {
          sum += data[i + 1][field] - data[i][field];
        }
        
        return sum/n;
      },
      
      getColumnData: function(series, abscissas, data) {
        var colData = [];
        
        data.forEach(function(d) {
          var row = {values: []};
          
          series.forEach(function(s, i) {
            if (s.type === 'column') {
              row.values.push({
                seriesIndex:row.values.length,
                name: s.y,
                value: d[s.y],
                axis: s.axis || 'y',
                abscissa: d[abscissas]
              })
            }
          });
          
          row[abscissas] = d[abscissas];
          
          colData.push(row);
          
        });
        
        return colData;
      },
      
      straightenData: function(series, abscissas, data) {
        data.forEach(function(d) {
          d.values = series.map(function(s, i) {
            return {
              seriesIndex:i,
              name: s.y,
              value: d[s.y],
              axis: s.axis || 'y',
              abscissa: d[abscissas]}
            }
          );
        })
        
        return data;
      }
    }
  })
'use strict';

angular.module('myApp.controllers', []).

  controller('MyCtrl1', ['$scope', function($scope) {
    
    $scope.max = 10;
    
    $scope.calculate = function() {
      var a = new Date().getTime();
      
      var data = [];
      for (var i = 0.1; i < $scope.amount; i+=.1) {
        data.push({
          x: i,
          one: Math.sin(i),
          two: Math.sin(0.2*i),
          three: Math.cos(i),
          four: Math.cos(i*i),
          five: Math.sin(1/i),
          six: Math.cos(1/i),
          seven: Math.sin(2*i),
          eight: Math.cos(2*i)
        })
      }
      var b = new Date().getTime();
      console.debug($scope.amount*10 + " rows generated in " + (b - a) + " ms");
      
      $scope.options = {
        data: data,
        options: options
      }
    };
    
    var options = {
      seriesPadding: 10,
      abscissas: 'x',
      axes: {
        y: {
          label: 'Teh left axis'
        },
        y2: {
          label: 'Teh other axis'
        }
      },
      series: [
        {y: 'one', axis: 'y', type: 'line'},
        {y: 'two', axis: 'y', type: 'column'},
        {y: 'three', axis: 'y', type: 'plot'},
        {y: 'four', axis: 'y', type: 'line'},
        {y: 'five', axis: 'y', type: 'plot'},
        {y: 'six', axis: 'y', type: 'colum'},
        {y: 'seven', axis: 'y', type: 'line'},
        {y: 'eight', axis: 'y', type: 'line'},
      ]
    };
    
    $scope.calculate();
  }])
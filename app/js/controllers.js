'use strict';

angular.module('myApp.controllers', []).

  controller('MyCtrl1', ['$scope', function($scope) {
    
    $scope.data = [];
    $scope.amount = 10;
    $scope.stats = '';
    
    $scope.calculate = function() {
      var a = new Date().getTime();
      
      var data = [];
      for (var i = 1; i < $scope.amount; i++) {
        data.push({
          x: i/10,
          one: Math.abs(Math.sin(i)),
          two: Math.sin(i*i),
          three: Math.abs(Math.sin(1/i)),
          four: Math.abs(Math.sin(i)/i),
          five: Math.abs(Math.sin(i/5)*100),
          six: Math.abs(Math.sin(i/6)*100),
          seven: Math.abs(Math.sin(i/7)),
          eight: Math.abs(Math.sin(i/8))
        })
      }
      var b = new Date().getTime();
      console.debug($scope.amount + " rows generated in " + (b - a) + " ms");
      
      $scope.data = data;
    };
    
    $scope.options = {
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
        {y: 'one', axis: 'y', type: 'plot'},
        {y: 'two', axis: 'y', type: 'column'},
        {y: 'five', axis: 'y2', type: 'column'},
        {y: 'six', axis: 'y2', type: 'area'},
      ]
    };
    
    $scope.calculate();
  }])
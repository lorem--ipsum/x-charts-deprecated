'use strict';

/* Controllers */

angular.module('myApp.controllers', []).

  controller('MyCtrl1', ['$scope', function($scope) {
    
    $scope.data = [];
    $scope.amount = 100;
    
    $scope.calculate = function() {
      $scope.data = [];
      for (var i = 0; i < $scope.amount; i++) {
        $scope.data.push({
          x: i/10,
          one: Math.sin(i/1),
          two: Math.sin(i/2),
          three: Math.sin(i/3),
          four: Math.sin(i/4),
          five: Math.sin(i/5),
          six: Math.sin(i/6),
          seven: Math.sin(i/7),
          eight: Math.sin(i/8)
        })
      }
    };
    
    $scope.options = {
      seriesPadding: 10,
      abscissas: 'x',
      series: [
        {y: 'one'},
        {y: 'two'},
        {y: 'three'},
        {y: 'four'},
        {y: 'five'},
        {y: 'six'},
        {y: 'seven'},
        {y: 'eight'}
      ]
    };
    
    $scope.calculate();
    
  }])
  .controller('MyCtrl2', [function() {

  }]);

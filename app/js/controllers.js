'use strict';

/* Controllers */

angular.module('myApp.controllers', []).

  controller('MyCtrl1', ['$scope', function($scope) {
    
    $scope.data = [];
    for (var i = 0; i < 10; i++) {
      $scope.data.push({
        x: i,
        one: parseInt(Math.sin(1/i)*100),
        two: parseInt(Math.cos(1/i)*100)
      })
    }
    
    $scope.options = {
      abscissas: 'x',
      series: [
        {y: 'one'},
        {y: 'two'}
      ]
    };
    
  }])
  .controller('MyCtrl2', [function() {

  }]);
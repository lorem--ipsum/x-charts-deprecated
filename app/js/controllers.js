'use strict';

/* Controllers */

angular.module('myApp.controllers', []).

  controller('MyCtrl1', ['$scope', function($scope) {
    
    $scope.data = [];
    for (var i = 0; i < 1000; i++) {
      $scope.data.push({
        x: i,
        one: Math.sin(i/10)*10,
        two: Math.cos(i/10)*200
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
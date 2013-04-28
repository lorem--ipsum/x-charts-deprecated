'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'x-column',
  'x-plot',
  'x-utils',
  'myApp.controllers'
]).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/plotchart', {templateUrl: 'partials/plotchart.html', controller: 'MyCtrl1'});
    $routeProvider.when('/barchart', {templateUrl: 'partials/barchart.html', controller: 'MyCtrl1'});
    $routeProvider.when('/columnchart', {templateUrl: 'partials/columnchart.html', controller: 'MyCtrl1'});
    $routeProvider.otherwise({redirectTo: '/barchart'});
  }]);

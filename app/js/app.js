'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'x-charts',
  'myApp.controllers'
]).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/barchart', {templateUrl: 'partials/barchart.html', controller: 'MyCtrl1'});
    $routeProvider.when('/columnchart', {templateUrl: 'partials/columnchart.html', controller: 'MyCtrl1'});
    $routeProvider.otherwise({redirectTo: '/barchart'});
  }]);

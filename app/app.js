'use strict';

// Declare app level module which depends on views, and components
angular.module('AngularBIRT', [
  'ngRoute',
  'ngSanitize',
  'AngularBIRT.footer',
  'AngularBIRT.header',
  'AngularBIRT.helpDialog',
  'AngularBIRT.main',
  'AngularBIRT.openDialog',
  'AngularBIRT.parameterDivider',
  'AngularBIRT.parameters',
  'AngularBIRT.savedFilters',
  'AngularBIRT.saveDialog',
  'AngularBIRT.social',
  'AngularBIRT.viewReport',
  'AngularBIRT.project',
  'AngularBIRT.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/main'});
}]);

'use strict';

angular.module('caixaEmailWebApp')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/caixaEmail', {
        templateUrl: 'views/caixaEmail.html',
        controller: 'CaixaEmailCtrl'
      })
      .otherwise({
        redirectTo: '/caixaEmail'
      });
  }]);

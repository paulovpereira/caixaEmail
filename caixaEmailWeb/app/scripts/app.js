'use strict';

angular.module('caixaEmailWebApp', [
    'ngRoute',
    'ngAnimate',
    'pascalprecht.translate'
  ], ['$translateProvider', 'messagesBR', function ($translateProvider, messagesBR) {

    $translateProvider.translations('pt_BR', messagesBR);
    $translateProvider.preferredLanguage('pt_BR');
  }]);

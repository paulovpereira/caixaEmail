'use strict';

angular.module('caixaEmailWebApp')
  .directive('spinner', function ($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var ativado = scope.$eval(attrs.spinner) || false;
        var spinner = null;

        function desenharSpinner() {
          if((!ativado && (spinner && spinner.data().spinner)) || //Condições para ativar
            (ativado && (!spinner || !spinner.data().spinner))){ //Condições para desativar
            spinner = element.spin('modal');
          }
        }

        $timeout(function () {
          desenharSpinner();
        });

        scope.$watch(attrs.spinner, function(newValue, oldValue) {
          if(newValue !== ativado) {
            ativado = newValue;
          }
          if (newValue !== oldValue) {
            desenharSpinner();
          }
        }, true);
      }
    };
  });

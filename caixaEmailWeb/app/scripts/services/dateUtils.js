'use strict';

angular.module('caixaEmailWebApp')
  .service('DateUtils', function () {
  this.agora = function  () {
    return new Date();
  };
});

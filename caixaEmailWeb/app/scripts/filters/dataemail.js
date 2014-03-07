'use strict';

angular.module('caixaEmailWebApp')
  .filter('dataEmail', function ($filter, DateUtils) {
    return function (data) {
      if(data instanceof Date) {
        var agora = DateUtils.agora();
        if(data.getFullYear() === agora.getFullYear() &&
          data.getMonth() === agora.getMonth() &&
          data.getDate() === agora.getDate()) {
          return $filter('date')(data, 'HH:mm');
        }
        return $filter('date')(data, 'dd/MM/yyyy');
      } else {
        return '';
      }
    };
  });

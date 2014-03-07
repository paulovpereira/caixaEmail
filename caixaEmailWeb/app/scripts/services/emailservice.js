'use strict';

angular.module('caixaEmailWebApp')
  .factory('EmailService', function ($http, $q, config) {
    // Service logic
    // ...
    function Email(id, fields) {
      this.id = id;
      this.nome = fields[config.CAMPOS_API.NOME];
      this.assunto = fields[config.CAMPOS_API.ASSUNTO];
      this.dataEnvio = new Date(fields[config.CAMPOS_API.DATA_ENVIO]);
    }

    // Public API here
    return {
      carregarEmails: function (filtro, hoje, ordenacao, paginacao) {
        return $http.get(config.API_URL, {
          params: {
            filtro: filtro,
            hoje: hoje,
            ordenacao: ordenacao,
            pagina: paginacao.paginaAtual
          }
        }).then(function (result) {
            var emails = [],
              email;
            for (var i = 0; i < result.data.length; i++) {
              email = result.data[i];
              emails.push(new Email(email.pk, email.fields));
            }
            return emails;
          });
      },
      total: function (filtro, hoje) {
        return $http.get(config.API_URL + 'total', {
            params: {
              filtro: filtro,
              hoje: hoje
            }
          }).then(function (result) {
            return result.data;
          });
      }
    };
  });

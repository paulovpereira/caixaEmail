'use strict';

angular.module('caixaEmailWebApp')
  .constant('config', {
    API_URL: 'http://localhost:8000/emails/',
    CAMPOS_API: {NOME: 'nome', ASSUNTO: 'assunto', DATA_ENVIO: 'data_envio'}
  });

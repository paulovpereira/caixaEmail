'use strict';

angular.module('caixaEmailWebApp')
  .constant('messagesBR', {
    app       : {
      titulo     : 'Caixa de Emails',
      rodape     : 'Super-powered by',
      linkAngular: 'Angular',
      de: 'de',
      pesquisa: 'Pesquisar',
      limparFiltros: 'Limpar filtros',
      hoje: 'Hoje'
    },
    mensagem: {
      nenhumResultadoEncontrado: 'Ops, nenhum resultado foi encontrado com os filtros selecionados.'
    },
    caixaEmail: {
      titulo      : 'Emails',
      colNome     : 'Nome',
      colAssunto  : 'Assunto',
      colDataEnvio: 'Data de envio'
    }
  });
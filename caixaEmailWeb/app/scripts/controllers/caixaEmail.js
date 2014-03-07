'use strict';

angular.module('caixaEmailWebApp')
  .controller('CaixaEmailCtrl', function ($scope, EmailService) {

    function Ordenacao(campo, tipo) {
      this.campo = campo;
      this.tipo = tipo || '+';
    }

    Ordenacao.prototype = {
      toggleTipo     : function () {
        if (this.tipo === '+') {
          return '-';
        } else {
          return '+';
        }
      },
      tipoCrescente  : function () {
        return this.tipo === '+';
      },
      tipoDecrescente: function () {
        return this.tipo === '-';
      }
    };

    function Paginacao(paginaAtual, total) {
      this.totalElementos = total || 1;
      this.paginaAtual = paginaAtual;
      this.totalPaginas = Math.ceil(this.totalElementos / 10);
    }

    Paginacao.prototype = {
      atualizarTotalPaginas: function (total) {
        this.totalElementos = total;
        if(this.totalElementos > 0) {
          this.totalPaginas = Math.ceil(this.totalElementos / 10);
          this.paginaAtual = this.paginaAtual > this.totalPaginas ? this.totalPaginas : this.paginaAtual;
        }
      },
      getTotalPaginas: function () {
        return new Array(this.totalPaginas);
      },
      getIntervaloPagina      : function () {
        var primeiro = (this.paginaAtual * 10) - 9,
          ultimo = this.paginaAtual === this.totalPaginas ? this.totalElementos : (this.paginaAtual * 10);
        return primeiro + '-' + ultimo;
      },
      paginaSelecionada    : function (pagina) {
        return this.paginaAtual === pagina;
      },
      trocarPagina: function (numeroPagina) {
        this.paginaAtual = numeroPagina > this.totalPaginas ? this.totalPaginas : numeroPagina;
      },
      possuiElementos: function () {
        return this.totalElementos > 0;
      }
    };

    $scope.model = {
      controle : {
        conteudoCarregando: false
      },
      emails   : [],
      filtro   : '',
      hoje: false,
      paginacao: new Paginacao(1),
      ordenacao: new Ordenacao('data_envio', '-')
    };

    (function init() {
      carregarDados();
    })();

    function carregarDados() {
      $scope.model.controle.conteudoCarregando = true;
      return EmailService.carregarEmails($scope.model.filtro, $scope.model.hoje,
          $scope.model.ordenacao, $scope.model.paginacao)
        .then(function (emails) {
          $scope.model.emails = emails;
          return EmailService.total($scope.model.filtro, $scope.model.hoje).then(function (total) {
            $scope.model.paginacao.atualizarTotalPaginas(total);
            $scope.model.controle.conteudoCarregando = false;
          });
        });
    }

    $scope.ordenarPor = function (campo) {
      if (campo === $scope.model.ordenacao.campo) {
        $scope.model.ordenacao.tipo = $scope.model.ordenacao.toggleTipo();
      } else {
        $scope.model.ordenacao = new Ordenacao(campo);
      }

      carregarDados();
    };

    $scope.ordenacaoSelecionada = function (campo) {
      return campo === $scope.model.ordenacao.campo;
    };

    $scope.trocarPagina = function (numeroPagina) {
      $scope.model.paginacao.trocarPagina(numeroPagina);
      carregarDados();
    };

    $scope.filtrar = function () {
      carregarDados();
    };
    
    $scope.limparFiltros = function () {
      $scope.model.filtro = '';
      $scope.model.hoje = false;
      $scope.filtrar();
    };
    
    $scope.toggleHoje = function () {
      $scope.model.hoje = !$scope.model.hoje;
      carregarDados();
    };
  });

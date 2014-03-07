'use strict';

function expectCarregarDados(EmailServiceMock, scope) {
  expect(EmailServiceMock.carregarEmails).toHaveBeenCalledWith(scope.model.filtro,
    scope.model.hoje, scope.model.ordenacao, scope.model.paginacao);
  expect(EmailServiceMock.total).toHaveBeenCalledWith(scope.model.filtro, scope.model.hoje);
}

describe('Controller: CaixaEmailCtrl', function () {

  // load the controller's module
  beforeEach(module('caixaEmailWebApp'));

  var CaixaEmailCtrl,
    EmailServiceMock,
    scope;

  // Initialize the controller and a mock scope and service
  beforeEach(inject(function ($controller, EmailService, $rootScope, $q) {
    function carregarEmailsFake(filtro, hoje, ordenacao, paginacao) {
      var deferred = $q.defer(),
        emails;
      if (paginacao.paginaAtual === 1) {
        emails = [
          {id: 1, nome: 'John Doe', dataEnvio: '2014-03-01T03:27:12Z', assunto: 'Unit Tests'},
          {id: 2, nome: 'João Doe', dataEnvio: '2014-03-01T02:48:31.607Z', assunto: 'Mais tests'}
        ];
      } else {
        emails = [
          {id: 3, nome: 'John Doe', dataEnvio: '2014-03-01T03:27:12Z', assunto: 'Unit Tests'},
          {id: 4, nome: 'João Doe', dataEnvio: '2014-03-01T02:48:31.607Z', assunto: 'Mais tests'}
        ];
      }
      if(hoje || (filtro && filtro !== '')) {
        emails.splice(1, 1);
      }
      deferred.resolve(emails);
      return deferred.promise;
    }
    function totalFake (filtro, hoje) {
      var deferred = $q.defer();
      deferred.resolve(filtro || hoje ? '1' : '12');
      return deferred.promise;
    }

    scope = $rootScope.$new();
    EmailServiceMock = EmailService;
    spyOn(EmailServiceMock, 'carregarEmails').andCallFake(carregarEmailsFake);
    spyOn(EmailServiceMock, 'total').andCallFake(totalFake);

    CaixaEmailCtrl = $controller('CaixaEmailCtrl', {
      $scope      : scope,
      EmailService: EmailServiceMock
    });

    scope.$apply();
  }));

  it('deveria inicializar o scope com um model preenchido com valores default', function () {
    expect(scope.model).toBeDefined();
    expect(scope.model.controle).toBeDefined();
    expect(scope.model.controle.conteudoCarregando).toEqual(false);
    expect(scope.model.filtro).toEqual('');
    expect(scope.model.hoje).toBe(false);
    //Validar preenchimento da ordenação
    expect(scope.model.ordenacao).toBeDefined();
    expect(scope.model.ordenacao.campo).toEqual('data_envio');
    expect(scope.model.ordenacao.tipo).toEqual('-');
    //Validação preenchimento da paginação
    expect(scope.model.paginacao).toBeDefined();
    expect(scope.model.paginacao.totalElementos).toEqual('12');
    expect(scope.model.paginacao.totalPaginas).toEqual(2);
    expect(scope.model.paginacao.paginaAtual).toEqual(1);

    //deveria chamar o serviço de emails e preencher no model os emails encontrados na primeira pagina
    expectCarregarDados(EmailServiceMock, scope);
    expect(scope.model.emails.length).toEqual(2);
    expect(scope.model.emails[0].id).toEqual(1);
    expect(scope.model.emails[1].id).toEqual(2);
  });

  describe('method#ordernarPor', function () {
    it('deveria trocar o objeto ordenacao salvo no model caso troquem o campo', function () {
      EmailServiceMock.carregarEmails.reset();
      EmailServiceMock.total.reset();
      scope.ordenarPor('assunto');
      scope.$apply();

      expect(scope.model.ordenacao.campo).toEqual('assunto');
      expect(scope.model.ordenacao.tipo).toEqual('+');
      expectCarregarDados(EmailServiceMock, scope);
    });

    it('deveria trocar o sentido da ordenacao salvo no model caso seja o mesmo campo', function () {
      EmailServiceMock.carregarEmails.reset();
      scope.ordenarPor('data_envio');
      scope.$apply();

      expect(scope.model.ordenacao.campo).toEqual('data_envio');
      expect(scope.model.ordenacao.tipo).toEqual('+');
      expectCarregarDados(EmailServiceMock, scope);

      EmailServiceMock.carregarEmails.reset();
      EmailServiceMock.total.reset();
      scope.ordenarPor('data_envio');
      scope.$apply();

      expect(scope.model.ordenacao.campo).toEqual('data_envio');
      expect(scope.model.ordenacao.tipo).toEqual('-');
      expectCarregarDados(EmailServiceMock, scope);
    });
  });

  describe('method#ordenacaoSelecionada', function () {
    it('deveria retornar true quando a ordenação já estiver selecionada no model', function () {
      expect(scope.ordenacaoSelecionada('data_envio')).toBe(true);
    });
    it('deveria retornar false quando a ordenação não for igual a selecionada no model', function () {
      expect(scope.ordenacaoSelecionada('assunto')).toBe(false);
    });
  });

  describe('method#trocarPagina', function () {
    it('deveria atualizar o objeto paginacao salvo no model e recarregar os dados', function () {
      EmailServiceMock.carregarEmails.reset();
      EmailServiceMock.total.reset();
      scope.trocarPagina(2);
      scope.$apply();

      expect(scope.model.paginacao).toBeDefined();
      expect(scope.model.paginacao.totalElementos).toEqual('12');
      expect(scope.model.paginacao.totalPaginas).toEqual(2);
      expect(scope.model.paginacao.paginaAtual).toEqual(2);

      expectCarregarDados(EmailServiceMock, scope);
      expect(scope.model.emails.length).toEqual(2);
      expect(scope.model.emails[0].id).toEqual(3);
      expect(scope.model.emails[1].id).toEqual(4);
    });
  });

  describe('method#filtrar', function () {
    it('deveria chamar o service de emails e recarregar os dados', function () {
      EmailServiceMock.carregarEmails.reset();
      EmailServiceMock.total.reset();
      scope.model.filtro = 'filtro';
      scope.filtrar();
      scope.$apply();

      expect(scope.model.paginacao).toBeDefined();
      expect(scope.model.paginacao.totalElementos).toEqual('1');
      expect(scope.model.paginacao.totalPaginas).toEqual(1);
      expect(scope.model.paginacao.paginaAtual).toEqual(1);

      expectCarregarDados(EmailServiceMock, scope);
      expect(scope.model.emails.length).toEqual(1);
      expect(scope.model.emails[0].id).toEqual(1);
    });
  });

  describe('method#limparFiltros', function () {
    it('deveria limpar os campos filtros e recarregar os dados', function () {
      EmailServiceMock.carregarEmails.reset();
      EmailServiceMock.total.reset();
      scope.model.filtro = 'filtro';
      scope.model.hoje = true;
      scope.limparFiltros();
      scope.$apply();

      expect(scope.model.filtro).toEqual('');
      expect(scope.model.hoje).toEqual(false);
      expect(scope.model.paginacao).toBeDefined();
      expect(scope.model.paginacao.totalElementos).toEqual('12');
      expect(scope.model.paginacao.totalPaginas).toEqual(2);
      expect(scope.model.paginacao.paginaAtual).toEqual(1);

      expectCarregarDados(EmailServiceMock, scope);
      expect(scope.model.emails.length).toEqual(2);
      expect(scope.model.emails[0].id).toEqual(1);
      expect(scope.model.emails[1].id).toEqual(2);
    });
  });

  describe('method#toggleHoje', function () {
    it('deveria alternar o campo hoje para true quando estiver false e recarregar os dados', function () {
      EmailServiceMock.carregarEmails.reset();
      EmailServiceMock.total.reset();
      scope.toggleHoje();
      scope.$apply();

      expect(scope.model.hoje).toEqual(true);

      expect(scope.model.paginacao).toBeDefined();
      expect(scope.model.paginacao.totalElementos).toEqual('1');
      expect(scope.model.paginacao.totalPaginas).toEqual(1);
      expect(scope.model.paginacao.paginaAtual).toEqual(1);

      expectCarregarDados(EmailServiceMock, scope);
      expect(scope.model.emails.length).toEqual(1);
      expect(scope.model.emails[0].id).toEqual(1);
    });

    it('deveria alternar o campo hoje para false quando estiver true e recarregar os dados', function () {
      EmailServiceMock.carregarEmails.reset();
      EmailServiceMock.total.reset();
      scope.model.hoje = true;
      scope.toggleHoje();
      scope.$apply();

      expect(scope.model.hoje).toEqual(false);

      expect(scope.model.paginacao).toBeDefined();
      expect(scope.model.paginacao.totalElementos).toEqual('12');
      expect(scope.model.paginacao.totalPaginas).toEqual(2);
      expect(scope.model.paginacao.paginaAtual).toEqual(1);

      expectCarregarDados(EmailServiceMock, scope);
      expect(scope.model.emails.length).toEqual(2);
      expect(scope.model.emails[0].id).toEqual(1);
      expect(scope.model.emails[1].id).toEqual(2);
    });
  });
});

'use strict';

describe('Service: EmailService', function () {

  // load the service's module
  beforeEach(module('caixaEmailWebApp'));

  // instantiate service
  var EmailServiceMock;
  beforeEach(inject(function (EmailService) {
    EmailServiceMock = EmailService;
  }));

  it('deve chamar a api e formatar o resultado para objecto email', inject(function ($httpBackend, config) {
    $httpBackend.expect('GET',
        config.API_URL +
        '?filtro=fwd&hoje=false&ordenacao=%7B%22campo%22:%22data_envio%22,%22tipo%22:%22-%22%7D&pagina=1')
      .respond(200,
        '[{"pk": 5, "model": "emails.email", "fields": {"data_envio": "2014-03-02T15:00:00Z", "assunto": "Fwd: Fotos de bebês", "nome": "Mãe"}}, {"pk": 2, "model": "emails.email", "fields": {"data_envio": "2014-03-02T08:05:11Z", "assunto": "Fwd: Você tem 1 nova solicitação de amizade", "nome": "Facebook"}}]');

    $httpBackend.expect('GET',
        config.API_URL + 'total' + '?filtro=fwd&hoje=false')
      .respond(200, '2');

    EmailServiceMock.carregarEmails('fwd', false, {campo:'data_envio', tipo: '-'}, {paginaAtual: 1}).then(function(data) {
      expect(data.length).toEqual(2);
      expect(data[0].id).toEqual(5);
      expect(data[0].nome).toEqual('Mãe');
      expect(data[0].assunto).toEqual('Fwd: Fotos de bebês');
      expect(data[0].dataEnvio).toEqual(new Date('2014-03-02T15:00:00Z'));

      expect(data[1].id).toEqual(2);
      expect(data[1].nome).toEqual('Facebook');
      expect(data[1].assunto).toEqual('Fwd: Você tem 1 nova solicitação de amizade');
      expect(data[1].dataEnvio).toEqual(new Date('2014-03-02T08:05:11Z'));
    });

    EmailServiceMock.total('fwd', false).then(function(data) {
      expect(data).toBe('2');
    });

    $httpBackend.flush();
  }));

});

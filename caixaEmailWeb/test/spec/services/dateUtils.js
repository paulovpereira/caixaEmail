'use strict';

describe('Service: DateUtils', function () {

  // load the service's module
  beforeEach(module('caixaEmailWebApp'));

  // instantiate service
  var DateService;
  beforeEach(inject(function (DateUtils) {
    DateService = DateUtils;
  }));

  describe('method#agora()', function () {
    it('deve retornar a data atual', function () {
      expect(DateService.agora()).toEqual(new Date());
    });
  });
});

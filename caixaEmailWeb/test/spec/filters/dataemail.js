'use strict';

describe('Filter: dataEmail', function () {

  // load the filter's module
  beforeEach(module('caixaEmailWebApp'));

  // initialize a new instance of the filter before each test
  var dataEmail,
    filterDateAngular;

  beforeEach(module(function($provide) {
    $provide.service('DateUtils', function() {
      this.agora = function () {
        return new Date(2014, 2, 5, 12, 0);
      };
    });
  }));

  beforeEach(inject(function ($filter) {
    dataEmail = $filter('dataEmail');
    filterDateAngular = $filter('date');
  }));

  it('deve retornar a data formatada como string usando filter do angular"', function () {
    var data = new Date(2014, 2, 4, 11, 50);
    expect(dataEmail(data)).toEqual(filterDateAngular(data, 'dd/MM/yyyy'));
  });

  it('deve retornar a data formatada como string de hora usando filter do angular caso seja o mesmo dia atual"', function () {
    var data = new Date(2014, 2, 5, 16, 56);
    expect(dataEmail(data)).toEqual(filterDateAngular(data, 'HH:mm'));
  });

  it('deve retornar uma string vazia caso não seja passado um tipo Date"', function () {
    expect(dataEmail(1)).toEqual('');
    expect(dataEmail(true)).toEqual('');
    expect(dataEmail(undefined)).toEqual('');
    expect(dataEmail([])).toEqual('');
    expect(dataEmail({})).toEqual('');
  });
});

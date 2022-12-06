// Fazendo os testes de rotas vamos validar as rotas da nossa aplicação
// importando o supertest para realizar os testes de rotas
import request from 'supertest';
import {describe, expect, it, jest,} from '@jest/globals';
// chamando a aplicação 
import app from '../../app.js';

// vamos inicalizar o servidor nos testes
let server; // vai ficar do lado de fora para poder ser utilizado nos outros blocos de codigo
beforeEach(() => { // antes de cada teste inicalizar um banco de dados 
  const port = 3000;
  server = app.listen(port);
});
// derrubando o servidor
afterEach(() => { // depois de cada teste liberar o banco de dados
  server.close();
});

describe('GET em /editoras', () => {
  it('Deve retornar uma lista de editoras no formato json', async () => {
    const resposta = await request(app)
      .get('/editoras')
      // setando informações no header aonde vai ser recebida em json
      .set('Accept', 'application/json')
      // vendo se realmente vai ser recebido o json
      .expect('content-type', /json/)
      .expect(200);
    expect(resposta.body[0].email).toEqual('e@e.com');
  });

  it('Deve retornar lista de editoras', async () => {
      await request(app)
        .get('/editoras')
        .expect(200);
    })
});

// criando uma variavel para poder salvar qual que e o id que esta sendo criado para esse teste para podermos deletar especificamente esse id que foi criado
let idResposta;
describe('POST em /editoras', () => {
  it('Deve adicionar uma nova editora', async () => {
    const resposta = await request(app)
      .post('/editoras')
      // send serve para enviar informações para o corpo da requisição
      .send({
        nome: 'CDC',
        cidade: 'Sao Paulo',
        email: 's@s.com',
      })
      .expect(201);

    // guardando qual e o id que vai ser deletado 
    idResposta = resposta.body.content.id;
  });
  it('Não deve adicionar nada ao passar o body vazio', async () => {
    await request(app)
      .post('/editoras')
      .send({})
      .expect(400);
      // temos que fazer a validação do body vazio no controle de editoras antes de fazer o teste
  });
});

describe('GET em /editoras/id', () => {
  it('Deve retornar o id selecionado', async () => {
    await request(app)
      // adicionando na rota o idResposta que foi id criado pelo test de post
      .get(`/editoras/${idResposta}`)
      .expect(200);
  });
});

describe('PUT em /editoras/id', () => {
  // test.each vai pegar cada elemento do array e ele vai testar cada elemento separado 
  test.each([
    // passando o proprio nome dos elementos que estamos mexendo alem de passar a propriedade em si 'nome', 'cidade' e 'email' devemos adicionar no final do "srcipts test" o nome --verbose que vai nos mostrar todas as informações referentes a esse teste
    ['nome', { nome: 'Casa do Codigo' }], // primeiro
    ['cidade', { cidade: 'SP' }], // segundo
    ['email', { email: 'cdc@cdc.com' }], // terceiro
    // Para usarmos os elementos precisamos passar eles na arrow function vamos chamar de param e também vamos adicionar no arrow function a chave
    // chave vai substituir a string o nome do conteudo que vai nos mostrar pelo verbose quando inicar o testes
    // param vai ser o parametro que estamos mandando 
    // para substituir strings dentro de um titulo vamos colocar %s que vai substituir uma string que ele achar na tabela e jogar ela para dentro da demonstração dos testes
  ])('Deve alterar o campo %s', async (chave, param) => {
    // vamos criar um espião para acompanhar as chamadas desse metodo
    const requisicao = { request };
    // chamando o espião jest.spyOn() e passando o objeto que vamos aconpanhar e o metodo dentro do objeto requisicao: e o nosso objeto e passamos uma string com o conteudo do metodo que vai ser 'request' - devemos importar o jest
    const spy = jest.spyOn(requisicao, 'request');
    // em vez de chamar request diretamente agora vamos chamar requisicao.request
    await requisicao.request(app)
      // recebendo na rota o idResposta que foi id criado pelo test de post
      .put(`/editoras/${idResposta}`)
      // ao invés de enviar o objeto dentro do .send vamos simplismente passar o param no lugar do objeto
      .send(param)
      .expect(204);
    // fazendo uma assserção do espião 
    expect(spy).toHaveBeenCalled();
  });

  it("Deve fazer a atualização", async () => {
    await request(app)
      .put(`/editoras/${idResposta}`)
      .send({ nome: "Casa do codigo" })// alterando so uma informação
      .expect(204)
  });
});

// criando o delete para poder deletar os testes que foram adicionados ao db ou seja vai deletar o teste que esta no db
describe('DELETE em /editoras/id', () => {
  it('Deletar o editora adcionada', async () => {
    await request(app)
      // adicionando o idResposta dentro da rota que contém o id que foi criado no testes de post para se deletado
      .delete(`/editoras/${idResposta}`)
      .expect(200);
  });
});


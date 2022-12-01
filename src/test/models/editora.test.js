
// nesse arquivo vamos fazer os testes de unidades do modelo da editora
import {describe, expect, it, jest,} from '@jest/globals';
// importando o modelo editora
import Editora from '../../models/editora.js';

describe('Testando o modelo Editora', () => {
  // criando um objeto editora pegando os campos do model. Esse objeto vamos utilizar dentro dos testes
  const objetoEditora = {
      nome: 'Seretei',
      cidade: 'Sao Paulo',
      email: 'seretei@gmail.com',
  };

  it('Deve instanciar uma nova editora', () => {
    // criando uma nova editora passando o objetoEditora. O objetoEditora serve para não termos que ficar reescrevendo as informações editora
    const editora = new Editora(objetoEditora);

    // fazendo o teste para ver se editora e igual a objetoEditora
    expect(editora).toEqual(expect.objectContaining(objetoEditora),
    );
  });

  // it.skip --> Utilizar o método "skip", que serve para pular temporariamente os testes que constam na coleção de asserções;
  it.skip('Deve salvar editora no BD', () => {
    const editora = new Editora(objetoEditora);    
    editora.salvar().then((dados) => {
      expect(dados.nome).toBe('CDC');
    });
  });

  // trabalhando com banco de dados usamos async e await
  it.skip('Deve salvar no BD usando a sintaxe moderna', async () => {
    const editora = new Editora(objetoEditora);
    const dados = await editora.salvar();

    // usando o metodo statico que foi criado --> pegarPeloId
    // Estamos indo la no banco de dados e checando se o id existe e retornando ele
    const retornado = await Editora.pegarPeloId(dados.id);

    expect(retornado).toEqual(
      expect.objectContaining(
        // passando um objeto dizendo quais são os valores ou o que esperamos que tenha la dentro
        { 
        id: expect.any(Number),// esperando que seja do tipo numero
        ...objetoEditora, // resto do objeto editora  
        created_at: expect.any(String),// esperando que seja do tipo string
        updated_at: expect.any(String),
      }),
    );
  });

  // Fazendo simulação de algumas chamadas do banco de dados e essa simulação não vai alterar nada no banco de dados
  it('Deve fazer uma chamada simulada ao BD', () => {
    // criando uma nova editora
    const editora = new Editora(objetoEditora);

    // vamos usar o mock para isso precisamos usar o metodo jest.fn() tem que fazer a importação do jest la em cima
    // jest.fn() --> esse e o metodo que vai permitir que agente implemente os mocks
    // mockReturnValue --> toda vez que eu chamar o mock ele vai me retornar um valor especifico 
    editora.salvar = jest.fn().mockReturnValue({
      id: 10,
      nome: 'Seretei',
      cidade: 'Sao Paulo',
      email: 'seretei@gmail.com',
      created_at: '2022-10-01',
      updated_at: '2022-10-01',
    });

    const retorno = editora.salvar();

    expect(retorno).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        ...objetoEditora,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});


// nesse arquivo vamos fazer os testes de unidades do modelo da editora
import {
  describe, expect, it, jest,
} from '@jest/globals';
// importando o modelo editora
import Editora from '../../models/editora.js';

describe('Testando o modelo Editora', () => {
  // criando um objeto editora pegando os campos do model. Esse objeto vamos utilizar dentro dos testes
  const objetoEditora = {
    nome: 'CDC',
    cidade: 'Sao Paulo',
    email: 'c@c.com',
  };

  it('Deve instanciar uma nova editora', () => {
    // criando uma nova editora passando o objetoEditora. O objetoEditora serve para não termos que ficar reescrevendo as informações editora
    const editora = new Editora(objetoEditora);

    // fazendo o teste para ver se editora e igual a objetoEditora
    expect(editora).toEqual(
      expect.objectContaining(objetoEditora),
    );
  });

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
        id: expect.any(Number),
        ...objetoEditora, // resto do objeto editora  
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });

  it('Deve fazer uma chamada simulada ao BD', () => {
    const editora = new Editora(objetoEditora);

    editora.salvar = jest.fn().mockReturnValue({
      id: 10,
      nome: 'CDC',
      cidade: 'Sao Paulo',
      email: 'c@c.com',
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

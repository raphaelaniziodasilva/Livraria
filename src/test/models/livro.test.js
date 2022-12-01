import { describe, expect, it, jest } from "@jest/globals";
import Livro from "../../models/livro.js";

describe('Testando o modelo Livro', () => {
    // criando um objeto Livro pegando os campos do model. Esse objeto vamos utilizar dentro dos testes
    const objetoLivro = {
        titulo: "Bleach a guerra sanhrenta",
        paginas: 487,
    }
    it('Deve instanciar um novo Livro', () => {
        // criando um novo Livro
        const livro = new Livro(objetoLivro)
        expect(livro).toEqual(expect.objectContaining(objetoLivro))
    })

    it.skip('Deve salvar um Livro on DB', () => {
        const livro = new Livro(objetoLivro)
        livro.salvar().then((dados) => {
            expect(dados.nome).toBe("Bankai")
        })
    })

    // trabalhando com banco de dados usamos async e await
    it.skip('Deve salvar no BD usando a sintaxe moderna', async () => {
        const livro = new Livro(objetoLivro)
        const dados = await livro.salvar()
        const retornado = await livro.pegarPeloId(dados.id)

        expect(retornado).toEqual(expect.objectContaining(
            {
                id: expect.any(Number),// esperando que seja do tipo numero
                ...objetoLivro, // resto do objeto Livro  
                created_at: expect.any(String),// esperando que seja do tipo string
                updated_at: expect.any(String),
            }
        ))

        // Fazendo simulação de algumas chamadas do banco de dados e essa simulação não vai alterar nada no banco de dados
        it('Deve fazer uma chamada simulada ao BD', () => {
            const livro = new Livro(objetoLivro)
            livro.salvar = jest.fn().mockReturnValue(
                {
                    id: 12,
                    titulo: "Bleach a guerra sanhrenta",
                    paginas: 487,
                    editora_id: 1,
                    autor_id: 1,
                    created_at: '2022-10-01',
                    updated_at: '2022-10-01',
                }
            )
            const retorno = livro.salvar()
            expect(retornado).toEqual(expect.objectContaining({
                id: expect.any(Number),
                ...objetoLivro,
                created_at: expect.any(String),
                updated_at: expect.any(String),
            }))
        })
    })
})
import { describe, expect, it, jest } from "@jest/globals";
import Autor from "../../models/autor.js";

describe('Testando o modelo Autor', () => {
    // criando um objeto autor pegando os campos do model. Esse objeto vamos utilizar dentro dos testes
    const objetoAutor = {
        nome: "Zagetsu",
        nacionalidade: "Japones"
    }
    it('Deve instanciar um novo autor', () => {
        // criando um novo autor
        const autor = new Autor(objetoAutor)
        expect(autor).toEqual(expect.objectContaining(objetoAutor))
    })

    it.skip('Deve salvar um autor on DB', () => {
        const autor = new Autor(objetoAutor)
        autor.salvar().then((dados) => {
            expect(dados.nome).toBe("Bankai")
        })
    })

    // trabalhando com banco de dados usamos async e await
    it.skip('Deve salvar no BD usando a sintaxe moderna', async () => {
        const autor = new Autor(objetoAutor)
        const dados = await autor.salvar()
        const retornado = await Autor.pegarPeloId(dados.id)

        expect(retornado).toEqual(expect.objectContaining(
            {
                id: expect.any(Number),// esperando que seja do tipo numero
                ...objetoAutor, // resto do objeto autor  
                created_at: expect.any(String),// esperando que seja do tipo string
                updated_at: expect.any(String),
            }
        ))

        // Fazendo simulação de algumas chamadas do banco de dados e essa simulação não vai alterar nada no banco de dados
        it('Deve fazer uma chamada simulada ao BD', () => {
            const autor = new Autor(objetoAutor)
            autor.salvar = jest.fn().mockReturnValue(
                {
                    id: 14,
                    nome: "Zagetsu",
                    nacionalidade: "Japones",
                    created_at: '2022-10-01',
                    updated_at: '2022-10-01',
                }
            )
            const retorno = autor.salvar()
            expect(retornado).toEqual(expect.objectContaining({
                id: expect.any(Number),
                ...objetoAutor,
                created_at: expect.any(String),
                updated_at: expect.any(String),
            }))
        })
    })
})
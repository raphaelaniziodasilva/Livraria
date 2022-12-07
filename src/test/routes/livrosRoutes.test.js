import { afterEach, describe, expect, it, jest, test } from "@jest/globals"
import request from 'supertest'
// chamando a aplicação 
import app from "../../app.js"

// vamos inicalizar o servidor
let server
// antes de cada teste inicalizar o db 
beforeEach(() => {
    const port = 3030
    server = app.listen(port)
})
// depois de cada teste liberar o db
afterEach(() => {
    server.close()
})

describe("GET em /livros", () => {
    it("Deve retornar uma lista de livros no formato json", async () => {
        const resposta = await request(app)
            .get("/livros")
            .set("Accept", "application/json")
            .expect("content-type", /json/)
            .expect(200)
        expect(resposta.body[0].titulo).toEqual("O Hobbit")
    })
})

let idResposta
describe("POST em /livros", () => {
    it("'Deve adicionar um novo livro", async () => {
        const resposta = await request(app)
            .post("/livros")
            .send({
                titulo: "Nike",
                paginas: 154,
                editora_id: 1,
                autor_id: 1,
            })
            .expect(201)
        idResposta = resposta.body.content.id
    })
    it("Não deve adicionar nada ao passar o body vazio", async () => {
        await request(app)
            .post("/livros")
            .send({})
            .expect(400)
    })
})

describe("GET em /livros/id", () => {
    it("Deve retornar o id selecionado", async () => {
        await request(app)
            .get(`/livros/${idResposta}`)
            .expect(200)
    })
})

describe("PUT em /livros/id", () => {
    test.each([
        ['titulo', { titulo: 'Codigo 15' }],        ['paginas', { paginas: 129 }],
        ['editora_id', { editora_id: 1 }],
        ['autor_id', { autor_id: 1 }]
    ])("Deve alterar o campo %s", async (chave, param) => {
        const requisicao = { request }
        const spy = jest.spyOn(requisicao, "request")
        await requisicao.request(app)
            .put(`/livros/${idResposta}`)
            .send(param)
            .expect(204)
        expect(spy).toHaveBeenCalled()
    })
})

describe('DELETE em /livros/id', () => {
    it('Deletar o livro adcionado', async () => {
      await request(app)
        .delete(`/livros/${idResposta}`)
        .expect(200);
    });
})






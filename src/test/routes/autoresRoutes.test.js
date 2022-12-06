import { describe, expect, it, jest, test } from '@jest/globals'
import request from 'supertest'
import app from '../../app.js'

// vamos inicalizar o servidor nos testes
let server
beforeEach(() => {// inicalizar o db
    const port = 3300
    server = app.listen(port)
})
afterEach(() => { // fechar o db
    server.close()    
})

describe("Get em /autores", () => {
    it("Deve retornar lista de autores", async () => {
        await request(app)
            .get("/autores")            
            .expect(200)         
    })
    it("Deve retornar uma lista de autores no formato json", async () => {
        const resposta = await request(app)
          .get("/autores")
          .set("Accept", "application/json")
          .expect("content-type", /json/)
          .expect(200)
        expect(resposta.body[0].id).toEqual(1)

    })
})

let idResposta
describe("Post em /autores",() => {
    it("Deve adicionar um novo autor", async () => {
        await request(app)
            .post("/autores")
            .send({
                nome: "Israel",
                nacionalidade: "Brasileira"
            })
            .expect(201)       
    })
    it("Deve adicionar um novo autor e vamos pegar o id para poder excluir o autor que foi criado", async () => {
        const resposta = await request(app)
            .post("/autores")
            .send({
                nome: "Israel",
                nacionalidade: "Brasileira"
            })
            .expect(201) 

        idResposta = resposta.body.content.id
    })
    it("Não deve adicionar nada ao passar o body vazio", async () => {
        await request(app)
            .post("/autores")
            .send({})
            .expect(400)
    })
})

describe("GET em /autores/id", () => {
    it("Deve retornar o id selecionado", async () => {
        await request(app)
        .get(`/autores/${idResposta}`)
        expect(200)
    })
})

describe("PUT em /autores/id", () => {
    test.each([
        ["nome", { nome: "Israel"}],
        ["nacionalidade", {nacionalidade: "Brasileira"}]

    ])("Deve alterar o campo %s", async (chave, param) => {
        const requisicao = {request}
        const spy = jest.spyOn(requisicao, "request")
        await requisicao.request(app)
            .put(`/autores/${idResposta}`)
            .send(param)
            .expect(204)
        expect(spy).toHaveBeenCalled()
    })
})

describe("DELETE em /autores/id", () => {
    it("Deletar autor adicionado", async () => {
        await request(app)
            .delete(`/autores/${idResposta}`)
            .expect(200)
    })
})


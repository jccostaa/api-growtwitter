import supertest from "supertest"
import { createApp } from "./../../src/server"
import repository from "../../src/database/prisma.connection"

describe("Testes integrados para rotas de usuario", () => {

    beforeEach(async () => {
        await repository.tweet.deleteMany()
        await repository.usuario.deleteMany()
    })
    afterAll(async () => {
        await repository.tweet.deleteMany()
        await repository.seguidor.deleteMany()
        await repository.reply.deleteMany()
        await repository.like.deleteMany()
        await repository.usuario.deleteMany()
    })

    test("Deve retornar 200 quando listar os tweets", async ()=>{
        const sut = createApp();

        const usuarioCriado = await supertest(sut).post("/usuarios").send({
            nome: "usuario 4",
            email: "usuario4@gmail.com",
            nomeUsuario: "usuario123456",
            senha: "1234567"
        })

        const login  = await supertest(sut).post("/login").send({
            email:"usuario4@gmail.com",
            senha:"1234567"
        })


        const usuarioId = usuarioCriado.body.data.id
        const token = login.body.data.token

        const result = await supertest(sut).get(`/usuarios/${usuarioId}/tweets`).set("Authorization", token)

        expect(result).toBeDefined()
        expect(result).toHaveProperty("ok", true)
        expect(result.status).toEqual(200)

        expect(result.body).toBeDefined()
        expect(result.body.message).toBe("Tweets listados com sucesso")
    })

    test("Deve retornar 200 quando listar todos os tweets", async ()=>{
        const sut = createApp()

        const usuarioCriado = await supertest(sut).post("/usuarios").send({
            nome: "usuario 4",
            email: "usuario4@gmail.com",
            nomeUsuario: "usuario123456",
            senha: "1234567"
        })

        const login  = await supertest(sut).post("/login").send({
            email:"usuario4@gmail.com",
            senha:"1234567"
        })


        const usuarioId = usuarioCriado.body.data.id
        const token = login.body.data.token

        const result = await supertest(sut).get(`/usuarios/${usuarioId}/alltweets`).set("Authorization", token)

        expect(result).toBeDefined()
        expect(result).toHaveProperty("ok", true)
        expect(result.status).toEqual(200)

        expect(result.body).toBeDefined()
        expect(result.body.message).toBe("Tweets listados com sucesso")
    })

})
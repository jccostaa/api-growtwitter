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

    test("Deve retornar 400 quando o campo nome, email, nomeUsuario ou senha nao forem informados", async () => {
        const sut = createApp()

        const result = await supertest(sut).post("/usuarios").send({
            email: "usuario@gmail.com",
            nomeUsuario: "usuario123",
            senha: "1234567"
        })

        expect(result).toBeDefined()
        expect(result).toHaveProperty("ok", false)
        expect(result.status).toEqual(400)

        expect(result.body).toBeDefined()
        expect(result.body.message).toBe("Preencha os campos obrigatorios")
    })

    test("Deve retornar 201 quando criar o usuario com sucesso", async () => {
        const sut = createApp()

        const result = await supertest(sut).post("/usuarios").send({
            nome: "usuario 2",
            email: "usuario2@gmail.com",
            nomeUsuario: "usuario1234",
            senha: "1234567"
        })

        expect(result).toBeDefined()
        expect(result).toHaveProperty("ok", true)
        expect(result.status).toEqual(201)

        expect(result.body).toBeDefined()
        expect(result.body.message).toBe("Usuario criado com sucesso")
    })

    test("Deve retornar 200 ao listar todos os usuarios", async () => {
        const sut = createApp()

        const result = await supertest(sut).get("/usuarios").send()

        expect(result).toBeDefined()
        expect(result).toHaveProperty("ok", true)
        expect(result.status).toEqual(200)

        expect(result.body).toBeDefined()
        expect(result.body.message).toBe("Usuarios listados com sucesso")
    })

    test("Deve retornar 404 quando o usuario não é encontrado", async () => {
        const sut = createApp()

        const usuarioId = "43e4b5ab-03a5-46a4-af5c-5be29ed2bf58"

        const result = await supertest(sut).get(`/usuarios/${usuarioId}`).send();

        expect(result).toBeDefined()
        expect(result.status).toEqual(404)

        expect(result.body).toBeDefined()
        expect(result.body.message).toBe("Usuario não encontrado")
    })

    test("Deve retornar 200 quando o usuario é encontrado", async () => {
        const sut = createApp()

        const usuarioCriado = await supertest(sut).post("/usuarios").send({
            nome: "usuario 3",
            email: "usuario3@gmail.com",
            nomeUsuario: "usuario12345",
            senha: "1234567"
        })

        const usuarioId = usuarioCriado.body.data.id;

        const result = await supertest(sut).get(`/usuarios/${usuarioId}`).send();

        expect(result).toBeDefined()
        expect(result.status).toEqual(200)

        expect(result.body).toBeDefined()
        expect(result.body.message).toBe("Usuario encontrado")
        expect(result.body.data).toHaveProperty("id", usuarioId)
    })

    test("Deve retornar 404 quando o usuario não é encontrado para atualização", async () => {
        const sut = createApp()

        const usuarioId = "43e4b5ab-03a5-46a4-af5c-5be29ed2bf58"

        const result = await supertest(sut).put(`/usuarios/${usuarioId}`).send({
            nome: "usuario atualizado",
            email: "usuario4_atualizado@gmail.com",
            nomeUsuario: "usuario123456_atualizado",
            senha: "7654321"
        })

        expect(result).toBeDefined()
        expect(result.status).toEqual(404)

        expect(result.body).toBeDefined()
        expect(result.body.message).toBe("Usuario nao encontrado")
    })

    test("Deve retornar 200 quando o usuario é atualizado com sucesso", async () => {
        const sut = createApp();

        const usuarioCriado = await supertest(sut).post("/usuarios").send({
            nome: "usuario 4",
            email: "usuario4@gmail.com",
            nomeUsuario: "usuario123456",
            senha: "1234567"
        })

        const usuarioId = usuarioCriado.body.data.id

        const result = await supertest(sut).put(`/usuarios/${usuarioId}`).send({
            nome: "usuario atualizado",
            email: "usuario4_atualizado@gmail.com",
            nomeUsuario: "usuario123456_atualizado",
            senha: "7654321"
        })

        expect(result).toBeDefined()
        expect(result.status).toEqual(200)

        expect(result.body).toBeDefined()
        expect(result.body.message).toBe("Usuario atualizado com sucesso.")
        expect(result.body.data).toHaveProperty("nome", "usuario atualizado")
    })

    test("Deve retornar 404 quando o usuario não é encontrado quando delete", async () => {
        const sut = createApp()

        const usuarioId = "43e4b5ab-03a5-46a4-af5c-5be29ed2bf58"

        const result = await supertest(sut).delete(`/usuarios/${usuarioId}`).send()

        expect(result).toBeDefined()
        expect(result.status).toEqual(404)

        expect(result.body).toBeDefined()
        expect(result.body.message).toBe("Usuario não encontrado")
    })

    test("Deve retornar 200 quando o usuario é deletado com sucesso", async () => {
        const sut = createApp()

        const usuarioCriado = await supertest(sut).post("/usuarios").send({
            nome: "usuario 5",
            email: "usuario5@gmail.com",
            nomeUsuario: "usuario1234567",
            senha: "1234567"
        })

        const usuarioId = usuarioCriado.body.data.id

        const result = await supertest(sut).delete(`/usuarios/${usuarioId}`).send()

        expect(result).toBeDefined()
        expect(result.status).toEqual(200)

        expect(result.body).toBeDefined()
        expect(result.body.message).toBe("Usuario deletado com sucesso")
    })
})
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


})
import { TweetService } from "../src/services/tweet.service"
import { prismaMock } from "./config/prisma.mock"

import { Tweet } from "../src/models/tweet.model";
import { randomUUID } from 'crypto';

jest.mock('crypto', () => ({
    randomUUID: jest.fn(),
}));

describe("Testes unitarios da classe TweetService", () => {
    let sut: TweetService

    beforeEach(() => {
        sut = new TweetService()
    })

    test("Deve retornar todos os tweets", async () => {
        const tweets = [
            {
                id: "1234565",
                conteudo: "tweet 1",
                tipo: "tw",
                usuarioId: "12343654",
                createdAt: new Date(),
                uptatedAt: new Date()
            },
            {
                id: "68765345",
                conteudo: "tweet 2",
                tipo: "tw",
                usuarioId: "12343654",
                createdAt: new Date(),
                uptatedAt: new Date()
            },
            {
                id: "432543654",
                conteudo: "tweet 3",
                tipo: "tw",
                usuarioId: "12343654",
                createdAt: new Date(),
                uptatedAt: new Date()
            }
        ]

        prismaMock.tweet.findMany.mockResolvedValue(tweets)

        const result = await sut.findAll()

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "Tweets listados com sucesso")
        expect(result).toHaveProperty("data", tweets)
    })

    test("Deve retornar falha ao não encontrar o usuario quando lista os tweets", async () => {
        prismaMock.usuario.findUnique.mockResolvedValue(null)

        const result = await sut.findAllById("")

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Usuario não encontrado")
        expect(result).not.toHaveProperty("data")
    })

    test("Deve retornar sucesso ao listar tweets do usuario", async () => {
        prismaMock.usuario.findUnique.mockResolvedValue({
            id: "123456",
            nome: "usuario mockado",
            email: "usuariomockado@gmail.com",
            nomeUsuario: "UsuarioMockado123",
            senha: "12345678",
            createdAt: new Date(),
            uptatedAt: new Date(),
            token: "eyJ123456"
        })

        const tweets = [
            {
                id: "11234567",
                usuarioId: "123456",
                conteudo: "eips oups",
                tipo: "tw",
                createdAt: new Date(),
                uptatedAt: new Date()
            },
            {
                id: "11345623",
                usuarioId: "123456",
                conteudo: "eips",
                tipo: "tw",
                createdAt: new Date(),
                uptatedAt: new Date()
            }
        ]

        prismaMock.tweet.findMany.mockResolvedValue(tweets)

        const result = await sut.findAllById("123456")

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "Tweets listados com sucesso")
        expect(result).toHaveProperty("data", tweets)
    })
})
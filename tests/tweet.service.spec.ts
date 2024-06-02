import { TweetService } from "../src/services/tweet.service"
import { prismaMock } from "./config/prisma.mock"

import { Seguidor } from "./../src/models/seguidor.model"
import { randomUUID } from 'crypto';
import { Tweet } from "../src/models/tweet.model";

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

    test("Deve retornar sucesso ao listar os tweets dos seguidores", async () => {
        const mockSeguindo = [
            new Seguidor("123456", "111"),
            new Seguidor("123456", "222")
        ]

        const mockTweets = [
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

        prismaMock.seguidor.findMany.mockResolvedValue(mockSeguindo)
        prismaMock.tweet.findMany.mockResolvedValue(mockTweets)

        const result = await sut.findFollowingTweets("123456")

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "Tweets listados com sucesso")
        expect(result).toHaveProperty("data", mockTweets)
    })

    test("Deve retornar falha ao não encontrar o usuário ao criar um tweet", async () => {
        const mockTweetDTO = {
            idUsuario: "1234567890",
            conteudo: "Conteúdo do tweet",
            tipo: "tw"
        }

        prismaMock.usuario.findUnique.mockResolvedValue(null)

        const result = await sut.create(mockTweetDTO)

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Usuario nao encontrado")
    })

    test("Deve retornar sucesso ao criar um novo tweet", async () => {
        const mockTweetDTO = {
            idUsuario: "1234567890",
            conteudo: "Conteúdo do tweet",
            tipo: "tw"
        }

        const mockUsuario = {
            id: "1234567890",
            nome: "usuario mockado",
            email: "usuariomockado@gmail.com",
            nomeUsuario: "UsuarioMockado123",
            senha: "12345678",
            createdAt: new Date(),
            uptatedAt: new Date(),
            token: "eyJ123456"
        }

        const mockCreatedTweet = {
            id: "tweet1",
            usuarioId: "1234567890",
            conteudo: "Conteúdo do tweet",
            tipo: "tw",
            createdAt: new Date(),
            uptatedAt: new Date()
        }

        prismaMock.usuario.findUnique.mockResolvedValue(mockUsuario)
        prismaMock.tweet.create.mockResolvedValue(mockCreatedTweet);
        (randomUUID as jest.Mock).mockReturnValue('uuid-mockado')

        const result = await sut.create(mockTweetDTO)
        const tweet = new Tweet(
            "123456",
            "conteudo do tweet",
            "tw")

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 201)
        expect(tweet.id).toBe("uuid-mockado")
        expect(result).toHaveProperty("message", "Tweet criado com sucesso")
        expect(result).toHaveProperty("data", mockCreatedTweet)
    })

    test("Deve retornar falha ao não encontrar o usuário ao atualizar um tweet", async () => {
        const mockTweetDTO = {
            id: "tweet1",
            idUsuario: "1234567890",
            conteudo: "Novo conteúdo do tweet"
        }

        prismaMock.usuario.findUnique.mockResolvedValue(null)

        const result = await sut.update(mockTweetDTO)

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Usuario não encontrado")
        expect(result).not.toHaveProperty("data")
    })

    test("Deve retornar falha ao não encontrar o tweet ao atualizar um tweet", async () => {
        const mockTweetDTO = {
            id: "tweet1",
            idUsuario: "1234567890",
            conteudo: "Novo conteúdo do tweet"
        }

        const mockUsuario = {
            id: "1234567890",
            nome: "usuario mockado",
            email: "usuariomockado@gmail.com",
            nomeUsuario: "UsuarioMockado123",
            senha: "12345678",
            createdAt: new Date(),
            uptatedAt: new Date(),
            token: "eyJ123456"
        }

        prismaMock.usuario.findUnique.mockResolvedValue(mockUsuario)
        prismaMock.tweet.findUnique.mockResolvedValue(null)

        const result = await sut.update(mockTweetDTO)

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Tweet não encontrado")
        expect(result).not.toHaveProperty("data")
    })

    test("Deve retornar sucesso ao atualizar um tweet", async () => {
        const mockTweetDTO = {
            id: "tweet1",
            idUsuario: "1234567890",
            conteudo: "Novo conteúdo do tweet"
        }

        const mockUsuario = {
            id: "1234567890",
            nome: "usuario mockado",
            email: "usuariomockado@gmail.com",
            nomeUsuario: "UsuarioMockado123",
            senha: "12345678",
            createdAt: new Date(),
            uptatedAt: new Date(),
            token: "eyJ123456"
        }

        const mockTweet = {
            id: "tweet1",
            usuarioId: "1234567890",
            conteudo: "Conteúdo antigo do tweet",
            tipo: "tw",
            createdAt: new Date(),
            uptatedAt: new Date()
        }

        const mockUpdatedTweet = {
            ...mockTweet,
            conteudo: "Novo conteúdo do tweet"
        }

        prismaMock.usuario.findUnique.mockResolvedValue(mockUsuario)
        prismaMock.tweet.findUnique.mockResolvedValue(mockTweet)
        prismaMock.tweet.update.mockResolvedValue(mockUpdatedTweet)

        const result = await sut.update(mockTweetDTO)

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "Tweet atualizado com sucesso")
        expect(result).toHaveProperty("data", mockUpdatedTweet)
    })

    test("Deve retornar erro ao não encontrar o usuário ao excluir um tweet", async () => {
        const mockId = "tweet1"
        const mockIdUsuario = "1234567890"

        prismaMock.usuario.findUnique.mockResolvedValue(null)

        const result = await sut.delete(mockId, mockIdUsuario)

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Usuario não encontrado.")
    })

    test("Deve retornar erro ao não encontrar o tweet ao excluir um tweet", async () => {
        const mockId = "tweet1"
        const mockIdUsuario = "1234567890"

        const mockUsuario = {
            id: "1234567890",
            nome: "usuario mockado",
            email: "usuariomockado@gmail.com",
            nomeUsuario: "UsuarioMockado123",
            senha: "12345678",
            createdAt: new Date(),
            uptatedAt: new Date(),
            token: "eyJ123456"
        }

        prismaMock.usuario.findUnique.mockResolvedValue(mockUsuario)
        prismaMock.tweet.findUnique.mockResolvedValue(null)

        const result = await sut.delete(mockId, mockIdUsuario)

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Tweet não encontrado.")
    });

    test("Deve retornar sucesso ao excluir um tweet", async () => {
        const mockId = "tweet1"
        const mockIdUsuario = "1234567890"

        const mockUsuario = {
            id: "1234567890",
            nome: "usuario mockado",
            email: "usuariomockado@gmail.com",
            nomeUsuario: "UsuarioMockado123",
            senha: "12345678",
            createdAt: new Date(),
            uptatedAt: new Date(),
            token: "eyJ123456"
        }

        const mockTweet = {
            id: "tweet1",
            usuarioId: "1234567890",
            conteudo: "Conteúdo do tweet",
            tipo: "tw",
            createdAt: new Date(),
            uptatedAt: new Date()
        }

        const mockDeletedTweet = {
            ...mockTweet
        };

        prismaMock.usuario.findUnique.mockResolvedValue(mockUsuario)
        prismaMock.tweet.findUnique.mockResolvedValue(mockTweet)
        prismaMock.tweet.delete.mockResolvedValue(mockDeletedTweet)

        const result = await sut.delete(mockId, mockIdUsuario)

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "Tweet excluído com sucesso.")
        expect(result).toHaveProperty("data", mockDeletedTweet)
    })
})
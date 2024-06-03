import { ReplyService } from "../../src/services/reply.service"
import { prismaMock } from "../config/prisma.mock"

import { Reply } from "../../src/models/reply.model";
import { randomUUID } from 'crypto';

jest.mock('crypto', () => ({
    randomUUID: jest.fn(),
}));

describe("Testes UNITARIOS da classe ReplyService", () => {
    let sut: ReplyService

    beforeEach(() => {
        sut = new ReplyService()
    })

    test("Deve retornar todos os replies do usuario", async () => {
        prismaMock.reply.findMany.mockResolvedValue([{
            id: "123456",
            usuarioId: "1234567",
            tweetId: "7643218",
            conteudo: "eips",
            createdAt: new Date(),
            uptatedAt: new Date()
        }])

        const result = await sut.findAllById("1234567")

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "Replies listados com sucesso")
        expect(result).toHaveProperty("data")

    })

    test("Deve retornar falha ao nao encontrar usuario quando cria o reply", async () => {
        prismaMock.usuario.findUnique.mockResolvedValue(null)

        const result = await sut.create({
            idUsuario: "123456",
            idTweet: "123456",
            conteudo: "oups"
        })

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Usuário não encontrado")
        expect(result).not.toHaveProperty("data")
    })

    test("Deve retornar sucesso quando cria o reply", async () => {
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

        prismaMock.reply.create.mockResolvedValue({
            id: "1234567",
            usuarioId: "76542132",
            tweetId: "987654",
            conteudo: "rimps",
            createdAt: new Date(),
            uptatedAt: new Date()
        });

        (randomUUID as jest.Mock).mockReturnValue('uuid-mockado')

        const result = await sut.create({
            idUsuario: "76542132",
            idTweet: "987654",
            conteudo: "remps"
        })

        const reply = new Reply("76542132", "987654", "remps")

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 201)
        expect(result).toHaveProperty("message", "Reply criado com sucesso")
        expect(result).toHaveProperty("data")
        expect(result.data).toHaveProperty("tweetId", "987654")
        expect(result.data).toHaveProperty("usuarioId", "76542132")
        expect(result.data).toHaveProperty("id", "1234567")

        expect(reply.id).toBe("uuid-mockado")
    })

    test("Deve retornar falha ao não encontrao usuario quando update o reply", async () => {
        prismaMock.usuario.findUnique.mockResolvedValue(null)

        const result = await sut.update({
            id: "123456",
            idTweet: "4325132",
            idUsuario: "24675431",
            conteudo: "reply atualizado"
        })

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Usuario não encontrado")
        expect(result).not.toHaveProperty("data")
    })

    test("Deve retornar falha ao não encontrar tweet quando update o reply", async () => {
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

        prismaMock.tweet.findUnique.mockResolvedValue(null)

        const result = await sut.update({
            id: "9875432",
            idTweet: "24541212",
            idUsuario: "3545431",
            conteudo: "reply atualizado"
        })

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Tweet não encontrado")
        expect(result).not.toHaveProperty("data")
    })

    test("Deve retornar falha ao não encontrar reply quando update o reply", async () => {
        prismaMock.usuario.findUnique.mockResolvedValue({
            id: "1234567890",
            nome: "usuario mockado",
            email: "usuariomockado@gmail.com",
            nomeUsuario: "UsuarioMockado123",
            senha: "12345678",
            createdAt: new Date(),
            uptatedAt: new Date(),
            token: "eyJ123456"
        })

        prismaMock.tweet.findUnique.mockResolvedValue({
            id: "11234567",
            usuarioId: "1234567890",
            conteudo: "eips oups",
            tipo: "tw",
            createdAt: new Date(),
            uptatedAt: new Date()
        })

        prismaMock.reply.findUnique.mockResolvedValue(null)

        const result = await sut.update({
            id: "123456",
            idTweet: "11234567",
            idUsuario: "1234567890",
            conteudo: "reply atualizado"
        })

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Reply não encontrado")
        expect(result).not.toHaveProperty("data")
    })

    test("Deve retornar sucesso quando update o reply", async () => {
        prismaMock.usuario.findUnique.mockResolvedValue({
            id: "1234567890",
            nome: "usuario mockado",
            email: "usuariomockado@gmail.com",
            nomeUsuario: "UsuarioMockado123",
            senha: "12345678",
            createdAt: new Date(),
            uptatedAt: new Date(),
            token: "eyJ123456"
        })

        prismaMock.tweet.findUnique.mockResolvedValue({
            id: "11234567",
            usuarioId: "1234567890",
            conteudo: "eips oups",
            tipo: "tw",
            createdAt: new Date(),
            uptatedAt: new Date()
        })

        prismaMock.reply.findUnique.mockResolvedValue({
            id: "123456",
            tweetId: "11234567",
            usuarioId: "1234567890",
            conteudo: "reply antigo",
            createdAt: new Date(),
            uptatedAt: new Date()
        });

        prismaMock.reply.update.mockResolvedValue({
            id: "123456",
            tweetId: "11234567",
            usuarioId: "1234567890",
            conteudo: "reply atualizado",
            createdAt: new Date(),
            uptatedAt: new Date()
        })

        const result = await sut.update({
            id: "123456",
            idTweet: "11234567",
            idUsuario: "1234567890",
            conteudo: "reply atualizado"
        })

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "Reply atualizado com sucesso")
        expect(result).toHaveProperty("data")
        expect(result.data).toHaveProperty("conteudo", "reply atualizado")
    })

    test("Deve retornar falha ao não encontrar usuario quando delete o reply", async () => {
        prismaMock.usuario.findUnique.mockResolvedValue(null)

        const result = await sut.delete(
            "123456",
            "4325132",
            "24675431"
        )

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Usuario não encontrado")
        expect(result).not.toHaveProperty("data")
    })

    test("Deve retornar falha ao nao encontrar tweet quando delete o reply", async () => {
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

        prismaMock.tweet.findUnique.mockResolvedValue(null)

        const result = await sut.delete(
            "9875432",
            "24541212",
            "3545431"
        )

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Tweet não encontrado")
        expect(result).not.toHaveProperty("data")
    })

    test("Deve retornar falha ao não encontrar reply ao delete reply", async () => {
        prismaMock.usuario.findUnique.mockResolvedValue({
            id: "1234567890",
            nome: "usuario mockado",
            email: "usuariomockado@gmail.com",
            nomeUsuario: "UsuarioMockado123",
            senha: "12345678",
            createdAt: new Date(),
            uptatedAt: new Date(),
            token: "eyJ123456"
        })

        prismaMock.tweet.findUnique.mockResolvedValue({
            id: "11234567",
            usuarioId: "1234567890",
            conteudo: "eips oups",
            tipo: "tw",
            createdAt: new Date(),
            uptatedAt: new Date()
        })

        prismaMock.reply.findUnique.mockResolvedValue(null)

        const result = await sut.delete(
            "123456",
            "11234567",
            "1234567890",
        )

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Reply não encontrado")
        expect(result).not.toHaveProperty("data")
    })

    test("Deve retornar sucesso quando delete o reply", async () => {
        prismaMock.usuario.findUnique.mockResolvedValue({
            id: "1234567890",
            nome: "usuario mockado",
            email: "usuariomockado@gmail.com",
            nomeUsuario: "UsuarioMockado123",
            senha: "12345678",
            createdAt: new Date(),
            uptatedAt: new Date(),
            token: "eyJ123456"
        })

        prismaMock.tweet.findUnique.mockResolvedValue({
            id: "11234567",
            usuarioId: "1234567890",
            conteudo: "eips oups",
            tipo: "tw",
            createdAt: new Date(),
            uptatedAt: new Date()
        })

        prismaMock.reply.findUnique.mockResolvedValue({
            id: "123456",
            tweetId: "11234567",
            usuarioId: "1234567890",
            conteudo: "reply a deletar",
            createdAt: new Date(),
            uptatedAt: new Date()
        });

        prismaMock.reply.delete.mockResolvedValue({
            id: "123456",
            tweetId: "11234567",
            usuarioId: "1234567890",
            conteudo: "reply a deletar",
            createdAt: new Date(),
            uptatedAt: new Date()
        })

        const result = await sut.delete(
            "123456",
            "11234567",
            "1234567890"
        )

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "Reply excluído com sucesso.")
        expect(result).toHaveProperty("data")
        expect(result.data).toHaveProperty("conteudo", "reply a deletar")
    })
})
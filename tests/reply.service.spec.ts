import { ReplyService } from "../src/services/reply.service"
import { prismaMock } from "./config/prisma.mock"

import { Reply } from "../src/models/reply.model";
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

    test("Deve retornar falha ao nao encontrar quando cria o reply", async () => {
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
        });

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
            idUsuario:"76542132",
            idTweet:"987654",
            conteudo:"remps"
        })

        const reply = new Reply("76542132","987654","remps")

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
})
import { LikeService } from "../src/services/like.service"
import { prismaMock } from "./config/prisma.mock"

import { Like } from '../src/models/like.model';
import { randomUUID } from 'crypto';

jest.mock('crypto', () => ({
    randomUUID: jest.fn(),
}));

describe("Testes UNITARIOS da classe LikeService", () => {
    let sut: LikeService

    beforeEach(() => {
        // 1 - sut(instancia do que quero testar)
        // cria uma nova antes de cada teste
        sut = new LikeService()
    })

    test("Deve retornar todos os likes", async () => {
        prismaMock.like.findMany.mockResolvedValue([{
            id: "12345",
            usuarioId: "123456",
            tweetId: "654321",
            createdAt: new Date(),
            uptatedAt: new Date()
        }])

        const result = await sut.findAll("123456")

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "Likes listados com sucesso")
        expect(result).toHaveProperty("data")
    })

    test("Deve retornar falha ao não encontrar o usuario ao criar o like", async () => {

        prismaMock.usuario.findUnique.mockResolvedValue(null)

        const result = await sut.create({
            idUsuario: "123456",
            idTweet: "654321"
        })

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Usuario não encontrado")
        expect(result).not.toHaveProperty("data")
    })

    test("Deve retornar sucesso quando cria o like", async () => {
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

        prismaMock.like.create.mockResolvedValue({
            id: "likeID",
            tweetId: "1234567",
            usuarioId: "9876543",
            createdAt: new Date(),
            uptatedAt: new Date()
        });

        (randomUUID as jest.Mock).mockReturnValue('uuid-mockado')

        const result = await sut.create({
            idUsuario: "123456",
            idTweet: "1234567"
        })
        
        const like = new Like("123456", "1234567")

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 201)
        expect(result).toHaveProperty("message", "Like criado com sucesso")
        expect(result).toHaveProperty("data")
        expect(result.data).toHaveProperty("tweetId", "1234567")
        expect(result.data).toHaveProperty("usuarioId", "9876543")
        expect(result.data).toHaveProperty("id", "likeID")

        expect(like.id).toBe('uuid-mockado')
    })

    test("Deve retornar falha quando o usuario não for encontrado ao deletar o like", async () => {
        prismaMock.usuario.findUnique.mockResolvedValue(null)

        const result = await sut.delete("123456", "12343564")

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Usuario não encontrado")
        expect(result).not.toHaveProperty("data")
    })

    test("Deve retornar sucesso ao deletar o like", async () => {
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

        prismaMock.like.delete.mockResolvedValue({
            id: "likeID",
            tweetId: "1234567",
            usuarioId: "9876543",
            createdAt: new Date(),
            uptatedAt: new Date()
        })

        const result = await sut.delete("1234567","9876543")

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "like excluído com sucesso.")
        expect(result).toHaveProperty("data")
        expect(result.data).toHaveProperty("tweetId", "1234567")
        expect(result.data).toHaveProperty("usuarioId", "9876543")
    })
})
import { SeguidorService } from "../src/services/seguidor.service"
import { prismaMock } from "./config/prisma.mock"

import { Seguidor } from "../src/models/seguidor.model";
import { randomUUID } from 'crypto';

jest.mock('crypto', () => ({
    randomUUID: jest.fn(),
}));

describe("Testes unitarios da classe SeguidorService", () => {
    let sut: SeguidorService

    beforeEach(() => {
        sut = new SeguidorService()
    })

    test("Deve retornar sucesso quando listar os seguidores do usuario", async () => {
        const mockSeguidores = [
            {
                id: "1",
                usuarioId: "123456",
                seguidorId: "654321",
                seguidor: {
                    id: "654321",
                    nome: "Mock Seguidor",
                    email: "mockseguidor@gmail.com",
                    nomeUsuario: "MockSeguidor123",
                    createdAt: new Date(),
                    uptatedAt: new Date()
                },
                createdAt: new Date(),
                uptatedAt: new Date()
            }
        ]

        prismaMock.seguidor.findMany.mockResolvedValue(mockSeguidores)

        const result = await sut.findAllById("123456")

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "Seguidores listados com sucesso")
        expect(result).toHaveProperty("data", mockSeguidores)
    })

    test("Deve retornar falha quando os campos idUsuario ou idUsuarioSeguindo são inválidos", async () => {
        const invalidSeguidorDTO = {
            idUsuario: "",
            idUsuarioSeguindo: ""
        }
    
        const result = await sut.create(invalidSeguidorDTO)
    
        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 400)
        expect(result).toHaveProperty("message", "Campos idUsuario e idUsuarioSeguindo são obrigatórios")
        expect(result).not.toHaveProperty("data")
    })

    test("Deve retornar sucesso ao criar um novo seguidor", async () => {
        const mockSeguidorDTO = {
            idUsuario: "1234567890",
            idUsuarioSeguindo: "0987654321"
        }

        const mockCreatedSeguidor = {
            id: "1",
            usuarioId: "1234567890",
            seguidorId: "0987654321",
            createdAt: new Date(),
            uptatedAt: new Date()
        }

        prismaMock.seguidor.create.mockResolvedValue(mockCreatedSeguidor);

        (randomUUID as jest.Mock).mockReturnValue('uuid-mockado')
        const seguidor = new Seguidor("1234567","9876543")

        const result = await sut.create(mockSeguidorDTO)

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 201)
        expect(result).toHaveProperty("message", "Seguidor criado com sucesso")
        expect(result).toHaveProperty("data", mockCreatedSeguidor)
        expect(seguidor.id).toBe("uuid-mockado")
    })

    test("Deve retornar falha ao não encontrar relação entre seguidor e usuario", async ()=>{
        prismaMock.seguidor.findUnique.mockResolvedValue(null)

        const result = await sut.delete("1234567890", "0987654321")

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Relação seguidor/seguido não encontrada")
    })

    test("Deve retornar sucesso ao excluir o seguidor", async () => {
        const mockRelation = {
            usuarioId: "1234567890",
            seguidorId: "0987654321"
        }
    
        prismaMock.seguidor.findUnique.mockResolvedValue(mockRelation)
    
        prismaMock.seguidor.delete.mockResolvedValue(mockRelation)
    
        const result = await sut.delete("1234567890", "0987654321")
    
        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "Seguidor excluído com sucesso")
    })
    
})

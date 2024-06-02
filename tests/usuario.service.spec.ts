import { UsuarioService } from "../src/services/usuario.service"
import { prismaMock } from "./config/prisma.mock"

import { Usuario } from "./../src/models/usuario.model"
import { randomUUID } from 'crypto';

jest.mock('crypto', () => ({
    randomUUID: jest.fn(),
}));

describe("Testes unitarios da classe UsuarioService", () => {
    let sut: UsuarioService

    beforeEach(() => {
        sut = new UsuarioService()
    })

    test("Deve retornar todos os usuarios", async () => {
        const usuarios = [
            {
                id: "123456",
                nome: "Usuario mockado 1",
                nomeUsuario: "UserMock12334",
                email: "mockuser1@gmail.com",
                senha: "12345545436",
                createdAt: new Date(),
                uptatedAt: new Date(),
                token: "12343567576523"
            },
            {
                id: "123456",
                nome: "Usuario mockado 2",
                nomeUsuario: "UserMock123",
                email: "mockuser2@gmail.com",
                senha: "1234556",
                createdAt: new Date(),
                uptatedAt: new Date(),
                token: "123443322567"
            }
        ]

        prismaMock.usuario.findMany.mockResolvedValue(usuarios)

        const result = await sut.findAll()

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "Usuarios listados com sucesso")
        expect(result).toHaveProperty("data", usuarios)
    })

    test("Deve retornar sucesso ao criar um novo usuário", async () => {
        const mockUsuarioDTO = {
            nome: "Nome Mockado",
            email: "email@mockado.com",
            nomeUsuario: "Mockado123",
            senha: "34254311"
        }

        const mockCreatedUsuario = {
            id: "1",
            nome: "Nome Mockado",
            email: "email@mockado.com",
            nomeUsuario: "Mockado123",
            senha: "34254311",
            createdAt: new Date(),
            uptatedAt: new Date(),
            token: "123456"
        }

        prismaMock.usuario.create.mockResolvedValue(mockCreatedUsuario);

        (randomUUID as jest.Mock).mockReturnValue('uuid-mockado')
        const usuario = new Usuario(
            "Nome Mockado",
            "email@mockado.com",
            "Mockado123",
            "34254311"
        )

        const result = await sut.create(mockUsuarioDTO)

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 201)
        expect(result).toHaveProperty("message", "Usuario criado com sucesso")
        expect(result).toHaveProperty("data", mockCreatedUsuario)
        expect(usuario.id).toBe("uuid-mockado")
        expect(usuario.nome).toBe(mockUsuarioDTO.nome)
        expect(usuario.email).toBe(mockUsuarioDTO.email)
        expect(usuario.nomeUsuario).toBe(mockUsuarioDTO.nomeUsuario)
        expect(usuario.senha).toBe(mockUsuarioDTO.senha)
    })

    test("Deve retornar erro quando o usuário não é encontrado", async () => {
        prismaMock.usuario.findUnique.mockResolvedValue(null)

        const result = await sut.findById("1")

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Usuario não encontrado")
        expect(result).not.toHaveProperty("data")
    })

    test("Deve retornar sucesso quando o usuário é encontrado", async () => {
        const mockUsuario = {
            id: "157653234",
            nome: "Nome Mockado",
            email: "email@mockado.com",
            nomeUsuario: "Mockado123",
            senha: "6546786534",
            createdAt: new Date(),
            uptatedAt: new Date(),
            token: "123345654"
        }

        prismaMock.usuario.findUnique.mockResolvedValue(mockUsuario)

        const result = await sut.findById("157653234")

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", "Usuario encontrado")
        expect(result).toHaveProperty("data", mockUsuario)
    })

    test("Deve lançar um erro quando o usuário não é encontrado", async () => {
        const mockUsuarioDTO = {
            id: "1",
            nome: "Nome Atualizado",
            email: "email.atualizado@mockado.com",
            nomeUsuario: "MockadoAtualizado123",
            senha: "senhaAtualizada123"
        }

        prismaMock.usuario.findUnique.mockResolvedValue(null)

        const result = await sut.update(mockUsuarioDTO)

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", "Usuario nao encontrado")
        expect(result).not.toHaveProperty("data")
    })

    test("Deve atualizar um usuário com sucesso", async () => {
        const mockUsuarioDTO = {
            id: "1",
            nome: "Nome Atualizado",
            email: "email.atualizado@mockado.com",
            nomeUsuario: "MockadoAtualizado123",
            senha: "senhaAtualizada123"
        }

        const mockUsuario = {
            id: "1",
            nome: "Nome Antigo",
            email: "email@mockado.com",
            nomeUsuario: "Mockado123",
            senha: "senha123",
            createdAt: new Date(),
            uptatedAt: new Date(),
            token: "mockedToken"
        }

        const mockUpdatedUsuario = {
            ...mockUsuario,
            nome: mockUsuarioDTO.nome,
            email: mockUsuarioDTO.email,
            nomeUsuario: mockUsuarioDTO.nomeUsuario,
            senha: mockUsuarioDTO.senha,
            uptatedAt: new Date()
        }

        prismaMock.usuario.findUnique.mockResolvedValue(mockUsuario)
        prismaMock.usuario.update.mockResolvedValue(mockUpdatedUsuario)

        const result = await sut.update(mockUsuarioDTO)

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", 'Usuario atualizado com sucesso.')
        expect(result).toHaveProperty("data", mockUpdatedUsuario)
    })

    test('Deve retornar sucesso ao deletar um usuário existente', async () => {
        prismaMock.usuario.findUnique.mockResolvedValueOnce({
            id: '1',
            nome: 'Usuário Teste',
            email: 'usuario@teste.com',
            nomeUsuario: 'usuario_teste',
            senha: 'senha',
            createdAt: new Date(),
            uptatedAt: new Date(),
            token: "1234567"
        })

        const result = await sut.delete('1');

        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", true)
        expect(result).toHaveProperty("code", 200)
        expect(result).toHaveProperty("message", 'Usuario deletado com sucesso')
        expect(result).toHaveProperty("data")
    })

    test('Deve retornar falha ao deletar um usuário inexistente', async () => {
        prismaMock.usuario.findUnique.mockResolvedValueOnce(null)
    
        const result = await sut.delete('1')
    
        expect(result).toBeDefined()
        expect(result).toHaveProperty("success", false)
        expect(result).toHaveProperty("code", 404)
        expect(result).toHaveProperty("message", 'Usuario não encontrado')
        expect(result).not.toHaveProperty("data")
    })
})
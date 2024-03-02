import { repository } from "../database/prisma.connection"
import { ResponseDTO } from "../dtos/response.dto"
import { CreateUsuarioDTO, UpdateUsuarioDTO } from "../dtos/usuario.dto"
import { Usuario } from "../models/usuario.model"

export class UsuarioService {

    public async findAll(): Promise<ResponseDTO> {
        const students = await repository.seguidor.findMany()

        return {
            success: true,
            code: 200,
            message: 'Alunos listados com sucesso',
            data: students
        }
    }

    public async create(usuarioDTO: CreateUsuarioDTO): Promise<ResponseDTO> {
        const novoUsuario = new Usuario(
            usuarioDTO.nome,
            usuarioDTO.email,
            usuarioDTO.nomeUsuario,
            usuarioDTO.senha
        )

        const createdUsuario = await repository.usuario.create({
            data: {
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                nomeUsuario: novoUsuario.nomeUsuario,
                senha: novoUsuario.senha
            }
        })
        return {
            success: true,
            code: 201,
            message: "Usuario criado com sucesso",
            data: createdUsuario
        }
    }

    public async findById(id: string): Promise<ResponseDTO> {

        const usuario = await repository.usuario.findUnique({
            where: { id }
        })

        if (!usuario) {
            throw new Error("Usuario não encontrado")
        }

        return {
            success: true,
            code: 200,
            message: "Usuario encontrado",
            data: usuario
        }
    }

    public async update(usuarioDTO: UpdateUsuarioDTO): Promise<ResponseDTO> {
        const usuario = await repository.usuario.findUnique({
            where: {
                id: usuarioDTO.id
            }
        })

        if (!usuario) {
            throw new Error("Usuario não encontrado")
        }

        const updatedUsuario = await repository.usuario.update({
            where: {
                id: usuarioDTO.id
            },
            data: {
                nome: usuarioDTO.nome,
                email: usuarioDTO.email,
                nomeUsuario: usuarioDTO.nomeUsuario,
                senha: usuarioDTO.senha
            }
        })

        return {
            success: true,
            code: 200,
            message: 'Usuario atualizado com sucesso.',
            data: updatedUsuario
        }
    }

    public async delete(id: string): Promise<ResponseDTO> {
        const usuario = await repository.usuario.findUnique({
            where: {
                id
            }
        })

        if (!usuario) {
            throw new Error("Usuario não encontrado")
        }

        const deletedUsuario = await repository.usuario.delete({
            where: {
                id
            }
        })

        return {
            success: true,
            code: 200,
            message: 'Usuario deletado com sucesso',
            data: deletedUsuario
        }
    }
}
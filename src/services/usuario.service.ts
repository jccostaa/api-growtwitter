import { repository } from "../database/prisma.connection"
import { ResponseDTO } from "../dtos/response.dto"
import { CreateUsuarioDTO } from "../dtos/usuario.dto"
import { Usuario } from "../models/usuario.model"

export class UsuarioService{

    public async findAll():Promise<ResponseDTO>{
        const students = await repository.seguidor.findMany()

        return {
            success: true,
            code: 200,
            message: 'Alunos listados com sucesso',
            data: students
        }
    }

    public async create(usuarioDTO: CreateUsuarioDTO):Promise<ResponseDTO>{
        const novoUsuario = new Usuario(
            usuarioDTO.nome,
            usuarioDTO.email,
            usuarioDTO.nomeUsuario,
            usuarioDTO.senha
        )

        const createdUsuario = await repository.usuario.create({
            data:{
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                nomeUsuario: novoUsuario.nomeUsuario,
                senha: novoUsuario.senha
            }
        })
        return {
            success:true,
            code:201,
            message: "Usuario criado com sucesso",
            data: createdUsuario
        }
    }

}
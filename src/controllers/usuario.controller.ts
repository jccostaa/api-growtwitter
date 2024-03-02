import { Request, Response } from "express"
import { UsuarioService } from "../services/usuario.service"
import { CreateUsuarioDTO } from "../dtos/usuario.dto"

const usuarioService = new UsuarioService()

export class UsuarioController {

    //listar todos usuarios
    public async index(response: Response) {
        try {

            const usuarios = await usuarioService.findAll()

            return response.status(200).json(usuarios)
        } catch (error) {
            return response.status(500).json({
                success: false,
                code: 500,
                message: 'Erro ao listar usuarios'
            })
        }
    }

    //criar usuario
    public async store(request: Request, response: Response) {
        try {
            const { nome, email, nomeUsuario, senha } = request.body

            if (!nome || !email || !nomeUsuario || !senha) {
                return response.status(400).json({
                    success: false,
                    code: response.statusCode,
                    message: "Preencha os campos obrigatorios"
                })
            }

            const usuario: CreateUsuarioDTO = { nome, email, nomeUsuario, senha }

            const resultado = await usuarioService.create(usuario)

            return response.status(resultado.code).json(resultado)

        } catch (error) {
            console.log(error)
            return response.status(500).json({
                success: false,
                code: response.statusCode,
                message: 'Erro ao criar usuário',
            })
        }
    }
}
import { Request, Response } from "express";
import { LikeService } from "../services/like.service";
import { Like } from "../models/like.model";
import { CreateLikeDTO } from "../dtos/like.dto";

const likeService = new LikeService()

export class LikeController {
    public async index(request: Request, response: Response) {
        try {
            const { idUsuario } = request.params

            const likes = await likeService.findAll(idUsuario)

            return response.status(200).json(likes)
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                code: response.statusCode,
                message: 'Erro ao listar likes'
            })
        }
    }

    public async store(request: Request, response: Response) {
        try {
            const { usuarioId, tweetId } = request.body

            const like: CreateLikeDTO = { usuarioId, tweetId }

            const resultado = await likeService.create(like)

            return response.status(resultado.code).json(resultado)
        } catch (error) {
            return response.status(500).json({
                success: false,
                code: response.statusCode,
                message: "Erro ao criar like"
            })
        }
    }

    public async delete(request: Request, response: Response) {
        try {
            const {id, usuarioId} = request.params

            const resultado = await likeService.delete(id, usuarioId)

            return response.status(resultado.code).json(resultado)
        } catch (error) {
            return response.status(500).json({
                success: false,
                code: response.statusCode,
                message: "Erro ao deletar like."
            })
        }
    }
}
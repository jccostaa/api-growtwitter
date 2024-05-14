import { Request, Response } from "express";
import { ReplyService } from "../services/reply.service";

const replyService = new ReplyService()

export class ReplyController{

    public async index(request:Request, response:Response){
        try{
            const {idUsuario} = request.params

            const replies = await replyService.findAllById(idUsuario)

            return response.status(200).json(replies)
        }catch(error){
            return response.status(500).json({
                success: false,
                code: 500,
                message: 'Erro ao listar replies do usuario'
            })
        }
    }
}
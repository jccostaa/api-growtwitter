import { Request, Response } from "express";
import { ReplyService } from "../services/reply.service";
import { ReplyTweetDTO } from "../dtos/tweet.dto";

const replyService = new ReplyService();

export class ReplyController {

    public async index(request: Request, response: Response) {
        try {
            const { idUsuario } = request.params;
            const replies = await replyService.findAllById(idUsuario);
            return response.status(200).json(replies);
        } catch (error: any) {
            return response.status(500).json({
                success: false,
                code: 500,
                message: 'Erro ao listar replies do usuário'
            });
        }
    }

    public async store(request: Request, response: Response) {
        try {
            const { idUsuario, idTweet } = request.params;
            const { conteudo } = request.body;

            const retweet: ReplyTweetDTO = { conteudo, idUsuario, idTweet };
            const resultado = await replyService.create(retweet);

            return response.status(resultado.code).json(resultado);
        } catch (error: any) {
            return response.status(500).json({
                success: false,
                code: response.statusCode,
                message: "Erro ao criar reply"
            });
        }
    }
}

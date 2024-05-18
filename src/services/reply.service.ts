import { repository } from "../database/prisma.connection";
import { ResponseDTO } from "../dtos/response.dto";
import { ReplyTweetDTO } from "../dtos/tweet.dto";
import { Reply } from "../models/reply.model";

export class ReplyService {
    
    public async findAllById(idUsuario: string): Promise<ResponseDTO> {
        const replies = await repository.reply.findMany({
            where: {
                usuarioId: idUsuario
            }
        });

        return {
            success: true,
            code: 200,
            message: "Replies listados com sucesso",
            data: replies
        };
    }

    public async create(tweetDTO: ReplyTweetDTO): Promise<ResponseDTO> {
        const usuario = await repository.usuario.findUnique({
            where: {
                id: tweetDTO.idUsuario
            }
        });

        if (!usuario) {
            return {
                success: false,
                code: 404,
                message: "Usuário não encontrado"
            };
        }

        const novoReply = new Reply(
            tweetDTO.idUsuario,
            tweetDTO.idTweet,
            tweetDTO.conteudo
        )

        const createdReply = await repository.reply.create({
            data: {
                conteudo: novoReply.conteudo,
                tweetId: novoReply.tweetId,
                usuarioId: novoReply.usuarioId
            }
        });

        return {
            success: true,
            code: 201,
            message: "Reply criado com sucesso",
            data: createdReply
        };
    }


}

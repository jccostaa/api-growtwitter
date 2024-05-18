import { repository } from "../database/prisma.connection";
import { ResponseDTO } from "../dtos/response.dto";
import { ReplyTweetDTO, UpdateReplyDTO } from "../dtos/tweet.dto";
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

    public async update(tweetDTO: UpdateReplyDTO){
        const usuario = await repository.usuario.findUnique({
            where:{
                id:tweetDTO.idUsuario
            }
        })
        if (!usuario) {
            throw new Error("Usuario não encontrado")
        }

        const tweet = await repository.tweet.findUnique({
            where:{
                id:tweetDTO.idTweet
            }
        })
        if (!tweet) {
            throw new Error("Tweet não encontrada")
        }

        const reply = await repository.reply.findUnique({
            where:{
                id:tweetDTO.id
            }
        })
        if (!reply) {
            throw new Error("Tweet não encontrada")
        }

        const resultado = await repository.reply.update({
            where:{
                id:tweetDTO.id
            },
            data:{
                conteudo:tweetDTO.conteudo
            }
        })

        return {
            success: true,
            code: 200,
            message: "Reply atualizado com sucesso",
            data: resultado
        }
    }
}

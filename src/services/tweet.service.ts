import { repository } from "../database/prisma.connection";
import { ResponseDTO } from "../dtos/response.dto";
import { CreateTweetDTO, UpdateTweetDTO } from "../dtos/tweet.dto";
import { Tweet } from "../models/tweet.model";

export class TweetService {

    public async findAll(idUsuario: string): Promise<ResponseDTO>{

        
        const allTweets = await repository.tweet.findMany()

        return {
            success: true,
            code: 200,
            message: "Tweets listados com sucesso",
            data: allTweets
        }
    }

    public async findAllById(idUsuario: string): Promise<ResponseDTO> {
        const tweets = await repository.tweet.findMany({
            where: {
                usuarioId: idUsuario
            }
        })

        return {
            success: true,
            code: 200,
            message: "Tweets listados com sucesso",
            data: tweets
        }
    }

    public async create(tweetDTO: CreateTweetDTO): Promise<ResponseDTO> {
        const usuario = await repository.usuario.findUnique({
            where: {
                id: tweetDTO.idUsuario
            }
        })

        if (!usuario) {
            throw new Error("Usuario não encontrado").cause
        }

        const novoTweet = new Tweet(
            tweetDTO.idUsuario,
            tweetDTO.conteudo,
            tweetDTO.tipo
        )

        const createdTweet = await repository.tweet.create({
            data: {
                conteudo: novoTweet.conteudo,
                tipo: novoTweet.tipo,
                usuarioId: novoTweet.usuarioId
            }
        })
        return {
            success: true,
            code: 201,
            message: "Tweet criado com sucesso",
            data: createdTweet
        }
    }

    public async update(tweetDTO: UpdateTweetDTO): Promise<ResponseDTO> {
        const usuario = await repository.usuario.findUnique({
            where: {
                id: tweetDTO.idUsuario
            }
        })

        if (!usuario) {
            throw new Error("Usuario não encontrado")
        }

        const tweet = await repository.tweet.findUnique({
            where: {
                id: tweetDTO.id
            }
        })
        if (!tweet) {
            throw new Error("Tweet não encontrada")
        }

        const resultado = await repository.tweet.update({
            where: {
                id: tweetDTO.id
            },
            data: {
                conteudo: tweetDTO.conteudo
            }
        })

        return {
            success: true,
            code: 200,
            message: "Tweet atualizado com sucesso",
            data: resultado
        }
    }

    public async delete(id: string, idUsuario: string): Promise<ResponseDTO> {
        const usuario = await repository.usuario.findUnique({
            where: {
                id: idUsuario
            }
        })

        if (!usuario) {
            throw new Error("Usuario não encontrado.")
        }

        const tweet = await repository.tweet.findUnique({
            where: {
                id
            }
        })

        if (!tweet) {
            throw new Error("Tweet não encontrado.")
        }

        const resultado = await repository.tweet.delete({
            where:{
                id
            }
        })

        return {
            success: true,
            code: 200,
            message: "Tweet excluído com sucesso.",
            data: resultado
          }
    }
}
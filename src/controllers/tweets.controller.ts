import { Request, Response } from "express";
import { TweetService } from "../services/tweet.service";
import { CreateTweetDTO } from "../dtos/tweet.dto";


const tweetService = new TweetService()

export class TweetController {

    //listagem de tweets
    public async index(request: Request, response: Response) {
        try {
            const { idUsuario } = request.params

            const tweets = await tweetService.findAll(idUsuario)

            return response.status(200).json(tweets)
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                code: response.statusCode,
                message: 'Erro ao listar tweets'
            })
        }
    }

    //criar um novo tweet
    public async store(request: Request, response: Response) {
        try {
            const { idUsuario } = request.params
            const { conteudo, tipo } = request.body

            if (!conteudo || !tipo) {
                return response.status(400).json({
                    success: false,
                    code: response.statusCode,
                    message: "Preencha os campos obrigatorios"
                })
            }

            const tweet: CreateTweetDTO = { conteudo, tipo, idUsuario }

            const resultado = await tweetService.create(tweet)

            return response.status(resultado.code).json(resultado)
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                code: response.statusCode,
                message: "Erro ao criar tweet"
            })
        }
    }

    public async update(request: Request, response: Response) {
        try {

            const { id, usuarioId } = request.params
            const { conteudo } = request.body

            if (!conteudo) {
                return response.status(400).json({
                    success: false,
                    code: response.statusCode,
                    message: "Preencha os campos obrigatorios"
                })
            }

            const resultado = await tweetService.update({
                id,
                usuarioId,
                conteudo
            })

        }
        catch (error) {
            return response.status(500).json({
                success: false,
                code: response.statusCode,
                message: "Erro ao atualizar tweet"
            })
        }
    }
}



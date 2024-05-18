import { Request, Response } from "express";
import { TweetService } from "../services/tweet.service";
import { CreateTweetDTO } from "../dtos/tweet.dto";


const tweetService = new TweetService()

export class TweetController {

    //listagem de tweets
    public async index(request: Request, response: Response) {
        try {
            const { idUsuario } = request.params

            const tweets = await tweetService.findAllById(idUsuario)

            return response.status(200).json(tweets)
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                code: 500,
                message: 'Erro ao listar tweets do usuario'
            })
        }
    }

    //listagem de todos
    public async indexAll(response: Response) {
        try {
            const AllTweets = await tweetService.findAll()

            return response.status(200).json(AllTweets)
        } catch (error) {
            return response.status(500).json({
                success: false,
                code: 500,
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

    //atualizar um tweet
    public async update(request: Request, response: Response) {
        try {

            const { id, idUsuario } = request.params
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
                idUsuario,
                conteudo
            })

            return response.status(200).json(resultado)

        }
        catch (error:any) {
            console.log(error)
            return response.status(500).json({
                success: false,
                code: response.statusCode,
                message: "Erro ao atualizar tweet"
            })
        }
    }

    //deletar um tweet
    public async delete(request: Request, response: Response) {
        try {
            const { id, idUsuario } = request.params

            const resultado = await tweetService.delete(id, idUsuario)

            return response.status(resultado.code).json(resultado)
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                code: response.statusCode,
                message: "Erro ao deletar tweet."
            })
        }
    }
}




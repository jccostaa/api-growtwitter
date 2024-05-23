import { repository } from "../database/prisma.connection";
import { CreateLikeDTO } from "../dtos/like.dto";
import { ResponseDTO } from "../dtos/response.dto";
import { Like } from "../models/like.model";

export class LikeService{

    public async findAll(idUsuario:string): Promise<ResponseDTO> {
        const likes = await repository.like.findMany({
            where:{
                usuarioId: idUsuario
            }
        })

        return {
            success: true,
            code: 200,
            message: "Likes listados com sucesso",
            data: likes
        }
    }

    public async create(likeDTO: CreateLikeDTO): Promise<ResponseDTO> {
        const usuario = await repository.usuario.findUnique({
            where:{
                id: likeDTO.idUsuario
            }
        })
    
        if (!usuario) {
            throw new Error("Usuario não encontrado").cause
        }
    
        const like = new Like(
            likeDTO.idUsuario,
            likeDTO.idTweet
        )
        
        const createdLike = await repository.like.create({
            data:{
                usuarioId: like.idUsuario,
                tweetId: like.idTweet
            }
        })
    
        return {
            success: true,
            code: 201,
            message: "Like criado com sucesso",
            data: createdLike
        }
    }
    

    public async delete(id:string, usuarioId:string): Promise<ResponseDTO> {
        const usuario = await repository.usuario.findUnique({
            where:{
                id:usuarioId
            }
        })
        if (!usuario) {
            return {
                success: false,
                code: 404,
                message: "Usuario não encontrado"
              }
        }

        const resultado = await repository.like.delete({
            where:{
                id
            }
        })

        return {
            success: true,
            code: 200,
            message: "like excluído com sucesso.",
            data: resultado
          }
    }
}
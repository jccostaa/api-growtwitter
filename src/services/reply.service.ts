import { repository } from "../database/prisma.connection";
import { ResponseDTO } from "../dtos/response.dto";

export class ReplyService{

    public async findAllById(idUsuario:string): Promise<ResponseDTO>{
        const replies = await repository.reply.findMany({
            where:{
                usuarioId: idUsuario
            }
        })

        return {
            success: true,
            code: 200,
            message: "Replies listados com sucesso",
            data: replies
        }
    }
}
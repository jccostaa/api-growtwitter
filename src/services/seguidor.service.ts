import { repository } from "../database/prisma.connection";
import { ResponseDTO } from "../dtos/response.dto";
import { CreateSeguidorDTO } from "../dtos/seguidorDTO";
import { Seguidor } from "../models/seguidor.model";

export class SeguidorService{

    public async findAllById(id:string): Promise<ResponseDTO> {
        const seguidores = await repository.seguidor.findMany({
            where:{
                usuarioId:id
            }
        })

        return {
            success: true,
            code: 200,
            message: 'Seguidores listados com sucesso',
            data: seguidores
        }
    }

    public async create(seguidorDTO:CreateSeguidorDTO){
        const novoSeguidor = new Seguidor(
            seguidorDTO.idUsuario,
            seguidorDTO.idUsuarioSeguir
        )

        const createdSeguidor = await repository.seguidor.create({
            data:{
                usuarioId:novoSeguidor.usuarioId,
                seguidorId:novoSeguidor.seguidorId
            }
        })
        return {
            success: true,
            code: 201,
            message: "Seguidor criado com sucesso",
            data: createdSeguidor
        }
    }
}
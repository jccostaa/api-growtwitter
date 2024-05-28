import repository from "../database/prisma.connection";
import { ResponseDTO } from "../dtos/response.dto";
import { CreateSeguidorDTO } from "../dtos/seguidorDTO";
import { Seguidor } from "../models/seguidor.model";

export class SeguidorService{

    public async findAllById(id:string): Promise<ResponseDTO> {
        const seguidores = await repository.seguidor.findMany({
            where:{
                usuarioId:id
            },
            include: {
                seguidor: true
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
            seguidorDTO.idUsuarioSeguindo
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

    public async delete(idUsuario: string, idSeguidor: string): Promise<ResponseDTO> {

        const relation = await repository.seguidor.findUnique({
            where: {
                usuarioId_seguidorId: {
                    usuarioId: idUsuario,
                    seguidorId: idSeguidor
                }
            }
        });

        if (!relation) {
            return {
                success: false,
                code: 404,
                message: "Relação seguidor/seguido não encontrada"
            };
        }

        await repository.seguidor.delete({
            where: {
                usuarioId_seguidorId: {
                    usuarioId: idUsuario,
                    seguidorId: idSeguidor
                }
            }
        });

        return {
            success: true,
            code: 200,
            message: "Seguidor excluído com sucesso"
        };
    }
}
import { Request, Response } from "express";
import { SeguidorService } from "../services/seguidor.service";
import { CreateSeguidorDTO } from "../dtos/seguidorDTO";

const seguidorService = new SeguidorService()
export class SeguidorController{

    public async index(request:Request, response:Response){
        try{
            const {idUsuario} = request.params

            const seguidores = await seguidorService.findAllById(idUsuario)

            return response.status(200).json(seguidores)
        }catch(error){
            return response.status(500).json({
                success: false,
                code: 500,
                message: 'Erro ao listar Seguidores'
            })
        }
    }

    public async store(request:Request, response:Response){
        try{
            const {idUsuario} = request.params
            const {idUsuarioSeguindo} = request.body

            if(!idUsuarioSeguindo){
                return response.status(400).json({
                    success: false,
                    code: response.statusCode,
                    message: "Preencha os campos obrigatorios"
                })
            }

            const seguidor:CreateSeguidorDTO = {idUsuario, idUsuarioSeguindo}

            const resultado = await seguidorService.create(seguidor)

            return response.status(201).json(resultado)
        }catch(error){
            return response.status(500).json({
                success: false,
                code: response.statusCode,
                message: "Erro ao criar Seguidor"
            })
        }
    }

    public async delete(request: Request, response: Response) {
        try {
            const { idUsuario, idSeguidor } = request.params;

            const resultado = await seguidorService.delete(idUsuario, idSeguidor);

            return response.status(resultado.code).json(resultado);
        } catch (error: any) {
            console.log(error.toString());
            return response.status(500).json({
                success: false,
                code: 500,
                message: "Erro ao excluir seguidor"
            });
        }
    }
}
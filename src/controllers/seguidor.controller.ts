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
            const {idUsuarioSeguir} = request.body

            if(!idUsuarioSeguir){
                return response.status(400).json({
                    success: false,
                    code: response.statusCode,
                    message: "Preencha os campos obrigatorios"
                })
            }

            const seguidor:CreateSeguidorDTO = {idUsuario, idUsuarioSeguir}

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
}
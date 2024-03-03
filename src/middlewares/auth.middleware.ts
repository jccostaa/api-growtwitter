import { NextFunction, Request, Response } from "express";
import { repository } from "../database/prisma.connection";

export async function validateToken(request: Request, response: Response, next: NextFunction) {
    try {

        const { authorization } = request.headers
        const { idUsuario } = request.params

        if (!authorization) {
            response.status(401).json({
                success: false,
                code: response.statusCode,
                message: "Token não informado"
            })
        }

        const usuario = await repository.usuario.findUnique({
            where: {
                id: idUsuario
            }
        })

        if (!usuario || usuario.token !== authorization) {
            return response.status(401).json({
                success: false,
                code: response.statusCode,
                message: "Token invalido"
            })
        }

        next();
    } catch (error) {
        response.status(500).json({
            success: false,
            code: response.statusCode,
            message: "Erro"
        })
    }
}
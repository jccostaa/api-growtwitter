import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService()

export async function validateToken(request: Request, response: Response, next: NextFunction) {
    try {

        const { authorization } = request.headers
        const { idUsuario } = request.params

        if (!authorization) {
            return response.status(401).json({
                success: false,
                code: 401,
                message: "Token não informado"
            })
        }

        const result = await authService.validateLogin(authorization, idUsuario)

        if(!result.success){
            return response.status(result.code).json(result)
        }

        next();
    } catch (error:any) {
        return response.status(500).json({
            success: false,
            code: response.statusCode,
            message: error.toString()
        })
    }
}
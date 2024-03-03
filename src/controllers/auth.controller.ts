import { Request, Response } from "express"
import { AuthService } from "../services/auth.service"

const authService = new AuthService()

export class AuthController {
    public async login(request: Request, response: Response) {
        try {
            const { email, senha } = request.body

            if (!email || !senha) {
                return response.status(400).json({
                    success: false,
                    code: response.statusCode,
                    message: "Preencha todos os campos obrigatorios"
                })
            }

            const token = await authService.login(email, senha)

            return response.status(200).json({
                success: true,
                code: response.statusCode,
                message: "Login realizado com sucesso",
                token
            })
        } catch (error) {
            return response.status(500).json({
                success: false,
                code: response.statusCode,
                message: "Erro ao fazer login"
            })
        }
    }
}
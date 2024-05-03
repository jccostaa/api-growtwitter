import { Request, Response } from "express"
import { AuthService } from "../services/auth.service"
import { missingFieldsError, serverError } from "../util/response.helpers"

const authService = new AuthService()

export class AuthController {
    public async login(request: Request, response: Response) {
        try {
            const { email, senha } = request.body

            if (!email || !senha) {
                return missingFieldsError(response)
            }

            const result = await authService.login({ email, senha })

            return response.status(200).json(result)

        } catch (error: any) {
            return serverError(response, error)
        }
    }
}
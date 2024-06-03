import { JwtPayload } from "jsonwebtoken"

export interface AuthDTO{
    email: string
    senha: string
}

export interface PayloadToken extends JwtPayload{
    id:string
}
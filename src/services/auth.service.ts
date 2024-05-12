import { repository } from "../database/prisma.connection";
//import { randomUUID } from "crypto";
import { ResponseData } from "../dtos/response.dto";
import { AuthDTO, PayloadToken } from "../dtos/auth.dto";
import jwt from "jsonwebtoken"



export class AuthService {
    public async login(data: AuthDTO): Promise<ResponseData> {

        const usuario = await repository.usuario.findFirst({
            where: {
                email: data.email,
                senha: data.senha
            }
        });

        //se nao tiver usuario, 401 - unauthoridez
        if (!usuario) {
            return {
                success: false,
                message: "Credenciais invalidas",
                code: 401
            }
        }

        //const token = randomUUID();

        const usuario_id = {
            id: usuario.id
        }
        //const token = jwt.sign(user_id, process.env.JWT_SECRET!) exclamação para avisar que é garantido que virá uma informação

        const token = this.generateToken(usuario_id)

        // await repository.usuario.update({
        //     where: {
        //         id: usuario.id
        //     },
        //     data: {
        //         token
        //     }
        // });

        return {
            success: true,
            message: "Login efetuado com sucesso",
            code: 200,
            data: {
                id: usuario.id,
                email: usuario.email,
                nome: usuario.nome,
                nomeUsuario: usuario.nomeUsuario,
                token
            }
        };
    }

    public async validateLogin(token: string, id: string): Promise<ResponseData> {

        const payload = this.validateToken(token) as PayloadToken

        if (payload === null || id !== payload.id) {
            return {
                success:false,
                message:"Token inválido",
                code:401
            }
        }

        return{
            success:true,
            message:"Validação executada com sucesso",
            code:200
        }
    }

    public generateToken(payload: any) {
        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: '1d'
        })

        return token
    }

    public validateToken(token: string) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!)

            return payload
        } catch (error: any) {
            return null
        }
    }
} 

import repository from "../database/prisma.connection";
import { ResponseData } from "../dtos/response.dto";
import { AuthDTO, PayloadToken } from "../dtos/auth.dto";
import jwt from "jsonwebtoken"



export class AuthService {

    /**
     * Realiza uma autenticação na API através de login com email e senha
     * ```ts
     * const authService = new AuthService();
     * const result = await authservice.login({
     * email:"email@email.com",
     * senha:"12345"
     * })
     * ```
     * @author Jean Costa
     * @param data AuthDTO com email e senha
     * @async por conta da chamada ao banco de dados
     * @returns um objeto contendo as informações de erro/sucesso e os dados do usuario logado(com token)
     */
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

        const usuario_id = {
            id: usuario.id
        }

        const token = this.generateToken(usuario_id)


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

    /**
     * Validar se o token é valido ou não
     * @param token token informado pelo usuario 
     * @param idUsuario id do usuario
     * @returns os dados do usuário 
     */
    public async validateLogin(token: string, id: string): Promise<ResponseData> {

        const payload = this.validateToken(token) as PayloadToken

        if (payload === null || id !== payload.id) {
            return {
                success: false,
                message: "Token inválido",
                code: 401
            }
        }
        return {
            success: true,
            message: "Validação executada com sucesso",
            code: 200
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

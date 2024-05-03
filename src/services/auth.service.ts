import { repository } from "../database/prisma.connection";
import { randomUUID } from "crypto";
import { ResponseData } from "../dtos/response.dto";
import { AuthDTO } from "../dtos/auth.dto";



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
                success:false,
                message:"Credenciais invalidas",
                code:401
            }
        }

        const token = randomUUID();
        const userId = usuario.id;

        await repository.usuario.update({
            where: {
                id: usuario.id
            },
            data: {
                token
            }
        });

        return {
            success:true,
            message:"Login efetuado com sucesso",
            code:200,
            data:{
                id:usuario.id,
                email:usuario.email,
                nome:usuario.nome,
                nomeUsuario:usuario.nomeUsuario,
                token
            }
        };
    }
} 

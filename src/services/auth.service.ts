import { repository } from "../database/prisma.connection";
import { randomUUID } from "crypto";

export class AuthService{
    public async login(email:string, senha:string):Promise<string>{
        const usuario = await repository.usuario.findFirst({
            where:{
                email,
                senha
            }
        })

        if(!usuario){
            throw new Error("Credenciais invalidas")
        }

        const token = randomUUID()

        await repository.usuario.update({
            where:{
                id: usuario.id
            },
            data:{
                token
            }
        })
        return token
    }
}
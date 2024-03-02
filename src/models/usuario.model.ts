import { randomUUID } from "crypto"

export class Usuario {
    private _id: string

    constructor(
        private _nome: string,
        private _email: string,
        private _nomeUsuario: string,
        private _senha: string
    ) {
        this._id = randomUUID()
    }

    get id(): string {
        return this._id
    }
    get nome(): string {
        return this._nome
    }
    get email(): string {
        return this._email
    }
    get nomeUsuario(): string {
        return this._nomeUsuario
    }
    get senha(): string {
        return this._senha
    }
}
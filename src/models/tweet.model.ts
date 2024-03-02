import { randomUUID } from "crypto"

export class Tweet {
    private _id: string

    constructor(
        private _usuarioId: string,
        private _conteudo: string,
        private _tipo: string
    ) {
        this._id = randomUUID()
    }

    get id():string{
        return this._id
    }
    get usuarioId():string{
        return this._usuarioId
    }
    get conteudo():string{
        return this._conteudo
    }
    get tipo():string{
        return this._tipo
    }
}
import { randomUUID } from "crypto"

export class Reply {
    private _id: string

    constructor(
        private _usuarioId: string,
        private _tweetId: string,
        private _conteudo?:string
    ) {
        this._id = randomUUID()
    }

    get id(): string {
        return this._id
    }
    get usuarioId(): string {
        return this._usuarioId
    }
    get tweetId(): string {
        return this._tweetId
    }
    get conteudo():string{
        return this._conteudo
    }
}
import { randomUUID } from "crypto"

export class Like {
    private _id: string

    constructor(
        private _usuarioId: string,
        private _tweetId: string
    ) {
        this._id = randomUUID()
    }

    get id(): string {
        return this._id
    }
    get idUsuario(): string {
        return this._usuarioId
    }
    get idTweet(): string {
        return this._tweetId
    }
}
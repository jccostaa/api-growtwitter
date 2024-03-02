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
    get usuarioId(): string {
        return this._usuarioId
    }
    get tweetId(): string {
        return this._tweetId
    }
}
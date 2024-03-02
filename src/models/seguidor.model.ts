import { randomUUID } from "crypto"

export class Seguidor {
    private _id: string

    constructor(
        private _usuarioId: string,
        private _seguidorId: string
    ) {
        this._id = randomUUID()
    }
    get id(): string {
        return this._id
    }
    get usuarioId(): string {
        return this._usuarioId
    }
    get seguidorId(): string {
        return this._seguidorId
    }
}
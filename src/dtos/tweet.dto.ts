export class CreateTweetDTO {
    conteudo: string
    tipo: string
    idUsuario: string
}

export class UpdateTweetDTO {
    id:string
    conteudo: string
    usuarioId: string
}
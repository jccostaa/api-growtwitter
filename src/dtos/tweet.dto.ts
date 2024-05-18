
export interface CreateTweetDTO {
    conteudo: string
    tipo: string
    idUsuario: string
}

export interface UpdateTweetDTO {
    id:string
    idUsuario: string
    conteudo: string
}

export interface ReplyTweetDTO{
    idUsuario: string
    idTweet: string
    conteudo:string | ""
}
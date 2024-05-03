
export interface CreateTweetDTO {
    conteudo: string
    tipo: string
    idUsuario: string
}

export interface UpdateTweetDTO {
    id:string
    conteudo: string
    idUsuario: string
}
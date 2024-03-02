export interface CreateUsuarioDTO {
    nome: string
    email: string
    nomeUsuario: string
    senha: string
}

export interface UpdateUsuarioDTO{
    id:string
    nome?: string
    email?: string
    nomeUsuario?: string
    senha?: string
}
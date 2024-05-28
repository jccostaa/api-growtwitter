import { prismaMock } from "./config/prisma.mock"
import { AuthService } from "../src/services/auth.service"

import * as dotenv from 'dotenv'
dotenv.config()

describe("Testes UNITARIOS da classe AuthService", () => {
  let sut:AuthService

  beforeEach(()=>{
    // 1 - sut(instancia do que quero testar)
    // cria uma nova antes de cada teste
   sut = new AuthService()
  })

  test("Deve retornar falha (401) quando o usuario nao existir no banco de dados", async () => {

    // Simular que nao existe aluno no banco de dados(findFirst)
    // quando chamar login o findFirst deve retornar null
    prismaMock.usuario.findFirst.mockResolvedValue(null)

    // 2 - chamar o metodo
    const result = await sut.login({
      email: "jeancosta25@gmail.com",
      senha: "1234567"
    })

    // 3 - validações
    expect(result).toBeDefined()
    expect(result).toHaveProperty("success") // ou ("success", false)
    expect(result.success).toBe(false)
    expect(result).toHaveProperty("code")   // ou ("code", 401)
    expect(result.code).toBe(401)
    expect(result).toHaveProperty("message", "Credenciais invalidas")
    expect(result).not.toHaveProperty("data")
    expect(result.data).toBeUndefined()
  })

  test("Deve retornar sucesso (200) quando o usuario existir no banco de dados", async () => {

    prismaMock.usuario.findFirst.mockResolvedValue({
      id: "12345",
      nome:"Jean",
      email:"jeanteste@gmail.com",
      nomeUsuario:"jeanUsuario",
      senha:"123456",
      createdAt: new Date(),
      uptatedAt: new Date(),
      token:"eyJ12345"
        })

    // 2 - chamar o metodo
    const result = await sut.login({
      email: "jean1@gmail.com",
      senha: "1234567"
    })

    // 3 - validações
    expect(result).toBeDefined()
    expect(result).toHaveProperty("success", true)
    expect(result).toHaveProperty("code", 200)
    expect(result).toHaveProperty("message", "Login efetuado com sucesso")
    expect(result).toHaveProperty("data")
    expect(result.data).toHaveProperty("token")
    expect(result.data.token).toContain("eyJ")
  })

  test("Deve retornar falha quando o token não for valido", async ()=>{
    
  })
})


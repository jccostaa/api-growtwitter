import { prismaMock } from "./config/prisma.mock"
import { AuthService } from "../src/services/auth.service"
import jwt from "jsonwebtoken";
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
    const invalidToken = "abcdefgh"
    const result = await sut.validateLogin(invalidToken, "123456")

    expect(result).toBeDefined()
    expect(result).toHaveProperty("success", false)
    expect(result).toHaveProperty("code", 401)
    expect(result).toHaveProperty("message", "Token inválido")
  })

  test("Deve retornar sucesso quando o token for valido", async ()=>{
    const validPayload = {id:"eyJ12345"}
    const token = jwt.sign(validPayload, process.env.JWT_SECRET!, {
      expiresIn: '1d'
    });

    const result = await sut.validateLogin(token,"eyJ12345")

    expect(result).toBeDefined();
    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("code", 200);
    expect(result).toHaveProperty("message", "Validação executada com sucesso");
  })

  test("Deve gerar um token válido",()=>{
    const payload = {id:"eyJ123456"}
    const token = sut.generateToken(payload);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    expect(decoded).toHaveProperty("id", "eyJ123456");
  })

  test("Deve validar um token valido e retornar o payload",()=>{
    const payload = {id:"eyJ123456"}
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn:"1d"
    })

    const decoded = sut.validateToken(token)
    expect(decoded).toBeDefined()
    expect(decoded).toHaveProperty("id", "eyJ123456")
  })

  test("Deve retornar null para um token inválido", () => {
    const invalidToken = "invalid.token"
    const decoded = sut.validateToken(invalidToken)

    expect(decoded).toBeNull()
  })
})


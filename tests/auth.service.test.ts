import { AuthService } from "../src/services/auth.service"

describe.skip("Testes da classe AuthService", () => {
  // Deve ... quando ...

  test("Deve retornar falha (401) quando o usuario nao existir no banco de dados", async () => {
    // 1 - sut(instancia do que quero testar)
    const sut = new AuthService()

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
    // 1 - sut(instancia do que quero testar)
    const sut = new AuthService()

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
})


// ============================================
// auth.test.js
// Pruebas unitarias — Módulo de Autenticación
// Cubre: clases de equivalencia, valores límite
// y camino básico del login
// ============================================

import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mock de api.js para no hacer llamadas reales ──
vi.mock('../services/api', () => ({
  auth: {
    login: vi.fn(),
    register: vi.fn(),
    me: vi.fn()
  },
  setToken: vi.fn(),
  setUser: vi.fn(),
  clearToken: vi.fn(),
  clearUser: vi.fn(),
  getToken: vi.fn(),
  getUser: vi.fn()
}))

import { auth, setToken, setUser, clearToken, clearUser } from '../services/api'
import { login, logout, getSession } from '../utils/login'

// ============================================
// CLASES DE EQUIVALENCIA — Login
// ============================================
describe('Módulo Auth — Clases de Equivalencia', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // CEV1 + CEV2 + CEV3 — credenciales válidas
  it('CP-AUTH-CEV1: login con credenciales válidas retorna usuario', async () => {
    const mockUser = { id: 1, name: 'Brayan', email: 'brayan@test.com' }
    const mockToken = 'jwt.token.valido'

    auth.login.mockResolvedValue({ token: mockToken, user: mockUser })

    const result = await login('brayan@test.com', 'test1234')

    expect(auth.login).toHaveBeenCalledWith({
      email: 'brayan@test.com',
      password: 'test1234'
    })
    expect(setToken).toHaveBeenCalledWith(mockToken)
    expect(setUser).toHaveBeenCalledWith(mockUser)
    expect(result).toEqual(mockUser)
  })

  // CENV2 — usuario no registrado → API lanza error
  it('CP-AUTH-CENV2: login con email no registrado lanza error', async () => {
    auth.login.mockRejectedValue(new Error('Usuario no encontrado'))

    await expect(login('noexiste@gmail.com', 'pass123'))
      .rejects
      .toThrow('Usuario no encontrado')
  })

  // CENV3 — contraseña incorrecta → API lanza error
  it('CP-AUTH-CENV3: login con contraseña incorrecta lanza error', async () => {
    auth.login.mockRejectedValue(new Error('Contraseña incorrecta'))

    await expect(login('brayan@test.com', 'wrongpass'))
      .rejects
      .toThrow('Contraseña incorrecta')
  })

  // CENV4 — contraseña vacía
  it('CP-AUTH-CENV4: login con contraseña vacía lanza error', async () => {
    auth.login.mockRejectedValue(new Error('Datos inválidos'))

    await expect(login('brayan@test.com', ''))
      .rejects
      .toThrow('Datos inválidos')
  })

})

// ============================================
// VALORES LÍMITE — Contraseña
// ============================================
describe('Módulo Auth — Valores Límite', () => {

  beforeEach(() => vi.clearAllMocks())

  // Límite inferior inválido — 5 caracteres
  it('CP-AUTH-VL1: contraseña de 5 chars es rechazada', async () => {
    auth.login.mockRejectedValue(new Error('Datos inválidos'))

    await expect(login('brayan@test.com', 'ab12c'))
      .rejects
      .toThrow()
  })

  // Límite inferior válido — 6 caracteres
  it('CP-AUTH-VL2: contraseña de 6 chars es aceptada', async () => {
    const mockUser = { id: 1, name: 'Brayan' }
    auth.login.mockResolvedValue({ token: 'tok', user: mockUser })

    const result = await login('brayan@test.com', 'ab1234')
    expect(result).toEqual(mockUser)
  })

  // Límite superior — 100 caracteres
  it('CP-AUTH-VL3: contraseña de 100 chars es aceptada', async () => {
    const pass100 = 'a'.repeat(100)
    const mockUser = { id: 1, name: 'Brayan' }
    auth.login.mockResolvedValue({ token: 'tok', user: mockUser })

    const result = await login('brayan@test.com', pass100)
    expect(result).toEqual(mockUser)
  })

})

// ============================================
// CAMINO BÁSICO — Flujo de sesión
// ============================================
describe('Módulo Auth — Camino Básico (flujo sesión)', () => {

  beforeEach(() => vi.clearAllMocks())

  // C4 — flujo exitoso completo
  it('CP-AUTH-C4: login exitoso guarda token y usuario', async () => {
    const mockUser = { id: 1, name: 'Brayan', email: 'brayan@test.com' }
    auth.login.mockResolvedValue({ token: 'jwt.valido', user: mockUser })

    await login('brayan@test.com', 'test1234')

    expect(setToken).toHaveBeenCalledTimes(1)
    expect(setUser).toHaveBeenCalledTimes(1)
  })

  // logout limpia sesión
  it('CP-AUTH-LOGOUT: logout borra token y usuario', () => {
    logout()

    expect(clearToken).toHaveBeenCalledTimes(1)
    expect(clearUser).toHaveBeenCalledTimes(1)
  })

})

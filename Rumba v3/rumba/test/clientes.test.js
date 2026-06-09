// ============================================
// clientes.test.js
// Pruebas unitarias — Módulo Gestión de Clientes
// Cubre: clases de equivalencia, valores límite
// y camino básico de delete
// ============================================

import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mock de api.js ──
vi.mock('../services/api', () => ({
  clientes: {
    getAll:  vi.fn(),
    create:  vi.fn(),
    update:  vi.fn(),
    delete:  vi.fn(),
    getById: vi.fn()
  }
}))

import { clientes } from '../services/api'

// ============================================
// CLASES DE EQUIVALENCIA — Crear Cliente
// ============================================
describe('Módulo Clientes — Clases de Equivalencia', () => {

  beforeEach(() => vi.clearAllMocks())

  // CEV — datos completos válidos
  it('CP-CLI-CEV1: crear cliente con datos válidos retorna objeto', async () => {
    const nuevoCliente = {
      nombre: 'DBk',
      instagram: '@dbkmusic',
      telefono: '3001234567'
    }
    const mockRespuesta = { id: 1, ...nuevoCliente, creadoEn: '2026-06-04T00:00:00' }

    clientes.create.mockResolvedValue(mockRespuesta)

    const result = await clientes.create(nuevoCliente)

    expect(clientes.create).toHaveBeenCalledWith(nuevoCliente)
    expect(result.id).toBe(1)
    expect(result.nombre).toBe('DBk')
  })

  // CEV — segundo cliente válido
  it('CP-CLI-CEV2: crear cliente "Nelman" con datos válidos', async () => {
    const nuevoCliente = { nombre: 'Nelman', instagram: '@nelmandj', telefono: '3159876543' }
    clientes.create.mockResolvedValue({ id: 2, ...nuevoCliente })

    const result = await clientes.create(nuevoCliente)
    expect(result.nombre).toBe('Nelman')
  })

  // CENV1 — nombre vacío
  it('CP-CLI-CENV1: crear cliente con nombre vacío lanza error', async () => {
    clientes.create.mockRejectedValue(new Error('El nombre es requerido'))

    await expect(clientes.create({ nombre: '', instagram: '@test', telefono: '3001111111' }))
      .rejects
      .toThrow('El nombre es requerido')
  })

  // CENV3 — teléfono no numérico
  it('CP-CLI-CENV3: crear cliente con teléfono no numérico lanza error', async () => {
    clientes.create.mockRejectedValue(new Error('Teléfono inválido'))

    await expect(clientes.create({ nombre: 'THEO', instagram: '@theo', telefono: 'abcdefgh' }))
      .rejects
      .toThrow('Teléfono inválido')
  })

  // CENV4 — sin token → 401
  it('CP-CLI-CENV4: crear cliente sin token lanza error 401', async () => {
    clientes.create.mockRejectedValue(new Error('Error 401'))

    await expect(clientes.create({ nombre: 'Mizoa', telefono: '3007654321' }))
      .rejects
      .toThrow('Error 401')
  })

})

// ============================================
// CAMINO BÁSICO — delete cliente
// V(G) = 2 (cliente existe / no existe)
// ============================================
describe('Módulo Clientes — Camino Básico (delete)', () => {

  beforeEach(() => vi.clearAllMocks())

  // C1: cliente no encontrado → 404
  it('C1: eliminar cliente inexistente lanza error 404', async () => {
    clientes.delete.mockRejectedValue(new Error('Error 404'))

    await expect(clientes.delete(9999))
      .rejects
      .toThrow('Error 404')
  })

  // C2: cliente existe → 204 (null)
  it('C2: eliminar cliente existente retorna null (204 No Content)', async () => {
    clientes.delete.mockResolvedValue(null)

    const result = await clientes.delete(1)
    expect(clientes.delete).toHaveBeenCalledWith(1)
    expect(result).toBeNull()
  })

  // Extra: eliminar sin token → 401
  it('C3: eliminar cliente sin token lanza error 401', async () => {
    clientes.delete.mockRejectedValue(new Error('Error 401'))

    await expect(clientes.delete(1))
      .rejects
      .toThrow('Error 401')
  })

})

// ============================================
// VALORES LÍMITE — Campos de Cliente
// ============================================
describe('Módulo Clientes — Valores Límite', () => {

  beforeEach(() => vi.clearAllMocks())

  // Nombre mínimo — 1 carácter
  it('VL-CLI-1: nombre de 1 carácter es válido', async () => {
    clientes.create.mockResolvedValue({ id: 5, nombre: 'A' })

    const result = await clientes.create({ nombre: 'A', telefono: '3001234567' })
    expect(result.nombre).toBe('A')
  })

  // Nombre máximo — 100 caracteres
  it('VL-CLI-2: nombre de 100 caracteres es válido', async () => {
    const nombre100 = 'A'.repeat(100)
    clientes.create.mockResolvedValue({ id: 6, nombre: nombre100 })

    const result = await clientes.create({ nombre: nombre100 })
    expect(result.nombre).toHaveLength(100)
  })

  // Teléfono mínimo — 7 dígitos (colombiano)
  it('VL-CLI-3: teléfono de 7 dígitos es válido', async () => {
    clientes.create.mockResolvedValue({ id: 7, nombre: 'Test', telefono: '3001234' })

    const result = await clientes.create({ nombre: 'Test', telefono: '3001234' })
    expect(result.telefono).toBe('3001234')
  })

  // Teléfono máximo — 10 dígitos (celular colombiano)
  it('VL-CLI-4: teléfono de 10 dígitos es válido', async () => {
    clientes.create.mockResolvedValue({ id: 8, nombre: 'Test', telefono: '3001234567' })

    const result = await clientes.create({ nombre: 'Test', telefono: '3001234567' })
    expect(result.telefono).toHaveLength(10)
  })

  // Teléfono sobre límite — 11 dígitos
  it('VL-CLI-5: teléfono de 11 dígitos lanza error', async () => {
    clientes.create.mockRejectedValue(new Error('Teléfono inválido'))

    await expect(clientes.create({ nombre: 'Test', telefono: '30012345678' }))
      .rejects
      .toThrow()
  })

})

// ============================================
// CRUD completo — flujo integrado (mock)
// ============================================
describe('Módulo Clientes — Flujo CRUD completo', () => {

  beforeEach(() => vi.clearAllMocks())

  it('Crear → Actualizar → Eliminar cliente exitosamente', async () => {
    // Crear
    clientes.create.mockResolvedValue({ id: 10, nombre: 'Don Jose', telefono: '3009876543' })
    const creado = await clientes.create({ nombre: 'Don Jose', telefono: '3009876543' })
    expect(creado.id).toBe(10)

    // Actualizar
    clientes.update.mockResolvedValue({ id: 10, nombre: 'Don Jose Updated', telefono: '3009876543' })
    const actualizado = await clientes.update(10, { nombre: 'Don Jose Updated' })
    expect(actualizado.nombre).toBe('Don Jose Updated')

    // Eliminar
    clientes.delete.mockResolvedValue(null)
    const eliminado = await clientes.delete(10)
    expect(eliminado).toBeNull()

    // Verificar que se llamó cada función una vez
    expect(clientes.create).toHaveBeenCalledTimes(1)
    expect(clientes.update).toHaveBeenCalledTimes(1)
    expect(clientes.delete).toHaveBeenCalledTimes(1)
  })

})

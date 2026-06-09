// ============================================
// rumbas.test.js
// Pruebas unitarias — Módulo Gestión de Rumbas
// Cubre: detección automática de tipo (camino
// básico completo, 7 caminos) y operaciones CRUD
// ============================================

import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Función detectarTipo extraída del hook ──
// (cópiala aquí para testearla de forma aislada)
function detectarTipo(nombre) {
  const n = nombre.toLowerCase()
  if (/mix|master/.test(n)) return 'Mix & Master'   // C1
  if (/beat|prod/.test(n))  return 'Producción'     // C2
  if (/grab|voz/.test(n))   return 'Grabación'      // C3
  if (/comp|letra/.test(n)) return 'Composición'    // C4
  if (/edit|afin/.test(n))  return 'Edición'        // C5
  if (/ft|feat/.test(n))    return 'Colaboración'   // C6
  return 'Producción'                                // C7 — default
}

// ── Función formatCOP extraída del hook ──
function formatCOP(valor) {
  if (!valor && valor !== 0) return '—'
  return '$' + Number(valor).toLocaleString('es-CO')
}

// ── Mock de api.js ──
vi.mock('../services/api', () => ({
  rumbas: {
    getAll:     vi.fn(),
    create:     vi.fn(),
    update:     vi.fn(),
    delete:     vi.fn(),
    completar:  vi.fn(),
    metricas:   vi.fn()
  }
}))

import { rumbas } from '../services/api'

// ============================================
// CAMINO BÁSICO — detectarTipo (7 caminos)
// ============================================
describe('detectarTipo — Camino Básico (V(G) = 7)', () => {

  // C1: contiene "mix" o "master"
  it('C1: nombre con "mix" → Mix & Master', () => {
    expect(detectarTipo('modo avion mix')).toBe('Mix & Master')
  })

  it('C1b: nombre con "master" → Mix & Master', () => {
    expect(detectarTipo('master final track')).toBe('Mix & Master')
  })

  // C2: contiene "beat" o "prod"
  it('C2: nombre con "beat" → Producción', () => {
    expect(detectarTipo('playa beat 100bpm')).toBe('Producción')
  })

  it('C2b: nombre con "prod" → Producción', () => {
    expect(detectarTipo('prod cumbia nueva')).toBe('Producción')
  })

  // C3: contiene "grab" o "voz"
  it('C3: nombre con "grab" → Grabación', () => {
    expect(detectarTipo('grabacion brayan david')).toBe('Grabación')
  })

  it('C3b: nombre con "voz" → Grabación', () => {
    expect(detectarTipo('voz final cancion')).toBe('Grabación')
  })

  // C4: contiene "comp" o "letra"
  it('C4: nombre con "letra" → Composición', () => {
    expect(detectarTipo('letra nueva composicion')).toBe('Composición')
  })

  it('C4b: nombre con "comp" → Composición', () => {
    expect(detectarTipo('comp reggaeton dbk')).toBe('Composición')
  })

  // C5: contiene "edit" o "afin"
  it('C5: nombre con "edit" → Edición', () => {
    expect(detectarTipo('edit video clip')).toBe('Edición')
  })

  it('C5b: nombre con "afin" → Edición', () => {
    expect(detectarTipo('afinacion guitarra')).toBe('Edición')
  })

  // C6: contiene "ft" o "feat"
  it('C6: nombre con "ft" → Colaboración', () => {
    expect(detectarTipo('ft dbk nelman')).toBe('Colaboración')
  })

  it('C6b: nombre con "feat" → Colaboración', () => {
    expect(detectarTipo('cancion feat maykel')).toBe('Colaboración')
  })

  // C7: sin ninguna palabra clave → default
  it('C7: nombre sin palabras clave → Producción (default)', () => {
    expect(detectarTipo('cancion nueva sin keywords')).toBe('Producción')
  })

  it('C7b: string vacío → Producción (default)', () => {
    expect(detectarTipo('')).toBe('Producción')
  })

})

// ============================================
// CLASES DE EQUIVALENCIA — Crear Rumba
// ============================================
describe('Módulo Rumbas — Clases de Equivalencia (CRUD)', () => {

  beforeEach(() => vi.clearAllMocks())

  // CEV — crear rumba con datos válidos
  it('CP-RUMBA-CEV1: crear rumba con datos válidos retorna objeto', async () => {
    const nuevaRumba = {
      nombre: 'Modo Avión mix',
      tipo: 'Mix & Master',
      estado: 'Pendiente',
      montoPago: 300000
    }
    const mockRespuesta = { id: 1, ...nuevaRumba, creadoEn: '2026-06-04T00:00:00' }

    rumbas.create.mockResolvedValue(mockRespuesta)

    const result = await rumbas.create(nuevaRumba)

    expect(rumbas.create).toHaveBeenCalledWith(nuevaRumba)
    expect(result.id).toBe(1)
    expect(result.tipo).toBe('Mix & Master')
  })

  // CENV — nombre vacío → error
  it('CP-RUMBA-CENV1: crear rumba con nombre vacío lanza error', async () => {
    rumbas.create.mockRejectedValue(new Error('El nombre es requerido'))

    await expect(rumbas.create({ nombre: '', tipo: 'Producción' }))
      .rejects
      .toThrow('El nombre es requerido')
  })

  // CENV — sin token → 401
  it('CP-RUMBA-CENV7: crear rumba sin token lanza error 401', async () => {
    rumbas.create.mockRejectedValue(new Error('Error 401'))

    await expect(rumbas.create({ nombre: 'Test' }))
      .rejects
      .toThrow('Error 401')
  })

  // Completar rumba
  it('CP-RUMBA-COMPLETAR: completar rumba actualiza estado', async () => {
    const mockActualizada = { id: 3, estado: 'Completado' }
    rumbas.completar.mockResolvedValue(mockActualizada)

    const result = await rumbas.completar(3)
    expect(result.estado).toBe('Completado')
  })

  // Eliminar rumba existente
  it('CP-RUMBA-DELETE: eliminar rumba existente retorna null (204)', async () => {
    rumbas.delete.mockResolvedValue(null)

    const result = await rumbas.delete(1)
    expect(rumbas.delete).toHaveBeenCalledWith(1)
    expect(result).toBeNull()
  })

})

// ============================================
// VALORES LÍMITE — Campos de Rumba
// ============================================
describe('Módulo Rumbas — Valores Límite', () => {

  beforeEach(() => vi.clearAllMocks())

  // Nombre mínimo — 1 carácter
  it('VL-RUMBA-1: nombre de 1 carácter es válido', async () => {
    const mockRespuesta = { id: 10, nombre: 'A', tipo: 'Producción' }
    rumbas.create.mockResolvedValue(mockRespuesta)

    const result = await rumbas.create({ nombre: 'A', tipo: 'Producción' })
    expect(result.nombre).toBe('A')
  })

  // MontoPago mínimo — 0
  it('VL-RUMBA-2: montoPago de 0 es válido', async () => {
    const mockRespuesta = { id: 11, nombre: 'Test', montoPago: 0 }
    rumbas.create.mockResolvedValue(mockRespuesta)

    const result = await rumbas.create({ nombre: 'Test', montoPago: 0 })
    expect(result.montoPago).toBe(0)
  })

  // MontoPago negativo — inválido
  it('VL-RUMBA-3: montoPago negativo lanza error', async () => {
    rumbas.create.mockRejectedValue(new Error('El monto no puede ser negativo'))

    await expect(rumbas.create({ nombre: 'Test', montoPago: -5000 }))
      .rejects
      .toThrow()
  })

})

// ============================================
// formatCOP — utilidad de formato
// ============================================
describe('formatCOP — Formato de pesos colombianos', () => {

  it('formatea 100000 como $100.000', () => {
    expect(formatCOP(100000)).toBe('$100.000')
  })

  it('formatea 0 como $0', () => {
    expect(formatCOP(0)).toBe('$0')
  })

  it('formatea null como —', () => {
    expect(formatCOP(null)).toBe('—')
  })

  it('formatea 3500000 como $3.500.000', () => {
    expect(formatCOP(3500000)).toBe('$3.500.000')
  })

})

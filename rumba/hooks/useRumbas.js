// ============================================
// useRumbas.js — hook central de Rumbas
// ============================================

import { useState, useEffect } from "react";

export function detectarTipo(texto) {
  const t = texto.toLowerCase();
  if (/\bmix\b|master|mezcla/.test(t))                    return "Mix & Master";
  if (/\bbeat\b|prod|instrumen/.test(t))                  return "Producción";
  if (/grab|record|voz|voces|vocal/.test(t))              return "Grabación";
  if (/comp|letra|lírica|lirica|canción|cancion/.test(t)) return "Composición";
  if (/edit|afin|perc|correc/.test(t))                    return "Edición";
  if (/\bft\b|feat|colab|joint/.test(t))                  return "Colaboración";
  return "Producción";
}

export function crearRumba(nombre, overrides = {}) {
  const now = Date.now();
  return {
    id:            now,
    nombre:        nombre.trim(),
    tipo:          detectarTipo(nombre),
    cliente:       null,
    estado:        "Pendiente",
    pagado:        false,
    montoPago:     "",           // string formateado "$100.000"
    fechaEntrega:  "",
    notas:         "",
    urgente:       false,
    ep:            "",
    creadoEn:      now,
    actualizadoEn: now,
    ...overrides
  };
}

// Formatea número a pesos colombianos: 100000 → "$100.000"
export function formatCOP(valor) {
  const num = parseInt(String(valor).replace(/[^0-9]/g, ""), 10);
  if (isNaN(num) || num === 0) return "";
  return "$" + num.toLocaleString("es-CO");
}

// Extrae número de un string formateado: "$100.000" → 100000
export function parseCOP(str) {
  return parseInt(String(str).replace(/[^0-9]/g, ""), 10) || 0;
}

export function useRumbas(userId) {
  const KEY = `rumba_proyectos_${userId}`;
  const [rumbas, setRumbas] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const guardado = localStorage.getItem(KEY);
    setRumbas(guardado ? JSON.parse(guardado) : []);
  }, [userId]);

  const persistir = (nuevas) => {
    setRumbas(nuevas);
    localStorage.setItem(KEY, JSON.stringify(nuevas));
  };

  const crearRapido = (nombre) => {
    if (!nombre.trim()) return null;
    const nueva = crearRumba(nombre);
    const nuevas = [nueva, ...rumbas];
    persistir(nuevas);
    return nueva;
  };

  const actualizar = (id, cambios) => {
    persistir(rumbas.map(r =>
      r.id === id ? { ...r, ...cambios, actualizadoEn: Date.now() } : r
    ));
  };

  // Eliminar uno o varios ids
  const eliminar = (ids) => {
    const arr = Array.isArray(ids) ? ids : [ids];
    persistir(rumbas.filter(r => !arr.includes(r.id)));
  };

  // Marcar como completado uno o varios
  const completar = (ids) => {
    const arr = Array.isArray(ids) ? ids : [ids];
    persistir(rumbas.map(r =>
      arr.includes(r.id)
        ? { ...r, estado: "Completado", actualizadoEn: Date.now() }
        : r
    ));
  };

  // Ingresos: suma montoPago de rumbas con pagado=true (reactivo, sin recarga)
  const ingresosMes = rumbas
    .filter(r => r.pagado && r.montoPago)
    .reduce((acc, r) => acc + parseCOP(r.montoPago), 0);

  const metricas = {
    activas:     rumbas.filter(r => r.estado === "En progreso" || r.estado === "Pendiente").length,
    completadas: rumbas.filter(r => r.estado === "Completado").length,
    urgentes:    rumbas.filter(r => r.urgente).length,
    ingresosMes
  };

  return { rumbas, crearRapido, actualizar, eliminar, completar, metricas, persistir };
}

// ============================================
// hooks/useRumbas.js
// Reemplaza localStorage por llamadas a la API
// ============================================

import { useState, useEffect, useCallback } from "react";
import { rumbas as api } from "../services/api";

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

export function formatCOP(valor) {
  const num = parseInt(String(valor).replace(/[^0-9]/g, ""), 10);
  if (isNaN(num) || num === 0) return "";
  return "$" + num.toLocaleString("es-CO");
}

export function parseCOP(str) {
  return parseInt(String(str).replace(/[^0-9]/g, ""), 10) || 0;
}

export function useRumbas() {
  const [rumbas, setRumbas]     = useState([]);
  const [metricas, setMetricas] = useState({ activas: 0, completadas: 0, urgentes: 0, ingresosMes: 0 });
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState(null);

  // --- Cargar todas las rumbas ---
  const cargar = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await api.getAll();
      setRumbas(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  // --- Cargar métricas ---
  const cargarMetricas = useCallback(async () => {
    try {
      const data = await api.metricas();
      setMetricas(data);
    } catch (e) {
      console.error("Error cargando métricas:", e.message);
    }
  }, []);

  useEffect(() => {
    cargar();
    cargarMetricas();
  }, []);

  // --- Crear rápido desde command bar ---
  const crearRapido = useCallback(async (nombre, tipoOverride) => {
    if (!nombre.trim()) return null;
    try {
      const nueva = await api.create({
        nombre,
        tipo:    tipoOverride || detectarTipo(nombre),
        estado:  "Pendiente",
        urgente: false,
        pagado:  false
      });
      setRumbas(prev => [nueva, ...prev]);
      await cargarMetricas();
      return nueva;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, [cargarMetricas]);

  // --- Actualizar una rumba ---
  const actualizar = useCallback(async (id, cambios) => {
    try {
      // Mapear el objeto del frontend al DTO que espera la API
      const body = {
        nombre:       cambios.nombre,
        tipo:         cambios.tipo,
        estado:       cambios.estado,
        pagado:       cambios.pagado       ?? false,
        montoPago:    cambios.montoPago    ?? "",
        fechaEntrega: cambios.fechaEntrega ?? "",
        notas:        cambios.notas        ?? "",
        urgente:      cambios.urgente      ?? false,
        ep:           cambios.ep           ?? "",
        clienteId:    cambios.cliente?.id  ?? null
      };
      const actualizada = await api.update(id, body);
      setRumbas(prev => prev.map(r => r.id === id ? actualizada : r));
      await cargarMetricas();
    } catch (e) {
      setError(e.message);
    }
  }, [cargarMetricas]);

  // --- Marcar como completado (uno o varios) ---
  const completar = useCallback(async (ids) => {
    const arr = Array.isArray(ids) ? ids : [ids];
    try {
      await Promise.all(arr.map(id => api.completar(id)));
      setRumbas(prev =>
        prev.map(r => arr.includes(r.id) ? { ...r, estado: "Completado" } : r)
      );
      await cargarMetricas();
    } catch (e) {
      setError(e.message);
    }
  }, [cargarMetricas]);

  // --- Eliminar uno o varios ---
  const eliminar = useCallback(async (ids) => {
    const arr = Array.isArray(ids) ? ids : [ids];
    try {
      if (arr.length === 1) {
        await api.delete(arr[0]);
      } else {
        await api.deleteMany(arr);
      }
      setRumbas(prev => prev.filter(r => !arr.includes(r.id)));
      await cargarMetricas();
    } catch (e) {
      setError(e.message);
    }
  }, [cargarMetricas]);

  return {
    rumbas,
    metricas,
    cargando,
    error,
    cargar,
    crearRapido,
    actualizar,
    completar,
    eliminar
  };
}

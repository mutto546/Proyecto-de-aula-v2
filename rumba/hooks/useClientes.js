// ============================================
// hooks/useClientes.js
// Reemplaza localStorage por llamadas a la API
// ============================================

import { useState, useEffect, useCallback } from "react";
import { clientes as api } from "../services/api";

export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState(null);

  const cargar = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await api.getAll();
      setClientes(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, []);

  const agregarCliente = useCallback(async (datos) => {
    try {
      const nuevo = await api.create(datos);
      setClientes(prev => [nuevo, ...prev]);
      return nuevo;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, []);

  const actualizarCliente = useCallback(async (id, datos) => {
    try {
      const actualizado = await api.update(id, datos);
      setClientes(prev => prev.map(c => c.id === id ? actualizado : c));
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const eliminarCliente = useCallback(async (id) => {
    try {
      await api.delete(id);
      setClientes(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      setError(e.message);
    }
  }, []);

  return {
    clientes,
    cargando,
    error,
    cargar,
    agregarCliente,
    actualizarCliente,
    eliminarCliente
  };
}

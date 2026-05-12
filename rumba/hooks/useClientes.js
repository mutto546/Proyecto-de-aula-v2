// ============================================
// useClientes.js — hook de clientes
// ============================================

import { useState, useEffect } from "react";

export function useClientes(userId) {
  const KEY = `rumba_clientes_${userId}`;
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const guardado = localStorage.getItem(KEY);
    setClientes(guardado ? JSON.parse(guardado) : []);
  }, [userId]);

  const persistir = (nuevos) => {
    setClientes(nuevos);
    localStorage.setItem(KEY, JSON.stringify(nuevos));
  };

  const agregarCliente = (datos) => {
    const nuevo = { ...datos, id: Date.now(), creadoEn: Date.now() };
    persistir([nuevo, ...clientes]);
    return nuevo;
  };

  const actualizarCliente = (id, cambios) => {
    persistir(clientes.map(c => c.id === id ? { ...c, ...cambios } : c));
  };

  const eliminarCliente = (id) => {
    persistir(clientes.filter(c => c.id !== id));
  };

  return { clientes, agregarCliente, actualizarCliente, eliminarCliente, persistir };
}

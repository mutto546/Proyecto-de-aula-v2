// ============================================
// RumbasSection.jsx — tabla con selección múltiple,
// clic derecho, botón completar y clientes reactivos
// ============================================

import React, { useState, useEffect, useRef } from "react";
import { useRumbas } from "../hooks/useRumbas";
import CommandBar from "./CommandBar";
import RumbaDetalle from "./RumbaDetalle";
import "../styles/ModalStyle.css";

const CLASE_ESTADO = {
  "Pendiente": "available",
  "En progreso": "negotiation",
  "En revisión": "licensed",
  "Completado": "licensed",
  "Archivado": "exclusive"
};

function tiempoRelativo(ts) {
  const seg = Math.floor((Date.now() - ts) / 1000);
  const min = Math.floor(seg / 60);
  const h = Math.floor(min / 60);
  const d = Math.floor(h / 24);
  if (seg < 60) return "justo ahora";
  if (min < 60) return `hace ${min} min`;
  if (h < 24) return `hace ${h}h`;
  if (d === 1) return "hace 1 día";
  if (d < 7) return `hace ${d} días`;
  if (d < 30) return `hace ${Math.floor(d / 7)} sem.`;
  return `hace ${Math.floor(d / 30)} mes${Math.floor(d / 30) > 1 ? "es" : ""}`;
}

export default function RumbasSection({ userId, clientes, onCrearCliente }) {
  const { rumbas, crearRapido, actualizar, eliminar, completar } = useRumbas(userId);

  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [rumbaAbierta, setAbierta] = useState(null);
  const [seleccion, setSeleccion] = useState(new Set()); // ids seleccionados
  const [menu, setMenu] = useState(null);       // { id, x, y }
  const menuRef = useRef(null);

  // Cerrar menú al clicar fuera
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lista filtrada
  const lista = rumbas.filter(r => {
    const pasaFiltro =
      filtro === "Todos" ? true :
        filtro === "Urgentes" ? r.urgente :
          r.tipo === filtro;
    const pasaBusqueda = !busqueda ||
      r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (r.cliente?.nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      r.tipo.toLowerCase().includes(busqueda.toLowerCase());
    return pasaFiltro && pasaBusqueda;
  });

  // Crear desde command bar
  const handleCrear = (nombre, tipoOverride) => {
    const nueva = crearRapido(nombre);
    if (!nueva) return;
    if (tipoOverride && tipoOverride !== nueva.tipo) actualizar(nueva.id, { tipo: tipoOverride });
    setTimeout(() => setAbierta(nueva.id), 80);
  };

  // Selección de fila (checkbox o Shift+click futuro)
  const toggleSeleccion = (e, id) => {
    e.stopPropagation();
    setSeleccion(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const seleccionarTodos = () => {
    if (seleccion.size === lista.length) {
      setSeleccion(new Set());
    } else {
      setSeleccion(new Set(lista.map(r => r.id)));
    }
  };

  // Clic derecho en fila
  const handleContextMenu = (e, id) => {
    e.preventDefault();
    setMenu({ id, x: Math.min(e.clientX, window.innerWidth - 170), y: e.clientY + window.scrollY });
  };

  // Acciones de selección múltiple
  const eliminarSeleccion = () => {
    if (!window.confirm(`¿Eliminar ${seleccion.size} rumba${seleccion.size > 1 ? "s" : ""}?`)) return;
    eliminar([...seleccion]);
    setSeleccion(new Set());
  };

  const completarSeleccion = () => {
    completar([...seleccion]);
    setSeleccion(new Set());
  };

  const dispararCommandBar = () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
  };

  const rumbaSeleccionada = rumbas.find(r => r.id === rumbaAbierta) || null;
  const haySeleccion = seleccion.size > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div>
        <p className="label-eyebrow" style={{ color: "var(--red-500)", marginBottom: "6px" }}>Proyectos</p>
        <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-1px" }}>Rumbas</h1>
      </div>

      {/* Toolbar */}
      <div className="catalog-toolbar">
        <div className="search-bar" style={{ flex: 1 }}>
          <img src="https://img.icons8.com/material/14/A1A1AA/search--v1.png" alt="" style={{ width: 14, height: 14 }} />
          <input
            type="text" value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar proyecto o artista..."
            style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontFamily: "Inter, sans-serif", fontSize: "13px", width: "100%" }}
          />
        </div>

        <div className="filter-pills">
          {["Todos", "Producción", "Mix & Master", "Composición", "Urgentes"].map(f => (
            <button key={f} className={`pill${filtro === f ? " pill-active" : ""}`} onClick={() => setFiltro(f)}>{f}</button>
          ))}
        </div>

        <button className="btn-add" onClick={dispararCommandBar}>
          <img src="https://img.icons8.com/material/14/FFFFFF/plus-math--v1.png" alt="" style={{ width: 14, height: 14 }} />
          Nueva Rumba
          <span className="kbd">Ctrl+K</span>
        </button>
      </div>

      {/* Barra de acciones de selección múltiple */}
      {haySeleccion && (
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "10px 16px", background: "rgba(220,38,38,0.08)",
          border: "1px solid rgba(220,38,38,0.25)", borderRadius: "var(--radius-md)"
        }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--red-400)" }}>
            {seleccion.size} seleccionada{seleccion.size > 1 ? "s" : ""}
          </span>
          <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
            <button
              onClick={completarSeleccion}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 14px", borderRadius: "var(--radius-sm)",
                background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)",
                color: "#4ADE80", fontSize: "12px", fontWeight: 600,
                cursor: "pointer", fontFamily: "Inter, sans-serif"
              }}
            >
              <img src="https://img.icons8.com/material/12/4ADE80/checkmark--v1.png" alt="" style={{ width: 12, height: 12 }} />
              Completar
            </button>
            <button
              onClick={eliminarSeleccion}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 14px", borderRadius: "var(--radius-sm)",
                background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.3)",
                color: "var(--red-400)", fontSize: "12px", fontWeight: 600,
                cursor: "pointer", fontFamily: "Inter, sans-serif"
              }}
            >
              <img src="https://img.icons8.com/material/12/F87171/trash--v1.png" alt="" style={{ width: 12, height: 12 }} />
              Eliminar
            </button>
            <button
              onClick={() => setSeleccion(new Set())}
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "13px", fontFamily: "Inter, sans-serif" }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="catalog-table">
        {/* Header con checkbox de seleccionar todos */}
        <div className="table-head" style={{ gridTemplateColumns: "32px 2fr 1fr 1fr 0.8fr 1.1fr 0.9fr 60px" }}>
          <span>
            <input
              type="checkbox"
              checked={lista.length > 0 && seleccion.size === lista.length}
              onChange={seleccionarTodos}
              style={{ accentColor: "var(--red-500)", cursor: "pointer" }}
            />
          </span>
          <span>Proyecto</span>
          <span>Tipo</span>
          <span>Cliente</span>
          <span>Entrega</span>
          <span>Estado</span>
          <span>Pago</span>
          <span></span>
        </div>

        {lista.length === 0 ? (
          <div className="table-empty">
            {rumbas.length === 0 ? (
              <>Sin rumbas aún. Presiona <span className="kbd" style={{ fontSize: "10px" }}>Ctrl+K</span> para crear la primera.</>
            ) : "No hay proyectos que coincidan."}
          </div>
        ) : lista.map(r => {
          const estaSeleccionada = seleccion.has(r.id);
          return (
            <div
              key={r.id}
              className="table-row"
              style={{
                gridTemplateColumns: "32px 2fr 1fr 1fr 0.8fr 1.1fr 0.9fr 60px",
                cursor: "pointer",
                background: estaSeleccionada ? "rgba(220,38,38,0.06)" : undefined,
                borderLeft: estaSeleccionada ? "2px solid var(--red-500)" : "2px solid transparent"
              }}
              onClick={() => !haySeleccion && setAbierta(r.id)}
              onContextMenu={e => handleContextMenu(e, r.id)}
            >
              {/* Checkbox */}
              <span onClick={e => toggleSeleccion(e, r.id)} style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={estaSeleccionada}
                  onChange={() => { }}
                  style={{ accentColor: "var(--red-500)", cursor: "pointer" }}
                />
              </span>

              {/* Nombre */}
              <div className="beat-info">
                <button className="play-btn" aria-label="Ver" onClick={e => { e.stopPropagation(); setAbierta(r.id); }}>
                  <img src="https://img.icons8.com/material/10/F87171/music--v1.png" alt="" style={{ width: 10, height: 10 }} />
                </button>
                <div>
                  <div className="text-bold-sm">
                    {r.nombre}
                    {r.urgente && <span className="badge-urgent">Urgente</span>}
                    {r.ep && <span className="badge-ep">{r.ep}</span>}
                  </div>
                  <div className="text-xs-muted beat-sub">{tiempoRelativo(r.creadoEn)}</div>
                </div>
              </div>

              <span className="cell-muted">{r.tipo}</span>
              <span className="cell-muted">{r.cliente?.nombre || "—"}</span>
              <span className={r.fechaEntrega && r.fechaEntrega !== "—" ? "text-bold-sm" : "cell-muted"}>
                {r.fechaEntrega || "—"}
              </span>
              <span>
                <span className={`status-badge ${CLASE_ESTADO[r.estado] || "available"}`}>{r.estado}</span>
              </span>

              {/* Pago */}
              {r.pagado && r.montoPago
                ? <span className="cell-cash">{r.montoPago}</span>
                : <span className="cell-cash cell-cash--pending">{r.montoPago || "—"}</span>
              }

              {/* Botón completar rápido */}
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }} onClick={e => e.stopPropagation()}>
                {r.estado !== "Completado" ? (
                  <button
                    title="Marcar como completado"
                    onClick={() => completar(r.id)}
                    style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)",
                      color: "#4ADE80", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background 0.15s, transform 0.15s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(74,222,128,0.22)"; e.currentTarget.style.transform = "scale(1.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(74,222,128,0.1)"; e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    <img src="https://img.icons8.com/material/10/4ADE80/checkmark--v1.png" alt="✓" style={{ width: 10, height: 10 }} />
                  </button>
                ) : (
                  <span style={{ fontSize: "14px", color: "#4ADE80" }}>✓</span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <div className="catalog-footer">
        <span className="text-xs-muted">
          {lista.length} proyecto{lista.length !== 1 ? "s" : ""}
          {filtro !== "Todos" && ` · ${filtro}`}
        </span>
      </div>

      {/* Menú contextual (clic derecho) */}
      {menu && (
        <div
          ref={menuRef}
          className="row-menu active"
          style={{ position: "absolute", top: menu.y, left: menu.x }}
        >
          <button className="row-menu-item" onClick={() => { setAbierta(menu.id); setMenu(null); }}>
            <img src="https://img.icons8.com/material/14/A1A1AA/edit--v1.png" alt="" style={{ width: 14, height: 14 }} />
            Editar
          </button>
          <button className="row-menu-item" onClick={() => { completar(menu.id); setMenu(null); }}>
            <img src="https://img.icons8.com/material/14/4ADE80/checkmark--v1.png" alt="" style={{ width: 14, height: 14 }} />
            Marcar completado
          </button>
          <div className="row-menu-divider" />
          <button className="row-menu-item danger" onClick={() => {
            if (window.confirm("¿Eliminar esta Rumba?")) eliminar(menu.id);
            setMenu(null);
          }}>
            <img src="https://img.icons8.com/material/14/F87171/trash--v1.png" alt="" style={{ width: 14, height: 14 }} />
            Eliminar
          </button>
        </div>
      )}

      {/* Command Bar */}
      <CommandBar onCrear={handleCrear} clientes={clientes} />

      {/* Panel de detalle — centrado, clientes reactivos */}
      {rumbaSeleccionada && (
        <RumbaDetalle
          rumba={rumbaSeleccionada}
          clientes={clientes}
          onGuardar={actualizar}
          onEliminar={eliminar}
          onCerrar={() => setAbierta(null)}
          onCrearCliente={onCrearCliente}
        />
      )}
    </div>
  );
}

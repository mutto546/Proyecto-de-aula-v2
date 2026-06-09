// ============================================
// RumbasSection.jsx — tabla con selección múltiple,
// clic derecho, botón completar y clientes reactivos
// Rediseño glassmorphism — lógica intacta
// ============================================

import React, { useState, useEffect, useRef } from "react";
import RumbaDetalle from "./RumbaDetalle";
import "../styles/ModalStyle.css";
import "../styles/dashboard.css";

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

export default function RumbasSection({ rumbas, crearRapido, actualizar, eliminar, completar, clientes, onCrearCliente, onAbrirCommandBar }) {

  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [rumbaAbierta, setAbierta] = useState(null);
  const [seleccion, setSeleccion] = useState(new Set());
  const [menu, setMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

  const handleCrear = (nombre, tipoOverride) => {
    const nueva = crearRapido(nombre);
    if (!nueva) return;
    if (tipoOverride && tipoOverride !== nueva.tipo) actualizar(nueva.id, { tipo: tipoOverride });
  };

  const toggleSeleccion = (e, id) => {
    e.stopPropagation();
    setSeleccion(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const seleccionarTodos = () => {
    if (seleccion.size === lista.length) setSeleccion(new Set());
    else setSeleccion(new Set(lista.map(r => r.id)));
  };

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    setMenu({ id, x: Math.min(e.clientX, window.innerWidth - 190), y: e.clientY + window.scrollY });
  };

  const eliminarSeleccion = () => {
    if (!window.confirm(`¿Eliminar ${seleccion.size} rumba${seleccion.size > 1 ? "s" : ""}?`)) return;
    eliminar([...seleccion]);
    setSeleccion(new Set());
  };

  const completarSeleccion = () => {
    completar([...seleccion]);
    setSeleccion(new Set());
  };

  const rumbaSeleccionada = rumbas.find(r => r.id === rumbaAbierta) || null;
  const haySeleccion = seleccion.size > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      {/* Header */}
      <div className="animate-fade-up">
        <p className="label-eyebrow" style={{ color: "var(--red-400)", marginBottom: 6 }}>Proyectos</p>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-1px", margin: 0 }}>
          <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-1px" }}>Rumbas</h1>
        </h1>
        <p className="text-xs-muted" style={{ marginTop: 6 }}>
          {rumbas.length} en total · {rumbas.filter(r => r.estado !== "Completado").length} activas
        </p>
      </div>

      {/* Toolbar */}
      <div className="catalog-toolbar animate-fade-up">
        <div className="search-bar" style={{ flex: 1 }}>
          <img src="https://img.icons8.com/material/14/A1A1AA/search--v1.png" alt="" style={{ width: 14, height: 14 }} />
          <input
            type="text" value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar proyecto o artista..."
            style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontFamily: "Inter, sans-serif", fontSize: 13, width: "100%" }}
          />
        </div>

        <div className="filter-pills">
          {["Todos", "Producción", "Mix & Master", "Composición", "Urgentes"].map(f => (
            <button key={f} className={`pill${filtro === f ? " pill-active" : ""}`} onClick={() => setFiltro(f)}>{f}</button>
          ))}
        </div>

        <button className="btn-add" onClick={onAbrirCommandBar}>
          <img src="https://img.icons8.com/material/14/FFFFFF/plus-math--v1.png" alt="" style={{ width: 14, height: 14 }} />
          Nueva Rumba
          <span className="kbd">Ctrl+K</span>
        </button>
      </div>

      {/* Barra acciones selección */}
      {haySeleccion && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 16px",
          background: "linear-gradient(135deg, rgba(220,38,38,0.12), rgba(220,38,38,0.04))",
          border: "1px solid rgba(220,38,38,0.30)",
          borderRadius: "var(--radius-md)",
          backdropFilter: "blur(10px)",
          animation: "slideUp .2s ease"
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--red-400)" }}>
            {seleccion.size} seleccionada{seleccion.size > 1 ? "s" : ""}
          </span>
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button onClick={completarSeleccion} style={accionBtn("#4ADE80")}>
              <img src="https://img.icons8.com/material/12/4ADE80/checkmark--v1.png" alt="" style={{ width: 12, height: 12 }} />
              Completar
            </button>
            <button onClick={eliminarSeleccion} style={accionBtn("#F87171")}>
              <img src="https://img.icons8.com/material/12/F87171/trash--v1.png" alt="" style={{ width: 12, height: 12 }} />
              Eliminar
            </button>
            <button onClick={() => setSeleccion(new Set())} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, fontFamily: "Inter, sans-serif" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="catalog-table animate-fade-up">
        <div className="table-head" style={{ gridTemplateColumns: "32px 2fr 1fr 1fr 0.8fr 1.1fr 0.9fr 60px" }}>
          <span>
            <input type="checkbox" checked={lista.length > 0 && seleccion.size === lista.length} onChange={seleccionarTodos} style={{ cursor: "pointer", accentColor: "var(--red-500)" }} />
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
              <>Sin rumbas aún. Presiona <span className="kbd" style={{ fontSize: 10 }}>Ctrl+K</span> para crear la primera.</>
            ) : "No hay proyectos que coincidan."}
          </div>
        ) : lista.map((r, idx) => {
          const estaSeleccionada = seleccion.has(r.id);
          return (
            <div
              key={r.id}
              className="table-row"
              style={{
                gridTemplateColumns: "32px 2fr 1fr 1fr 0.8fr 1.1fr 0.9fr 60px",
                cursor: "pointer",
                background: estaSeleccionada ? "linear-gradient(90deg, rgba(220,38,38,0.10), rgba(220,38,38,0.02))" : undefined,
                borderLeft: estaSeleccionada ? "2px solid var(--red-500)" : "2px solid transparent",
                animation: `slideUp 0.25s ease ${Math.min(idx * 25, 250)}ms both`
              }}
              onClick={() => !haySeleccion && setAbierta(r.id)}
              onContextMenu={e => handleContextMenu(e, r.id)}
            >
              <span onClick={e => toggleSeleccion(e, r.id)} style={{ display: "flex", alignItems: "center" }}>
                <input type="checkbox" checked={estaSeleccionada} onChange={() => { }} style={{ cursor: "pointer", accentColor: "var(--red-500)" }} />
              </span>

              <div className="beat-info">
                <button className="play-btn" aria-label="Ver" onClick={e => { e.stopPropagation(); setAbierta(r.id); }}>
                  <img src="https://img.icons8.com/material/10/F87171/music--v1.png" alt="" style={{ width: 10, height: 10 }} />
                </button>
                <div style={{ minWidth: 0 }}>
                  <div className="text-bold-sm" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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

              {r.pagado && r.montoPago
                ? <span className="cell-cash">{r.montoPago}</span>
                : <span className="cell-cash cell-cash--pending">{r.montoPago || "—"}</span>
              }

              <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }} onClick={e => e.stopPropagation()}>
                {r.estado !== "Completado" ? (
                  <button
                    title="Marcar como completado"
                    onClick={() => completar(r.id)}
                    style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.28)",
                      color: "#4ADE80", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background .15s, transform .15s, box-shadow .15s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(74,222,128,0.25)"; e.currentTarget.style.transform = "scale(1.12)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(74,222,128,0.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(74,222,128,0.12)"; e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <img src="https://img.icons8.com/material/10/4ADE80/checkmark--v1.png" alt="✓" style={{ width: 10, height: 10 }} />
                  </button>
                ) : (
                  <span style={{ fontSize: 14, color: "#4ADE80", filter: "drop-shadow(0 0 6px rgba(74,222,128,0.6))" }}>✓</span>
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

      {/* Menú contextual */}
      {menu && (
        <div ref={menuRef} className="row-menu active" style={{ position: "absolute", top: menu.y, left: menu.x }}>
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

function accionBtn(color) {
  return {
    display: "flex", alignItems: "center", gap: 6,
    padding: "6px 14px", borderRadius: "var(--radius-sm)",
    background: `${color}1f`, border: `1px solid ${color}4d`,
    color, fontSize: 12, fontWeight: 600,
    cursor: "pointer", fontFamily: "Inter, sans-serif",
    transition: "transform .12s"
  };
}

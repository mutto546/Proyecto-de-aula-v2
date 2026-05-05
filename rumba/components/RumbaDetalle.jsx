// ============================================
// RumbaDetalle.jsx — modal centrado de edición
// ============================================

import React, { useState, useEffect } from "react";
import { formatCOP, parseCOP } from "../hooks/useRumbas";
import "../styles/ModalStyle.css";

const TIPOS   = ["Producción", "Mix & Master", "Composición", "Grabación", "Edición", "Colaboración"];
const ESTADOS = ["Pendiente", "En progreso", "En revisión", "Completado", "Archivado"];

const CLASE_ESTADO = {
  "Pendiente":   "available",
  "En progreso": "negotiation",
  "En revisión": "licensed",
  "Completado":  "licensed",
  "Archivado":   "exclusive"
};

// Formatea timestamp con fecha y hora (sin segundos)
function fechaHora(ts) {
  return new Date(ts).toLocaleString("es-CO", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

export default function RumbaDetalle({ rumba, clientes, onGuardar, onEliminar, onCerrar, onCrearCliente }) {
  const [form, setForm]       = useState(null);
  const [dirty, setDirty]     = useState(false);
  const [montoRaw, setMonto]  = useState(""); // valor crudo mientras escribe

  // Sincronizar cuando cambia la rumba abierta
  useEffect(() => {
    if (rumba) {
      setForm({ ...rumba });
      setMonto(rumba.montoPago || "");
      setDirty(false);
    }
  }, [rumba?.id]);

  // Clave: cuando clientes cambia desde afuera, NO resetear el form
  // (el select de clientes usa la prop clientes directamente)

  if (!rumba || !form) return null;

  const campo = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setDirty(true);
  };

  // Formatear monto al salir del input (onBlur)
  const handleMontoBlur = () => {
    const formatted = formatCOP(montoRaw);
    setMonto(formatted);
    campo("montoPago", formatted);
  };

  // Mientras escribe, solo deja números
  const handleMontoChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setMonto(raw);
    setDirty(true);
  };

  const guardar = () => {
    // Asegurarse de formatear el monto antes de guardar
    const montoFinal = formatCOP(montoRaw);
    const formFinal = { ...form, montoPago: montoFinal };
    onGuardar(formFinal.id, formFinal);
    setDirty(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        style={{ position: "fixed", inset: 0, zIndex: 190, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={() => { if (dirty) guardar(); onCerrar(); }}
      />

      {/* Modal centrado */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 195,
        width: "min(520px, 92vw)",
        maxHeight: "88vh",
        background: "var(--bg-card)",
        border: "1px solid var(--border-mid)",
        borderRadius: "var(--radius-lg)",
        display: "flex", flexDirection: "column",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        animation: "detalleIn 0.2s cubic-bezier(0.16,1,0.3,1)"
      }}>

        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ flex: 1 }}>
            <input
              value={form.nombre}
              onChange={e => campo("nombre", e.target.value)}
              style={{
                background: "none", border: "none", outline: "none",
                fontSize: "18px", fontWeight: 800, letterSpacing: "-0.5px",
                color: "var(--text-primary)", fontFamily: "Inter, sans-serif", width: "100%"
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
              <span className={`status-badge ${CLASE_ESTADO[form.estado] || "available"}`}>{form.estado}</span>
              {form.urgente && <span className="badge-urgent">Urgente</span>}
              {form.ep      && <span className="badge-ep">{form.ep}</span>}
            </div>
          </div>
          <button className="modal-close" onClick={() => { if (dirty) guardar(); onCerrar(); }}>✕</button>
        </div>

        {/* Cuerpo scrolleable */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Tipo y Estado */}
          <div className="modal-row" style={{ marginBottom: 0 }}>
            <div className="modal-field" style={{ marginBottom: 0 }}>
              <label className="modal-label">Tipo</label>
              <select className="modal-select" value={form.tipo} onChange={e => campo("tipo", e.target.value)}>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="modal-field" style={{ marginBottom: 0 }}>
              <label className="modal-label">Estado</label>
              <select className="modal-select" value={form.estado} onChange={e => campo("estado", e.target.value)}>
                {ESTADOS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Cliente — usa prop clientes en tiempo real */}
          <div className="modal-field" style={{ marginBottom: 0 }}>
            <label className="modal-label">Cliente</label>
            <select
              className="modal-select"
              value={form.cliente?.id || ""}
              onChange={e => {
                const val = e.target.value;
                if (val === "__nuevo__") {
                  onCrearCliente(nuevoCliente =>
                    campo("cliente", { id: nuevoCliente.id, nombre: nuevoCliente.nombre })
                  );
                } else if (val === "") {
                  campo("cliente", null);
                } else {
                  const c = clientes.find(x => x.id === parseInt(val));
                  if (c) campo("cliente", { id: c.id, nombre: c.nombre });
                }
              }}
            >
              <option value="">Sin cliente</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
              <option value="__nuevo__">+ Crear nuevo cliente</option>
            </select>
          </div>

          {/* Entrega y EP */}
          <div className="modal-row" style={{ marginBottom: 0 }}>
            <div className="modal-field" style={{ marginBottom: 0 }}>
              <label className="modal-label">Fecha de entrega</label>
              <input className="modal-input" value={form.fechaEntrega} onChange={e => campo("fechaEntrega", e.target.value)} placeholder="Ej: Viernes" />
            </div>
            <div className="modal-field" style={{ marginBottom: 0 }}>
              <label className="modal-label">EP / Álbum</label>
              <input className="modal-input" value={form.ep} onChange={e => campo("ep", e.target.value)} placeholder="Ej: EP Mizar" />
            </div>
          </div>

          {/* Pago — monto independiente del checkbox */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: montoRaw ? "10px" : "0" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", flex: 1 }}>
                <input
                  type="checkbox"
                  checked={form.pagado}
                  onChange={e => campo("pagado", e.target.checked)}
                  style={{ width: 15, height: 15 }}
                />
                <span style={{ fontWeight: 600, fontSize: "13px", color: "var(--text-primary)" }}>Marcado como pagado</span>
              </label>
              {/* Monto siempre visible, independiente del checkbox */}
              <input
                value={montoRaw}
                onChange={handleMontoChange}
                onBlur={handleMontoBlur}
                onFocus={() => setMonto(String(parseCOP(montoRaw) || ""))}
                placeholder="Monto"
                style={{
                  background: "var(--bg-card)", border: "1px solid var(--border-mid)",
                  borderRadius: "var(--radius-sm)", outline: "none",
                  fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600,
                  padding: "6px 10px", width: "130px", textAlign: "right",
                  color: form.pagado ? "#4ADE80" : "var(--text-muted)",
                  transition: "color 0.15s"
                }}
              />
            </div>
            {/* Preview formateado mientras no está en foco */}
            {montoRaw && !form.pagado && (
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                Monto registrado: {formatCOP(montoRaw)} · sin marcar como pagado
              </div>
            )}
          </div>

          {/* Urgente */}
          <label className={`modal-checkbox-label${form.urgente ? " checked" : ""}`}>
            <input
              type="checkbox"
              checked={form.urgente}
              onChange={e => campo("urgente", e.target.checked)}
              style={{ width: 15, height: 15 }}
            />
            Marcar como urgente
          </label>

          {/* Notas */}
          <div className="modal-field" style={{ marginBottom: 0 }}>
            <label className="modal-label">Notas internas</label>
            <textarea
              className="modal-textarea"
              value={form.notas}
              onChange={e => campo("notas", e.target.value)}
              placeholder="Referencias, ideas, pendientes..."
              rows={3}
            />
          </div>

          {/* Fechas con hora */}
          <div style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "3px", paddingTop: "4px", borderTop: "1px solid var(--border)" }}>
            <span>Creado: {fechaHora(form.creadoEn)}</span>
            {form.actualizadoEn !== form.creadoEn && (
              <span>Modificado: {fechaHora(form.actualizadoEn)}</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", gap: "8px" }}>
          <button
            className="btn-primary"
            onClick={guardar}
            style={{ flex: 1, justifyContent: "center", opacity: dirty ? 1 : 0.5 }}
            disabled={!dirty}
          >
            {dirty ? "Guardar cambios" : "Sin cambios"}
          </button>
          <button
            onClick={() => { onEliminar(rumba.id); onCerrar(); }}
            style={{
              padding: "9px 14px", borderRadius: "var(--radius-md)",
              background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)",
              color: "var(--red-400)", cursor: "pointer", transition: "background 0.15s", display: "flex", alignItems: "center"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(220,38,38,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(220,38,38,0.08)"}
          >
            <img src="https://img.icons8.com/material/14/F87171/trash--v1.png" alt="Eliminar" style={{ width: 14, height: 14 }} />
          </button>
        </div>

      </div>

      <style>{`
        @keyframes detalleIn {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 12px)) scale(0.97); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  );
}

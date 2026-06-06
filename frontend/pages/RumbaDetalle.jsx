// ============================================
// RumbaDetalle.jsx — panel de edición de Rumba
// Se abre al hacer clic en cualquier fila
// ============================================

import React, { useState, useEffect } from "react";
import "../styles/ModalStyle.css";

const TIPOS = ["Producción", "Mix & Master", "Composición", "Grabación", "Edición", "Colaboración"];
const ESTADOS = ["Pendiente", "En progreso", "En revisión", "Completado", "Archivado"];

const CLASE_ESTADO = {
    "Pendiente": "available",
    "En progreso": "negotiation",
    "En revisión": "licensed",
    "Completado": "licensed",
    "Archivado": "exclusive"
};

export default function RumbaDetalle({ rumba, clientes, onGuardar, onEliminar, onCerrar, onCrearCliente }) {
    const [form, setForm] = useState(null);
    const [dirty, setDirty] = useState(false); // hay cambios sin guardar

    // Sincronizar form cuando cambia la rumba abierta
    useEffect(() => {
        if (rumba) {
            setForm({ ...rumba });
            setDirty(false);
        }
    }, [rumba?.id]);

    if (!rumba || !form) return null;

    const campo = (k, v) => {
        setForm(f => ({ ...f, [k]: v }));
        setDirty(true);
    };

    const guardar = () => {
        onGuardar(form.id, form);
        setDirty(false);
    };

    const clienteActual = clientes.find(c => c.id === form.cliente?.id);

    return (
        <>
            {/* Overlay de cierre */}
            <div
                style={{ position: "fixed", inset: 0, zIndex: 190, background: "rgba(0,0,0,0.4)" }}
                onClick={() => { if (dirty) guardar(); onCerrar(); }}
            />

            {/* Panel lateral */}
            <div style={{
                position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 195,
                width: "420px", background: "var(--bg-card)",
                borderLeft: "1px solid var(--border-mid)",
                display: "flex", flexDirection: "column",
                boxShadow: "-8px 0 32px rgba(0,0,0,0.4)",
                animation: "slideIn 0.2s cubic-bezier(0.16,1,0.3,1)"
            }}>

                {/* Header */}
                <div style={{
                    padding: "20px 24px", borderBottom: "1px solid var(--border)",
                    display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px"
                }}>
                    <div style={{ flex: 1 }}>
                        <input
                            value={form.nombre}
                            onChange={e => campo("nombre", e.target.value)}
                            style={{
                                background: "none", border: "none", outline: "none",
                                fontSize: "18px", fontWeight: 800, letterSpacing: "-0.5px",
                                color: "var(--text-primary)", fontFamily: "Inter, sans-serif",
                                width: "100%"
                            }}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                            <span className={`status-badge ${CLASE_ESTADO[form.estado] || "available"}`}>
                                {form.estado}
                            </span>
                            {form.urgente && <span className="badge-urgent">Urgente</span>}
                            {form.ep && <span className="badge-ep">{form.ep}</span>}
                        </div>
                    </div>
                    <button className="modal-close" onClick={() => { if (dirty) guardar(); onCerrar(); }}>✕</button>
                </div>

                {/* Cuerpo scrolleable */}
                <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>

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

                    {/* Cliente */}
                    <div className="modal-field" style={{ marginBottom: 0 }}>
                        <label className="modal-label">Cliente</label>
                        <select
                            className="modal-select"
                            value={form.cliente?.id || ""}
                            onChange={e => {
                                if (e.target.value === "__nuevo__") {
                                    onCrearCliente((nuevoCliente) => campo("cliente", { id: nuevoCliente.id, nombre: nuevoCliente.nombre }));
                                } else if (e.target.value === "") {
                                    campo("cliente", null);
                                } else {
                                    const c = clientes.find(x => x.id === parseInt(e.target.value));
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

                    {/* Pago */}
                    <div style={{
                        background: "var(--bg-surface)", border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)", padding: "14px 16px",
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px"
                    }}>
                        <label className="modal-checkbox-label" style={{
                            padding: 0, background: "none", border: "none",
                            flex: 1, cursor: "pointer"
                        }}>
                            <input
                                type="checkbox"
                                checked={form.pagado}
                                onChange={e => campo("pagado", e.target.checked)}
                                style={{ accentColor: "var(--red-500)", width: 15, height: 15 }}
                            />
                            <span style={{ fontWeight: 600, fontSize: "13px" }}>Marcado como pagado</span>
                        </label>
                        <input
                            className="modal-input"
                            value={form.montoPago}
                            onChange={e => campo("montoPago", e.target.value)}
                            placeholder="Monto"
                            style={{ width: "120px", textAlign: "right", color: form.pagado ? "#4ADE80" : "var(--text-muted)" }}
                        />
                    </div>

                    {/* Urgente */}
                    <label className={`modal-checkbox-label${form.urgente ? " checked" : ""}`}>
                        <input
                            type="checkbox"
                            checked={form.urgente}
                            onChange={e => campo("urgente", e.target.checked)}
                            style={{ accentColor: "var(--red-500)", width: 15, height: 15 }}
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
                            rows={4}
                        />
                    </div>

                    {/* Meta info */}
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span>Creado: {new Date(form.creadoEn).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}</span>
                        {form.actualizadoEn !== form.creadoEn && (
                            <span>Actualizado: {new Date(form.actualizadoEn).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}</span>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: "16px 24px", borderTop: "1px solid var(--border)",
                    display: "flex", gap: "8px"
                }}>
                    <button
                        className="btn-primary" onClick={guardar}
                        style={{ flex: 1, justifyContent: "center", opacity: dirty ? 1 : 0.5 }}
                        disabled={!dirty}
                    >
                        {dirty ? "Guardar cambios" : "Sin cambios"}
                    </button>
                    <button
                        onClick={() => { onEliminar(form.id); onCerrar(); }}
                        style={{
                            padding: "9px 14px", borderRadius: "var(--radius-md)",
                            background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)",
                            color: "var(--red-400)", cursor: "pointer", transition: "background 0.15s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(220,38,38,0.16)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(220,38,38,0.08)"}
                    >
                        <img src="https://img.icons8.com/material/14/F87171/trash--v1.png" alt="" style={{ width: 14, height: 14 }} />
                    </button>
                </div>

            </div>

            <style>{`
        @keyframes slideIn {
          from { transform: translateX(24px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
        </>
    );
}
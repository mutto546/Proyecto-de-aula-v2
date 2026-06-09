// ============================================
// ClientesSection.jsx — conectado a la API
// El filtro por usuario lo maneja el JWT en el servidor
// ============================================

import React, { useState, useEffect, useRef } from "react";
import "../styles/ModalStyle.css";

const FORM_VACIO = { nombre: "", instagram: "", telefono: "", notas: "" };

export default function ClientesSection({ rumbas = [], clientes, cargando, error, agregarCliente, actualizarCliente, eliminarCliente }) {

  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState(FORM_VACIO);
  const [idEditando, setId]     = useState(null);
  const [errorForm, setErrorForm] = useState("");
  const [guardando, setGuardando] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (modal) setTimeout(() => inputRef.current?.focus(), 50);
  }, [modal]);

  const abrirNuevo = () => {
    setId(null);
    setForm(FORM_VACIO);
    setErrorForm("");
    setModal(true);
  };

  const abrirEditar = (c) => {
    setId(c.id);
    setForm({ nombre: c.nombre, instagram: c.instagram || "", telefono: c.telefono || "", notas: c.notas || "" });
    setErrorForm("");
    setModal(true);
  };

  const guardarCliente = async () => {
    if (!form.nombre.trim()) { setErrorForm("El nombre es obligatorio."); return; }
    try {
      setGuardando(true);
      setErrorForm("");
      if (idEditando !== null) {
        await actualizarCliente(idEditando, form);
      } else {
        await agregarCliente(form);
      }
      setModal(false);
    } catch (e) {
      setErrorForm(e.message || "Error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este cliente?")) return;
    await eliminarCliente(id);
  };

  const campo = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Cuántas rumbas tiene cada cliente (calculado desde las rumbas del padre)
  const rumbasPorCliente = (clienteId) =>
    rumbas.filter(r => r.cliente?.id === clienteId).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <p className="label-eyebrow" style={{ color: "var(--red-500)", marginBottom: "6px" }}>Directorio</p>
          <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-1px" }}>Clientes</h1>
        </div>
        <button className="btn-add" onClick={abrirNuevo}>
          <img src="https://img.icons8.com/material/14/FFFFFF/plus-math--v1.png" alt="" style={{ width: 14, height: 14 }} />
          Nuevo cliente
        </button>
      </div>

      {/* Error de API */}
      {error && (
        <div style={{ padding: "10px 14px", background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "var(--radius-md)", color: "var(--red-400)", fontSize: "13px" }}>
          {error}
        </div>
      )}

      {/* Estado de carga */}
      {cargando ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "60px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
          Cargando clientes...
        </div>
      ) : clientes.length === 0 ? (
        <div style={{ background: "var(--bg-card)", border: "1px dashed var(--border-mid)", borderRadius: "var(--radius-lg)", padding: "60px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
          Aún no tienes clientes registrados.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {clientes.map(c => (
            <div key={c.id} style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)", padding: "20px",
              display: "flex", flexDirection: "column", gap: "8px",
              animation: "slideUp 0.18s ease"
            }}>
              {/* Avatar + acciones */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: "rgba(220,38,38,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "15px", fontWeight: 700, color: "var(--red-400)"
                }}>
                  {c.nombre.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => abrirEditar(c)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", borderRadius: "4px" }}
                    title="Editar"
                  >
                    <img src="https://img.icons8.com/material/14/A1A1AA/edit--v1.png" alt="" style={{ width: 14, height: 14 }} />
                  </button>
                  <button
                    onClick={() => handleEliminar(c.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", borderRadius: "4px" }}
                    title="Eliminar"
                  >
                    <img src="https://img.icons8.com/material/14/F87171/trash--v1.png" alt="" style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.2px" }}>{c.nombre}</div>
              {c.instagram && <div className="text-xs-muted">@{c.instagram}</div>}
              {c.telefono  && <div className="text-xs-muted">{c.telefono}</div>}
              {c.notas     && <div className="text-xs-muted" style={{ fontStyle: "italic" }}>{c.notas}</div>}

              {/* Total rumbas */}
              <div style={{ marginTop: "4px", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
                <span className="text-xs-muted">
                  {rumbasPorCliente(c.id) || c.totalRumbas || 0} rumba{(rumbasPorCliente(c.id) || c.totalRumbas || 0) !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal crear / editar */}
      {modal && (
        <div className="modal-overlay active" onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{idEditando ? "Editar cliente" : "Nuevo cliente"}</span>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>

            <div className="modal-field">
              <label className="modal-label">Nombre artístico</label>
              <input
                ref={inputRef}
                className="modal-input"
                value={form.nombre}
                onChange={e => campo("nombre", e.target.value)}
                onKeyDown={e => e.key === "Enter" && guardarCliente()}
                placeholder="Ej: MIZ4R"
                style={errorForm ? { borderColor: "var(--red-500)" } : {}}
              />
              {errorForm && (
                <p style={{ color: "var(--red-400)", fontSize: "11px", marginTop: "4px" }}>{errorForm}</p>
              )}
            </div>

            <div className="modal-row">
              <div className="modal-field">
                <label className="modal-label">Instagram</label>
                <input
                  className="modal-input"
                  value={form.instagram}
                  onChange={e => campo("instagram", e.target.value)}
                  placeholder="sin @"
                />
              </div>
              <div className="modal-field">
                <label className="modal-label">Teléfono</label>
                <input
                  className="modal-input"
                  value={form.telefono}
                  onChange={e => campo("telefono", e.target.value)}
                  placeholder="Ej: 300..."
                />
              </div>
            </div>

            <div className="modal-field">
              <label className="modal-label">Notas</label>
              <input
                className="modal-input"
                value={form.notas}
                onChange={e => campo("notas", e.target.value)}
                placeholder="Referencias, estilo, preferencias..."
              />
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setModal(false)}>Cancelar</button>
              <button
                className="btn-primary"
                onClick={guardarCliente}
                disabled={guardando}
                style={{ opacity: guardando ? 0.7 : 1 }}
              >
                <span>{guardando ? "Guardando..." : idEditando ? "Guardar cambios" : "Agregar cliente"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

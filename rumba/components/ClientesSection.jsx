import React, { useState, useEffect, useRef } from "react";
import "../styles/ModalStyle.css";


// ============================================
// CLIENTES SECTION — ClientesSection.jsx
// ============================================

const FORM_VACIO = { nombre: "", instagram: "", telefono: "", notas: "" };

export default function ClientesSection({ userId }) {
  const [clientes, setClientes] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(FORM_VACIO);
  const [idEditando, setId] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const KEY = `rumba_clientes_${userId}`;

  useEffect(() => {
    const guardado = localStorage.getItem(KEY);
    setClientes(guardado ? JSON.parse(guardado) : []);
  }, []);

  useEffect(() => {
    if (modal) setTimeout(() => inputRef.current?.focus(), 50);
  }, [modal]);

  const guardar = (nuevos) => {
    setClientes(nuevos);
    localStorage.setItem(KEY, JSON.stringify(nuevos));
  };

  const abrirNuevo = () => {
    setId(null); setForm(FORM_VACIO); setError(""); setModal(true);
  };

  const abrirEditar = (id) => {
    const c = clientes.find(x => x.id === id);
    setId(id);
    setForm({ nombre: c.nombre, instagram: c.instagram || "", telefono: c.telefono || "", notas: c.notas || "" });
    setError(""); setModal(true);
  };

  const guardarCliente = () => {
    if (!form.nombre.trim()) { setError("El nombre es obligatorio."); return; }
    if (idEditando !== null) {
      guardar(clientes.map(c => c.id === idEditando ? { ...c, ...form } : c));
    } else {
      guardar([{ ...form, id: Date.now(), creadoEn: Date.now() }, ...clientes]);
    }
    setModal(false);
  };

  const eliminar = (id) => {
    if (!window.confirm("¿Eliminar este cliente?")) return;
    guardar(clientes.filter(c => c.id !== id));
  };

  const campo = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

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

      {clientes.length === 0 ? (
        <div style={{
          background: "var(--bg-card)", border: "1px dashed var(--border-mid)",
          borderRadius: "var(--radius-lg)", padding: "60px",
          textAlign: "center", color: "var(--text-muted)", fontSize: "13px"
        }}>
          Aún no tienes clientes registrados.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {clientes.map(c => (
            <div key={c.id} style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)", padding: "20px",
              display: "flex", flexDirection: "column", gap: "8px"
            }}>
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
                  <button onClick={() => abrirEditar(c.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", borderRadius: "4px" }}>
                    <img src="https://img.icons8.com/material/14/A1A1AA/edit--v1.png" alt="" style={{ width: 14, height: 14 }} />
                  </button>
                  <button onClick={() => eliminar(c.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", borderRadius: "4px" }}>
                    <img src="https://img.icons8.com/material/14/F87171/trash--v1.png" alt="" style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>
              <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.2px" }}>{c.nombre}</div>
              {c.instagram && <div className="text-xs-muted">@{c.instagram}</div>}
              {c.telefono && <div className="text-xs-muted">{c.telefono}</div>}
              {c.notas && <div className="text-xs-muted" style={{ marginTop: "4px", fontStyle: "italic" }}>{c.notas}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay active" onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{idEditando ? "Editar cliente" : "Nuevo cliente"}</span>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>

            <div className="modal-field">
              <label className="modal-label">Nombre artístico</label>
              <input ref={inputRef} className="modal-input" value={form.nombre}
                onChange={e => campo("nombre", e.target.value)}
                onKeyDown={e => e.key === "Enter" && guardarCliente()}
                placeholder="Ej: MIZ4R"
                style={error ? { borderColor: "var(--red-500)" } : {}} />
              {error && <p style={{ color: "var(--red-400)", fontSize: "11px", marginTop: "4px" }}>{error}</p>}
            </div>

            <div className="modal-row">
              <div className="modal-field">
                <label className="modal-label">Instagram</label>
                <input className="modal-input" value={form.instagram} onChange={e => campo("instagram", e.target.value)} placeholder="sin @" />
              </div>
              <div className="modal-field">
                <label className="modal-label">Teléfono</label>
                <input className="modal-input" value={form.telefono} onChange={e => campo("telefono", e.target.value)} placeholder="Ej: 300..." />
              </div>
            </div>

            <div className="modal-field">
              <label className="modal-label">Notas</label>
              <input className="modal-input" value={form.notas} onChange={e => campo("notas", e.target.value)} placeholder="Referencias, estilo, preferencias..." />
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={guardarCliente}>
                <span>{idEditando ? "Guardar cambios" : "Agregar cliente"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

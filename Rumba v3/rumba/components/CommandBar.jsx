// ============================================
// CommandBar.jsx — barra de comando rápida
// Estado controlado desde Dashboard (una sola instancia)
// ============================================

import React, { useState, useEffect, useRef } from "react";
import { detectarTipo } from "../hooks/useRumbas";
import "../styles/CommandBar.css";

const TIPOS = ["Producción", "Mix & Master", "Composición", "Grabación", "Edición", "Colaboración"];

const ICONO_TIPO = {
  "Producción":   "https://img.icons8.com/material/14/F87171/musical-notes--v1.png",
  "Mix & Master": "https://img.icons8.com/material/14/C4B5FD/tune--v1.png",
  "Composición":  "https://img.icons8.com/material/14/FCD34D/edit--v1.png",
  "Grabación":    "https://img.icons8.com/material/14/4ADE80/microphone--v1.png",
  "Edición":      "https://img.icons8.com/material/14/A1A1AA/scissors--v1.png",
  "Colaboración": "https://img.icons8.com/material/14/60A5FA/conference-call--v1.png",
};

// Props:
//   abierto       — booleano controlado por el padre
//   onAbrir       — callback para abrir
//   onCerrar      — callback para cerrar
//   onCrear(nombre, tipo) — callback al crear
export default function CommandBar({ abierto, onAbrir, onCerrar, onCrear, clientes = [] }) {
  const [texto, setTexto]           = useState("");
  const [tipoAuto, setTipoAuto]     = useState("Producción");
  const [tipoOverride, setOverride] = useState(null);
  const inputRef = useRef(null);

  const tipoFinal = tipoOverride || tipoAuto;

  // Ctrl+K — un solo listener, sin duplicación
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (!abierto) {
          // Resetear campos al abrir
          setTexto("");
          setTipoAuto("Producción");
          setOverride(null);
          onAbrir();
        }
      }
      if (e.key === "Escape" && abierto) {
        onCerrar();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [abierto, onAbrir, onCerrar]);

  // Foco al abrir
  useEffect(() => {
    if (abierto) {
      setTexto("");
      setTipoAuto("Producción");
      setOverride(null);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [abierto]);

  const handleInput = (e) => {
    const val = e.target.value;
    setTexto(val);
    setOverride(null);
    setTipoAuto(detectarTipo(val));
  };

  const crear = () => {
    if (!texto.trim()) return;
    onCrear(texto.trim(), tipoFinal);
    onCerrar();
  };

  const handleKey = (e) => {
    if (e.key === "Enter") crear();
    if (e.key === "Escape") onCerrar();
  };

  if (!abierto) return null;

  return (
    <div className="cb-overlay" onClick={e => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="cb-box">

        <div className="cb-input-row">
          <img src="https://img.icons8.com/material/18/A1A1AA/search--v1.png" alt="" style={{ width: 18, height: 18, flexShrink: 0, opacity: 0.5 }} />
          <input
            ref={inputRef}
            className="cb-input"
            type="text"
            value={texto}
            onChange={handleInput}
            onKeyDown={handleKey}
            placeholder="Nombre del proyecto... y presiona Enter"
          />
          {texto && (
            <button className="cb-clear" onClick={() => { setTexto(""); inputRef.current?.focus(); }}>✕</button>
          )}
        </div>

        <div className="cb-meta">
          <div className="cb-meta-label">Tipo detectado:</div>
          <div className="cb-tipos">
            {TIPOS.map(t => (
              <button
                key={t}
                className={`cb-tipo-btn${tipoFinal === t ? " active" : ""}`}
                onClick={() => setOverride(t)}
              >
                <img src={ICONO_TIPO[t]} alt="" style={{ width: 12, height: 12 }} />
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="cb-footer">
          <span className="cb-hint">
            <span className="cb-kbd">Enter</span> crear
            <span style={{ margin: "0 8px", opacity: 0.3 }}>·</span>
            <span className="cb-kbd">Esc</span> cancelar
          </span>
          {texto && (
            <button className="btn-primary cb-btn-crear" onClick={crear}>
              Crear Rumba →
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

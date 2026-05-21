// ============================================
// Register.jsx — conectado a la API
// ============================================

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../utils/login";
import "../styles/global.css";
import logo from "../assets/logo.png";

export default function Register() {
  const [form, setForm]       = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const campo = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.username || !form.email || !form.password) {
      setError("Completa todos los campos.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await register(form);
      navigate("/app");
    } catch (err) {
      setError(err.message || "Error al registrarse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{
        width: "100%", maxWidth: "400px",
        background: "var(--bg-card)", border: "1px solid var(--border-mid)",
        borderRadius: "var(--radius-lg)", padding: "36px 32px",
        animation: "slideUp 0.2s ease"
      }}>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img src={logo} alt="Rumba" style={{ height: "32px", margin: "0 auto 16px" }} />
          <h1 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>Crear cuenta</h1>
          <p className="text-xs-muted" style={{ marginTop: "4px" }}>Empieza a organizar tu estudio</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          <div className="modal-row" style={{ marginBottom: 0 }}>
            <div className="modal-field" style={{ marginBottom: 0 }}>
              <label className="modal-label">Nombre</label>
              <input
                className="modal-input"
                type="text"
                placeholder="Brayan"
                value={form.name}
                onChange={e => campo("name", e.target.value)}
              />
            </div>
            <div className="modal-field" style={{ marginBottom: 0 }}>
              <label className="modal-label">Username</label>
              <input
                className="modal-input"
                type="text"
                placeholder="brayandeaviila"
                value={form.username}
                onChange={e => campo("username", e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
              />
            </div>
          </div>

          <div className="modal-field" style={{ marginBottom: 0 }}>
            <label className="modal-label">Email</label>
            <input
              className="modal-input"
              type="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={e => campo("email", e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="modal-field" style={{ marginBottom: 0 }}>
            <label className="modal-label">Contraseña</label>
            <input
              className="modal-input"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={e => campo("password", e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div style={{
              padding: "10px 12px", borderRadius: "var(--radius-sm)",
              background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)",
              color: "var(--red-400)", fontSize: "13px"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ justifyContent: "center", marginTop: "8px", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "var(--text-muted)" }}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" style={{ color: "var(--red-400)", fontWeight: 500 }}>
            Ingresar
          </Link>
        </p>

      </div>
    </div>
  );
}

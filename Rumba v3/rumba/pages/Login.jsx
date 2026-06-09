// ============================================
// Login.jsx — ojo ver/ocultar + recuperar contraseña
// Flujo: Login → Olvidé clave → Código en pantalla → Nueva clave
// ============================================

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/login";
import { auth, setToken, setUser } from "../services/api";
import "../styles/global.css";
import logo from "../assets/logo.png";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5228";

// Íconos ojo
const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// ── Pantalla 1: Login normal ──────────────────────────────────────
function PantallaLogin({ onForgot, navigate }) {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const campo = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Completa todos los campos."); return; }
    try {
      setLoading(true); setError("");
      await login(form.email, form.password);
      navigate("/app");
    } catch (err) {
      setError(err.message || "Credenciales incorrectas.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <img src={logo} alt="Rumba" style={{ height: "32px", margin: "0 auto 16px" }} />
        <h1 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>Ingresar</h1>
        <p className="text-xs-muted" style={{ marginTop: "4px" }}>Accede a tu estudio digital</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div className="modal-field" style={{ marginBottom: 0 }}>
          <label className="modal-label">Email</label>
          <input className="modal-input" type="email" placeholder="tu@gmail.com"
            value={form.email} onChange={e => campo("email", e.target.value)} autoComplete="email" />
        </div>

        <div className="modal-field" style={{ marginBottom: 0 }}>
          <label className="modal-label">Contraseña</label>
          <div style={{ position: "relative" }}>
            <input className="modal-input"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={e => campo("password", e.target.value)}
              autoComplete="current-password"
              style={{ paddingRight: "42px", width: "100%", boxSizing: "border-box" }}
            />
            <button type="button" onClick={() => setShowPass(v => !v)} tabIndex={-1}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
                display: "flex", alignItems: "center", padding: 0 }}>
              {showPass ? <EyeOff /> : <EyeOpen />}
            </button>
          </div>
        </div>

        {/* Olvidé mi contraseña */}
        <div style={{ textAlign: "right", marginTop: "-6px" }}>
          <button type="button" onClick={onForgot}
            style={{ background: "none", border: "none", cursor: "pointer",
              color: "var(--red-400)", fontSize: "12px", fontWeight: 500, padding: 0 }}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {error && (
          <div style={{ padding: "10px 12px", borderRadius: "var(--radius-sm)",
            background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)",
            color: "var(--red-400)", fontSize: "13px" }}>{error}</div>
        )}

        <button type="submit" className="btn-primary" disabled={loading}
          style={{ justifyContent: "center", marginTop: "8px", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "var(--text-muted)" }}>
        ¿No tienes cuenta?{" "}
        <Link to="/register" style={{ color: "var(--red-400)", fontWeight: 500 }}>Regístrate</Link>
      </p>
    </>
  );
}

// ── Pantalla 2: Ingresar email para recibir código ────────────────
function PantallaForgot({ onBack, onCodeSent }) {
  const [email, setEmail]     = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError("Ingresa tu email."); return; }
    try {
      setLoading(true); setError("");
      const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al solicitar código.");
      // Pasamos email y código al siguiente paso
      onCodeSent(email, data.code);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <img src={logo} alt="Rumba" style={{ height: "32px", margin: "0 auto 16px" }} />
        <h1 style={{ fontSize: "20px", fontWeight: 800 }}>Recuperar cuenta</h1>
        <p className="text-xs-muted" style={{ marginTop: "4px" }}>Ingresa tu email registrado</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div className="modal-field" style={{ marginBottom: 0 }}>
          <label className="modal-label">Email</label>
          <input className="modal-input" type="email" placeholder="tu@gmail.com"
            value={email} onChange={e => setEmail(e.target.value)} autoFocus />
        </div>

        {error && (
          <div style={{ padding: "10px 12px", borderRadius: "var(--radius-sm)",
            background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)",
            color: "var(--red-400)", fontSize: "13px" }}>{error}</div>
        )}

        <button type="submit" className="btn-primary" disabled={loading}
          style={{ justifyContent: "center", marginTop: "8px", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Buscando cuenta..." : "Enviar código"}
        </button>
      </form>

      <button onClick={onBack}
        style={{ display: "block", width: "100%", marginTop: "16px", background: "none",
          border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "13px" }}>
        ← Volver al login
      </button>
    </>
  );
}

// ── Pantalla 3: Mostrar código + ingresar código + nueva contraseña ─
function PantallaReset({ email, codigoGenerado, onBack, navigate }) {
  const [code, setCode]           = useState("");
  const [newPass, setNewPass]     = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [copiado, setCopiado]     = useState(false);

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoGenerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || !newPass) { setError("Completa todos los campos."); return; }
    if (newPass.length < 6) { setError("La nueva contraseña debe tener mínimo 6 caracteres."); return; }
    try {
      setLoading(true); setError("");
      const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: code.toUpperCase(), newPassword: newPass })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al cambiar contraseña.");
      // Guardar sesión y redirigir
      setToken(data.token);
      setUser(data.user);
      navigate("/app");
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <img src={logo} alt="Rumba" style={{ height: "32px", margin: "0 auto 16px" }} />
        <h1 style={{ fontSize: "20px", fontWeight: 800 }}>Nueva contraseña</h1>
        <p className="text-xs-muted" style={{ marginTop: "4px" }}>{email}</p>
      </div>

      {/* Caja con el código generado */}
      <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)",
        borderRadius: "var(--radius-sm)", padding: "14px 16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "12px", color: "#4ade80", marginBottom: "8px", fontWeight: 600 }}>
          🔑 Tu código temporal (válido 15 min)
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "6px", color: "#4ade80" }}>
            {codigoGenerado}
          </span>
          <button type="button" onClick={copiarCodigo}
            style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: "6px", padding: "4px 10px", cursor: "pointer",
              color: "#4ade80", fontSize: "12px", fontWeight: 600 }}>
            {copiado ? "✓ Copiado" : "Copiar"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div className="modal-field" style={{ marginBottom: 0 }}>
          <label className="modal-label">Ingresa el código</label>
          <input className="modal-input" type="text" placeholder="XXXXXX"
            value={code} onChange={e => setCode(e.target.value.toUpperCase())}
            maxLength={6} style={{ letterSpacing: "4px", fontWeight: 700, fontSize: "18px" }} />
        </div>

        <div className="modal-field" style={{ marginBottom: 0 }}>
          <label className="modal-label">Nueva contraseña</label>
          <div style={{ position: "relative" }}>
            <input className="modal-input"
              type={showPass ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              value={newPass} onChange={e => setNewPass(e.target.value)}
              style={{ paddingRight: "42px", width: "100%", boxSizing: "border-box" }} />
            <button type="button" onClick={() => setShowPass(v => !v)} tabIndex={-1}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
                display: "flex", alignItems: "center", padding: 0 }}>
              {showPass ? <EyeOff /> : <EyeOpen />}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: "10px 12px", borderRadius: "var(--radius-sm)",
            background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)",
            color: "var(--red-400)", fontSize: "13px" }}>{error}</div>
        )}

        <button type="submit" className="btn-primary" disabled={loading}
          style={{ justifyContent: "center", marginTop: "8px", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Guardando..." : "Cambiar contraseña e ingresar"}
        </button>
      </form>

      <button onClick={onBack}
        style={{ display: "block", width: "100%", marginTop: "16px", background: "none",
          border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "13px" }}>
        ← Volver
      </button>
    </>
  );
}

// ── Componente principal ─────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  // pantalla: "login" | "forgot" | "reset"
  const [pantalla, setPantalla]             = useState("login");
  const [resetEmail, setResetEmail]         = useState("");
  const [resetCodigo, setResetCodigo]       = useState("");

  const handleCodeSent = (email, code) => {
    setResetEmail(email);
    setResetCodigo(code);
    setPantalla("reset");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "380px",
        background: "var(--bg-card)", border: "1px solid var(--border-mid)",
        borderRadius: "var(--radius-lg)", padding: "36px 32px",
        animation: "slideUp 0.2s ease" }}>

        {pantalla === "login"  && <PantallaLogin  onForgot={() => setPantalla("forgot")} navigate={navigate} />}
        {pantalla === "forgot" && <PantallaForgot onBack={() => setPantalla("login")} onCodeSent={handleCodeSent} />}
        {pantalla === "reset"  && <PantallaReset  email={resetEmail} codigoGenerado={resetCodigo}
                                    onBack={() => setPantalla("forgot")} navigate={navigate} />}
      </div>
    </div>
  );
}

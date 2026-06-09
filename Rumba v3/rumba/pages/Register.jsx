// ============================================
// Register.jsx — con validación Gmail, show/hide password y cifrado BCrypt (backend)
// ============================================

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../utils/login";
import "../styles/global.css";
import logo from "../assets/logo.png";

// Ícono ojo abierto
const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

// Ícono ojo cerrado
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// Validación estricta de Gmail
function isValidGmail(email) {
  return /^[a-zA-Z0-9._%+\-]+@gmail\.com$/.test(email.trim());
}

export default function Register() {
  const [form, setForm]           = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const navigate = useNavigate();

  const campo = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Fuerza de contraseña
  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    let score = 0;
    if (pwd.length >= 6)  score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    if (score <= 1) return { label: "Débil", color: "#ef4444", width: "25%" };
    if (score <= 3) return { label: "Media", color: "#f59e0b", width: "60%" };
    return { label: "Fuerte", color: "#22c55e", width: "100%" };
  };

  const strength = getPasswordStrength(form.password);

  const gmailError = emailTouched && form.email && !isValidGmail(form.email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.username || !form.email || !form.password) {
      setError("Completa todos los campos.");
      return;
    }
    if (!isValidGmail(form.email)) {
      setError("El correo debe ser una cuenta de Gmail válida (ejemplo@gmail.com).");
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

          {/* Nombre + Username */}
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
                placeholder="brayandeavilla"
                value={form.username}
                onChange={e => campo("username", e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
              />
            </div>
          </div>

          {/* Email — solo Gmail */}
          <div className="modal-field" style={{ marginBottom: 0 }}>
            <label className="modal-label">Gmail</label>
            <input
              className="modal-input"
              type="email"
              placeholder="tucuenta@gmail.com"
              value={form.email}
              onChange={e => campo("email", e.target.value)}
              onBlur={() => setEmailTouched(true)}
              autoComplete="email"
              style={{
                borderColor: gmailError ? "rgba(220,38,38,0.6)" : undefined,
                boxShadow: gmailError ? "0 0 0 3px rgba(220,38,38,0.1)" : undefined
              }}
            />
            {gmailError && (
              <p style={{ fontSize: "12px", color: "var(--red-400)", marginTop: "4px" }}>
                Solo se aceptan cuentas @gmail.com
              </p>
            )}
          </div>

          {/* Contraseña con ojo */}
          <div className="modal-field" style={{ marginBottom: 0 }}>
            <label className="modal-label">Contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                className="modal-input"
                type={showPass ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={e => campo("password", e.target.value)}
                autoComplete="new-password"
                style={{ paddingRight: "42px", width: "100%", boxSizing: "border-box" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: "absolute", right: "12px", top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-muted)", display: "flex", alignItems: "center",
                  padding: 0
                }}
                tabIndex={-1}
                aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPass ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>

            {/* Barra de fuerza */}
            {form.password && strength && (
              <div style={{ marginTop: "8px" }}>
                <div style={{
                  height: "4px", borderRadius: "99px",
                  background: "var(--border-mid)", overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%", borderRadius: "99px",
                    width: strength.width, background: strength.color,
                    transition: "width 0.3s ease, background 0.3s ease"
                  }} />
                </div>
                <p style={{ fontSize: "11px", color: strength.color, marginTop: "4px", textAlign: "right" }}>
                  {strength.label}
                </p>
              </div>
            )}
          </div>

          {/* Nota cifrado */}
          <p style={{
            fontSize: "11px", color: "var(--text-muted)",
            display: "flex", alignItems: "center", gap: "5px"
          }}>
            <span>🔒</span> Tu contraseña se almacena cifrada con BCrypt
          </p>

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

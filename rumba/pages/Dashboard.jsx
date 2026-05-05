
// Keyframes inyectados globalmente una sola vez
if (typeof document !== "undefined" && !document.getElementById("rumba-keyframes")) {
  const style = document.createElement("style");
  style.id = "rumba-keyframes";
  style.textContent = `
    @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes popIn   { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  `;
  document.head.appendChild(style);
}

// ============================================
// Dashboard.jsx — contenedor principal
// ============================================

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../styles/ModalStyle.css";
import logo from "../assets/logo.png";
import { getSession, logout } from "../utils/login";
import { useRumbas } from "../hooks/useRumbas";
import { useClientes } from "../hooks/useClientes";
import RumbasSection from "../components/RumbasSection";
import ClientesSection from "../components/ClientesSection";
import CommandBar from "../components/CommandBar";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState("inicio");
  const [cbAbierto, setCbAbierto] = useState(false);
  const navigate = useNavigate();

  // 🔐 Proteger ruta
  useEffect(() => {
    const session = getSession();
    if (!session) navigate("/login");
    else setUser(session);
  }, []);

  const { rumbas, crearRapido, actualizar, eliminar, completar, metricas } = useRumbas(user?.id);
  const { clientes, agregarCliente } = useClientes(user?.id);

  // Crear cliente en el momento desde RumbaDetalle
  const handleCrearCliente = (callback) => {
    const nombre = window.prompt("Nombre del cliente:");
    if (!nombre?.trim()) return;
    const nuevo = agregarCliente({ nombre: nombre.trim(), instagram: "", telefono: "", notas: "" });
    callback?.(nuevo);
  };

  if (!user) return null;

  const recientes = [...rumbas].sort((a, b) => b.creadoEn - a.creadoEn).slice(0, 5);

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden", animation: "fadeIn 0.25s ease" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: "220px", minWidth: "220px",
        background: "#111113",
        padding: "24px 16px",
        borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", gap: "0",
        overflowY: "auto"
      }}>
        <div style={{ marginBottom: "32px", paddingLeft: "8px" }}>
          <img src={logo} className="logo-img" style={{ height: "28px" }} alt="Rumba" />
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          <SidebarItem label="Inicio" icon="https://img.icons8.com/material/18/FFFFFF/home--v1.png" active={section === "inicio"} onClick={() => setSection("inicio")} />
          <SidebarItem label="Rumbas" icon="https://img.icons8.com/material/18/FFFFFF/musical-notes--v1.png" active={section === "rumbas"} onClick={() => setSection("rumbas")} />
          <SidebarItem label="Clientes" icon="https://img.icons8.com/material/18/FFFFFF/conference-call--v1.png" active={section === "clientes"} onClick={() => setSection("clientes")} />
          <SidebarItem label="Ingresos" icon="https://img.icons8.com/material/18/FFFFFF/coin-in-hand--v1.png" active={section === "ingresos"} onClick={() => setSection("ingresos")} />
          <SidebarItem label="Contratos" icon="https://img.icons8.com/material/18/FFFFFF/google-docs--v1.png" active={section === "contratos"} onClick={() => setSection("contratos")} />
        </nav>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ paddingLeft: "8px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{user.name}</div>
            <div className="text-xs-muted">@{user.username}</div>
          </div>
          <LogoutBtn onClick={() => { logout(); navigate("/login"); }} />
        </div>
      </aside>

      {/* CONTENIDO */}
      <main key={section} style={{ flex: 1, overflowY: "auto", padding: "40px 48px", display: "flex", flexDirection: "column", gap: "32px", animation: "slideUp 0.22s ease" }}>

        {section === "inicio" && (
          <InicioSection
            user={user}
            metricas={metricas}
            recientes={recientes}
            onVerRumbas={() => setSection("rumbas")}
          />
        )}

        {section === "rumbas" && (
          <RumbasSection
            rumbas={rumbas}
            crearRapido={crearRapido}
            actualizar={actualizar}
            eliminar={eliminar}
            completar={completar}
            clientes={clientes}
            onCrearCliente={handleCrearCliente}
            onAbrirCommandBar={() => setCbAbierto(true)}
          />
        )}

        {section === "clientes" && (
          <ClientesSection userId={user.id} rumbas={rumbas} />
        )}

        {section === "ingresos" && <SeccionProxima titulo="Ingresos" desc="Registro de pagos y métricas mensuales." />}
        {section === "contratos" && <SeccionProxima titulo="Contratos" desc="Generación de PDFs de licencias." />}

      </main>

      {/* CommandBar — una sola instancia, controlada desde Dashboard */}
      <CommandBar
        abierto={cbAbierto}
        onAbrir={() => setCbAbierto(true)}
        onCerrar={() => setCbAbierto(false)}
        onCrear={(nombre, tipo) => {
          const nueva = crearRapido(nombre);
          if (nueva && tipo && tipo !== nueva.tipo) actualizar(nueva.id, { tipo });
          if (section !== "rumbas") setSection("rumbas");
          setCbAbierto(false);
        }}
        clientes={clientes}
      />
    </div>
  );
}

// --- Sección inicio ---
function InicioSection({ user, metricas, recientes, onVerRumbas }) {
  const CLASE_ESTADO = { "Pendiente": "available", "En progreso": "negotiation", "En revisión": "licensed", "Completado": "licensed", "Archivado": "exclusive" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <p className="label-eyebrow" style={{ color: "var(--red-500)", marginBottom: "6px" }}>Panel principal</p>
        <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "4px" }}>
          Hola, {user.name} 👋
        </h1>
        <p className="text-xs-muted">Bienvenido a tu estudio digital.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        <MetricCard label="Ingresos del mes" value={`$${metricas.ingresosMes.toLocaleString("es-CO")}`} icon="https://img.icons8.com/material/22/4ADE80/coin-in-hand--v1.png" color="#4ADE80" />
        <MetricCard label="Rumbas activas" value={metricas.activas} icon="https://img.icons8.com/material/22/C4B5FD/musical-notes--v1.png" color="#C4B5FD" />
        <MetricCard label="Completadas" value={metricas.completadas} icon="https://img.icons8.com/material/22/FCD34D/checkmark--v1.png" color="#FCD34D" />
        <MetricCard label="Urgentes" value={metricas.urgentes} icon="https://img.icons8.com/material/22/F87171/lightning-bolt--v1.png" color="#F87171" />
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.3px" }}>Actividad reciente</h2>
          <button onClick={onVerRumbas} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: "var(--red-400)", fontFamily: "Inter,sans-serif" }}>
            Ver todas →
          </button>
        </div>

        {recientes.length === 0 ? (
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)", padding: "40px",
            textAlign: "center", color: "var(--text-muted)", fontSize: "13px"
          }}>
            Aún no tienes rumbas. Presiona{" "}
            <span className="kbd" style={{ fontSize: "10px" }}>Ctrl+K</span>{" "}
            para crear la primera.
          </div>
        ) : (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            {recientes.map((r, i) => (
              <div key={r.id} style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr 120px",
                padding: "12px 20px", alignItems: "center",
                borderBottom: i === recientes.length - 1 ? "none" : "1px solid var(--border)",
                fontSize: "13px", gap: "8px"
              }}>
                <div>
                  <div className="text-bold-sm">{r.nombre}</div>
                  <div className="text-xs-muted">{r.tipo}</div>
                </div>
                <span className="cell-muted">{r.cliente?.nombre || "—"}</span>
                <span className="cell-muted">{r.fechaEntrega || "—"}</span>
                <span><span className={`status-badge ${CLASE_ESTADO[r.estado] || "available"}`}>{r.estado}</span></span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Componentes de soporte ---
function SidebarItem({ label, icon, active, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "9px 10px", borderRadius: "var(--radius-sm)",
        background: active ? "rgba(220,38,38,0.12)" : hover ? "rgba(255,255,255,0.05)" : "transparent",
        border: "none", borderLeft: active ? "2px solid var(--red-500)" : "2px solid transparent",
        color: active ? "var(--red-400)" : hover ? "var(--text-primary)" : "var(--text-muted)",
        fontSize: "13px", fontWeight: active ? 600 : 400,
        cursor: "pointer", textAlign: "left", width: "100%",
        fontFamily: "Inter, sans-serif", transition: "all 0.15s"
      }}
    >
      <img src={icon} alt="" style={{ width: 18, height: 18, opacity: active ? 1 : 0.6 }} />
      {label}
    </button>
  );
}

function LogoutBtn({ onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "8px 10px", borderRadius: "var(--radius-sm)",
        background: hover ? "rgba(220,38,38,0.1)" : "transparent",
        border: "none", color: hover ? "var(--red-400)" : "var(--text-muted)",
        fontSize: "13px", cursor: "pointer", fontFamily: "Inter, sans-serif",
        transition: "all 0.15s", width: "100%", textAlign: "left"
      }}
    >
      <img src="https://img.icons8.com/material/16/F87171/exit--v1.png" alt="" style={{ width: 16, height: 16 }} />
      Cerrar sesión
    </button>
  );
}

function MetricCard({ label, value, icon, color }) {
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)", padding: "20px",
      display: "flex", flexDirection: "column", gap: "12px"
    }}>
      <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={icon} alt="" style={{ width: 22, height: 22 }} />
      </div>
      <div>
        <div className="text-xs-muted" style={{ marginBottom: "4px" }}>{label}</div>
        <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", color }}>{value}</div>
      </div>
    </div>
  );
}

function SeccionProxima({ titulo, desc }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <p className="label-eyebrow" style={{ color: "var(--red-500)" }}>Próximamente</p>
      <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-1px" }}>{titulo}</h1>
      <p className="text-xs-muted">{desc}</p>
      <div style={{ marginTop: "24px", background: "var(--bg-card)", border: "1px dashed var(--border-mid)", borderRadius: "var(--radius-lg)", padding: "60px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
        Esta sección está en desarrollo.
      </div>
    </div>
  );
}

// ============================================
// Dashboard.jsx — conectado a la API
// Rediseño glassmorphism + gráficos SVG animados
// ============================================

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/global.css";
import "../styles/style2.css";
import "../styles/ModalStyle.css";
import logo from "../assets/logo.png";
import { getSession, logout, verificarSesion } from "../utils/login";
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

  const { rumbas, metricas, cargando: cargandoRumbas, crearRapido, actualizar, eliminar, completar } = useRumbas();
  const { clientes, cargando: cargandoClientes, error: errorClientes, agregarCliente, actualizarCliente, eliminarCliente } = useClientes();

  useEffect(() => {
    const session = getSession();
    if (!session) { navigate("/login"); return; }
    setUser(session);
    verificarSesion().then(u => {
      if (!u) navigate("/login");
      else setUser(u);
    });
  }, []);

  const handleCrearCliente = async (callback) => {
    const nombre = window.prompt("Nombre del cliente:");
    if (!nombre?.trim()) return;
    const nuevo = await agregarCliente({ nombre: nombre.trim(), instagram: "", telefono: "", notas: "" });
    if (nuevo) callback?.(nuevo);
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  if (!user) return null;
  const recientes = [...rumbas].slice(0, 5);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", animation: "fadeIn 0.25s ease" }}>

      {/* SIDEBAR */}
      <aside className="dash-sidebar">
        <div style={{ marginBottom: 32, paddingLeft: 8, display: "flex", alignItems: "center", gap: 10 }}>
          {/* <img src={logo} className="logo-img" style={{ height: 28 }} alt="Rumba" /> */}
          <Link to="/" className="nav-logo">
            <img className="logo-img" src={logo} alt="Rumba" style={{ height: 40 }} />
          </Link>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <SidebarItem label="Inicio" icon="https://img.icons8.com/material/18/FFFFFF/home--v1.png" active={section === "inicio"} onClick={() => setSection("inicio")} />
          <SidebarItem label="Rumbas" icon="https://img.icons8.com/material/18/FFFFFF/musical-notes--v1.png" active={section === "rumbas"} onClick={() => setSection("rumbas")} />
          <SidebarItem label="Clientes" icon="https://img.icons8.com/material/18/FFFFFF/conference-call--v1.png" active={section === "clientes"} onClick={() => setSection("clientes")} />
          <SidebarItem label="Ingresos" icon="https://img.icons8.com/material/18/FFFFFF/coin-in-hand--v1.png" active={section === "ingresos"} onClick={() => setSection("ingresos")} />
          <SidebarItem label="Contratos" icon="https://img.icons8.com/material/18/FFFFFF/google-docs--v1.png" active={section === "contratos"} onClick={() => setSection("contratos")} />
        </nav>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ paddingLeft: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{user.name}</div>
            <div className="text-xs-muted">@{user.username}</div>
          </div>
          <LogoutBtn onClick={handleLogout} />
        </div>
      </aside>

      {/* CONTENIDO */}
      <main
        key={section}
        style={{ flex: 1, overflowY: "auto", padding: "36px 44px", display: "flex", flexDirection: "column", gap: 28, animation: "slideUp 0.22s ease" }}
      >
        {section === "inicio" && (
          <InicioSection
            user={user}
            metricas={metricas}
            rumbas={rumbas}
            recientes={recientes}
            cargando={cargandoRumbas}
            onVerRumbas={() => setSection("rumbas")}
          />
        )}

        {section === "rumbas" && (
          <RumbasSection
            rumbas={rumbas}
            cargando={cargandoRumbas}
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
          <ClientesSection
            rumbas={rumbas}
            clientes={clientes}
            cargando={cargandoClientes}
            error={errorClientes}
            agregarCliente={agregarCliente}
            actualizarCliente={actualizarCliente}
            eliminarCliente={eliminarCliente}
          />
        )}

        {section === "ingresos" && <SeccionProxima titulo="Ingresos" desc="Registro de pagos y métricas mensuales." />}
        {section === "contratos" && <SeccionProxima titulo="Contratos" desc="Generación de PDFs de licencias." />}
      </main>

      <CommandBar
        abierto={cbAbierto}
        onAbrir={() => setCbAbierto(true)}
        onCerrar={() => setCbAbierto(false)}
        onCrear={(nombre, tipo) => {
          crearRapido(nombre, tipo);
          if (section !== "rumbas") setSection("rumbas");
          setCbAbierto(false);
        }}
        clientes={clientes}
      />
    </div>
  );
}

/* ============================================
   SECCIÓN INICIO con gráficos animados
   ============================================ */
function InicioSection({ user, metricas, rumbas, recientes, cargando, onVerRumbas }) {
  const CLASE_ESTADO = {
    "Pendiente": "available", "En progreso": "negotiation",
    "En revisión": "licensed", "Completado": "licensed", "Archivado": "exclusive"
  };

  // Datos derivados para gráficos
  const porTipo = useMemo(() => {
    const acc = {};
    rumbas.forEach(r => { acc[r.tipo] = (acc[r.tipo] || 0) + 1; });
    return Object.entries(acc).map(([k, v]) => ({ label: k, value: v }));
  }, [rumbas]);

  const porEstado = useMemo(() => {
    const acc = { "Pendiente": 0, "En progreso": 0, "En revisión": 0, "Completado": 0, "Archivado": 0 };
    rumbas.forEach(r => { if (acc[r.estado] !== undefined) acc[r.estado]++; });
    return acc;
  }, [rumbas]);

  // Sparkline ficticio basado en métricas (últimos 7 puntos)
  const sparkValues = useMemo(() => {
    const base = metricas.activas || 4;
    return Array.from({ length: 7 }, (_, i) => Math.max(1, Math.round(base + Math.sin(i * 1.1) * 3 + (i % 2))));
  }, [metricas]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Hero */}
      <div className="dash-hero animate-fade-up">
        <p className="label-eyebrow" style={{ color: "var(--red-400)", margin: 0 }}>Panel principal</p>
        <h1>Hola, {user.name} </h1>
        <p className="text-xs-muted" style={{ margin: 0 }}>Bienvenido a tu estudio digital — todo bajo control.</p>
      </div>

      {/* Métricas con sparkline */}
      <div className="metric-grid">
        <MetricCard label="Ingresos del mes" value={`$${(metricas.ingresosMes || 0).toLocaleString("es-CO")}`} color="#4ADE80" icon="https://img.icons8.com/material/22/4ADE80/coin-in-hand--v1.png" spark={sparkValues} />
        <MetricCard label="Rumbas activas" value={metricas.activas || 0} color="#C4B5FD" icon="https://img.icons8.com/material/22/C4B5FD/musical-notes--v1.png" spark={sparkValues.map(v => v + 1)} />
        <MetricCard label="Completadas" value={metricas.completadas || 0} color="#FCD34D" icon="https://img.icons8.com/material/22/FCD34D/checkmark--v1.png" spark={sparkValues.map(v => Math.max(0, v - 2))} />
        <MetricCard label="Urgentes" value={metricas.urgentes || 0} color="#F87171" icon="https://img.icons8.com/material/22/F87171/lightning-bolt--v1.png" spark={sparkValues.map(v => Math.round(v * 0.6))} />
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        <div className="glass-card chart-card animate-fade-up">
          <h3>Distribución por tipo</h3>
          <p className="sub">Cantidad de proyectos según tipo de trabajo.</p>
          <BarChart data={porTipo.length ? porTipo : [{ label: "—", value: 0 }]} />
        </div>
        <div className="glass-card chart-card animate-fade-up">
          <h3>Estado de proyectos</h3>
          <p className="sub">Avance global del estudio.</p>
          <DonutChart segments={[
            { label: "Pendiente", value: porEstado["Pendiente"], color: "#4ADE80" },
            { label: "En progreso", value: porEstado["En progreso"], color: "#C4B5FD" },
            { label: "Revisión", value: porEstado["En revisión"], color: "#FCD34D" },
            { label: "Completado", value: porEstado["Completado"], color: "#F87171" },
          ]} />
        </div>
      </div>

      {/* Actividad reciente */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.3px", margin: 0 }}>Actividad reciente</h2>
          <button className="link-btn" onClick={onVerRumbas}>Ver todas →</button>
        </div>

        {cargando ? (
          <div className="glass-card" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>Cargando...</div>
        ) : recientes.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            Aún no tienes rumbas. Presiona <span className="kbd" style={{ fontSize: 10 }}>Ctrl+K</span> para crear la primera.
          </div>
        ) : (
          <div className="glass-card activity-list">
            {recientes.map((r) => (
              <div key={r.id} className="activity-row">
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

/* ============================================
   GRÁFICOS SVG (sin librerías)
   ============================================ */
function Sparkline({ values, color = "#dc2626" }) {
  const w = 110, h = 32, p = 2;
  if (!values?.length) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const step = (w - p * 2) / (values.length - 1);
  const points = values.map((v, i) => [p + i * step, h - p - ((v - min) / range) * (h - p * 2)]);
  const d = points.reduce((acc, [x, y], i) => acc + (i === 0 ? `M${x},${y}` : ` L${x},${y}`), "");
  const id = `g-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <svg className="spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <path className="spark-path" d={d} style={{ stroke: `url(#${id})` }} />
    </svg>
  );
}

function BarChart({ data }) {
  const w = 520, h = 180, padL = 32, padB = 28, padT = 12, padR = 8;
  const max = Math.max(...data.map(d => d.value), 1);
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const bw = Math.min(48, (innerW / data.length) * 0.55);
  const gap = (innerW - bw * data.length) / Math.max(data.length, 1);

  // ticks
  const ticks = 4;
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) => Math.round((max / ticks) * i));

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {tickVals.map((t, i) => {
        const y = padT + innerH - (t / max) * innerH;
        return (
          <g key={i}>
            <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />
            <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#71717a">{t}</text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const x = padL + gap / 2 + i * (bw + gap);
        const bh = (d.value / max) * innerH;
        const y = padT + innerH - bh;
        return (
          <g key={i}>
            <rect className="bar-rect" x={x} y={y} width={bw} height={bh} style={{ animationDelay: `${i * 80}ms` }}>
              <title>{d.label}: {d.value}</title>
            </rect>
            <text x={x + bw / 2} y={h - padB + 16} textAnchor="middle" fontSize="11" fill="#a1a1aa">{d.label}</text>
            <text x={x + bw / 2} y={y - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill="#f4f4f5">{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ segments }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const size = 200, stroke = 22, r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle className="donut-track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        {segments.map((s, i) => {
          const len = (s.value / total) * c;
          const seg = (
            <circle
              key={i}
              className="donut-seg"
              cx={size / 2} cy={size / 2} r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
          offset += len;
          return seg;
        })}
        <text x="50%" y="48%" textAnchor="middle" fontSize="28" fontWeight="800" fill="#f4f4f5">{total}</text>
        <text x="50%" y="62%" textAnchor="middle" fontSize="11" fill="#a1a1aa">proyectos</text>
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 140 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, boxShadow: `0 0 10px ${s.color}66` }} />
            <span style={{ color: "var(--text-secondary)" }}>{s.label}</span>
            <span style={{ marginLeft: "auto", color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   COMPONENTES INTERNOS
   ============================================ */
function SidebarItem({ label, icon, active, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 12px", borderRadius: "var(--radius-md)",
        background: active
          ? "linear-gradient(135deg, rgba(220,38,38,0.18), rgba(220,38,38,0.05))"
          : hover ? "rgba(255,255,255,0.05)" : "transparent",
        border: "1px solid",
        borderColor: active ? "rgba(220,38,38,0.35)" : "transparent",
        color: active ? "#fff" : hover ? "var(--text-primary)" : "var(--text-muted)",
        fontSize: 13, fontWeight: active ? 600 : 500,
        cursor: "pointer", textAlign: "left", width: "100%",
        fontFamily: "Inter, sans-serif", transition: "all 0.18s",
        boxShadow: active ? "0 6px 18px -8px rgba(220,38,38,0.6)" : "none"
      }}
    >
      <img src={icon} alt="" style={{ width: 18, height: 18, opacity: active ? 1 : 0.65 }} />
      {label}
      {active && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "var(--red-400)", boxShadow: "0 0 8px var(--red-400)" }} />}
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
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 10px", borderRadius: "var(--radius-sm)",
        background: hover ? "rgba(220,38,38,0.10)" : "transparent",
        border: "1px solid", borderColor: hover ? "rgba(220,38,38,0.25)" : "transparent",
        color: hover ? "var(--red-400)" : "var(--text-muted)",
        fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif",
        transition: "all 0.15s", width: "100%", textAlign: "left"
      }}
    >
      <img src="https://img.icons8.com/material/16/F87171/exit--v1.png" alt="" style={{ width: 16, height: 16 }} />
      Cerrar sesión
    </button>
  );
}

function MetricCard({ label, value, icon, color, spark }) {
  return (
    <div className="metric-card" style={{ color }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="ring" style={{ background: `${color}1a`, color }}>
          <img src={icon} alt="" style={{ width: 22, height: 22 }} />
        </div>
        {spark && <Sparkline values={spark} color={color} />}
      </div>
      <div>
        <div className="lbl">{label}</div>
        <div className="val" style={{ color }}>{value}</div>
      </div>
    </div>
  );
}

function SeccionProxima({ titulo, desc }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p className="label-eyebrow" style={{ color: "var(--red-400)" }}>Próximamente</p>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px" }}>{titulo}</h1>
      <p className="text-xs-muted">{desc}</p>
      <div className="glass-card" style={{ marginTop: 24, padding: 60, textAlign: "center", color: "var(--text-muted)", fontSize: 13, borderStyle: "dashed" }}>
        Esta sección está en desarrollo.
      </div>
    </div>
  );
}

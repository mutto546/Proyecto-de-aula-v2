import React from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "../utils/login";
import "../styles/global.css";
import "../styles/anim.css";

import logo from "../assets/logo.png";
import brayanImg from "../assets/example/brayan.png";
import dbkImg from "../assets/example/dbk.png";
import nelmanImg from "../assets/example/nelman.png";

function Landing() {
    const navigate = useNavigate();

    const handleIngresar = () => {
        const session = getSession();
        if (session) navigate("/app");
        else navigate("/login");
    };

    return (
        <>
            {/* Glow ambiental decorativo */}
            <div className="ambient-glow" aria-hidden="true" />

            {/* NAV */}
            <nav className="nav">
                <a href="#" className="nav-logo">
                    <img className="logo-img" src={logo} alt="Rumba" />
                </a>
                <ul className="nav-links">
                    <li><a href="#features">Funciones</a></li>
                    <li><a href="#states">Flujo</a></li>
                    <li><a href="#producers">Productores</a></li>
                </ul>
                <button className="nav-cta" onClick={handleIngresar}>
                    <span>Ingresar</span>
                    <img
                        src="https://img.icons8.com/material/16/FFFFFF/chevron-right.png"
                        alt=""
                        style={{ width: "14px", height: "14px" }}
                    />
                </button>
                <button className="nav-hamburger" aria-label="Menú">&#9776;</button>
            </nav>

            {/* HERO */}
            <section className="hero">
                <div className="hero-content">
                    {/* <div className="hero-badge">
                        <span className="badge-dot"></span>
                        <span>Para productores musicales</span>
                    </div> */}

                    <h1 className="hero-title">
                        Tu catálogo.<br />
                        Tu negocio.<br />
                        <em>Tu Rumba.</em>
                    </h1>

                    <p className="hero-subtitle">
                        La herramienta que los productores necesitaban.
                        Gestiona proyectos, artistas, licencias e ingresos en un solo lugar.
                        Sin comisiones. Sin plataformas externas. Solo tú y tu música.
                    </p>

                    <div className="hero-actions">
                        <button className="btn-primary" onClick={handleIngresar}>
                            <span>Abrir Rumba</span>
                            <img
                                src="https://img.icons8.com/material/16/FFFFFF/chevron-right.png"
                                alt=""
                                style={{ width: "16px", height: "16px" }}
                            />
                        </button>
                        <a href="#features" className="btn-ghost">Ver funciones</a>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="card-float card-1">
                        <div className="label-eyebrow">Producción</div>
                        <div className="card-beat-name">Playa</div>
                        <div className="flex-row-wrap">
                            <span className="tag tag-genre">Afrobeat</span>
                            <span className="tag tag-bpm">100 BPM</span>
                        </div>
                        <div className="card-status status-available">● Disponible</div>
                    </div>

                    <div className="card-float card-2">
                        <div className="label-eyebrow">Mix & Master</div>
                        <div className="card-beat-name">Modo Avión</div>
                        <div className="card-client">Artista: @brayandeaviila</div>
                        <div className="card-status status-licensed">● En progreso</div>
                    </div>

                    <div className="card-float card-3">
                        <div className="label-eyebrow">Ingresos del mes</div>
                        <div className="card-stat-num">$3.500.000</div>
                        <div className="card-stat-bar">
                            <div className="bar-fill"></div>
                        </div>
                        <div className="card-stat-sub">+120% vs mes anterior</div>
                    </div>
                </div>
            </section>

            {/* MÉTRICAS */}
            <section className="catalog-section">
                <div className="catalog-table">
                    <div
                        className="table-row"
                        style={{ gridTemplateColumns: "1fr 1fr 1fr", textAlign: "center", gap: "1rem" }}
                    >
                        <div>
                            <div className="card-stat-num" style={{ fontSize: "2.4rem" }}>6</div>
                            <div className="cell-muted">Tipos de proyecto</div>
                        </div>
                        <div>
                            <div className="card-stat-num" style={{ fontSize: "2.4rem" }}>5</div>
                            <div className="cell-muted">Estados de flujo</div>
                        </div>
                        <div>
                            <div className="card-stat-num" style={{ fontSize: "2.4rem" }}>100%</div>
                            <div className="cell-muted">Tuyo, sin comisiones</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FUNCIONALIDADES */}
            <section className="features-section" id="features">
                <div className="section-header">
                    <p className="label-eyebrow">Funcionalidades</p>
                    <h2 className="section-title">
                        Diseñado para el flujo<br />de un productor real
                    </h2>
                    <p className="section-desc">
                        Cada función nació de una necesidad concreta. Sin bloat. Sin relleno.
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feat-card feat-large">
                        <div className="feat-icon-wrap" style={{ background: "rgba(220,38,38,0.14)" }}>
                            <img
                                src="https://img.icons8.com/material/22/DC2626/lightning-bolt--v1.png"
                                alt=""
                                style={{ width: "22px", height: "22px" }}
                            />
                        </div>
                        <h3>Crea proyectos sin formularios</h3>
                        <p>
                            Presiona <strong>Ctrl+N</strong> desde cualquier pantalla. Escribe el nombre, elige el tipo
                            con un clic y presiona Enter. Menos de 5 segundos. Tan rápido como una nota, pero organizado
                            para siempre.
                        </p>
                        <div className="flex-row-wrap feat-tag-row">
                            <span className="ftag">Atajos de teclado</span>
                            <span className="ftag">Velocidad</span>
                        </div>
                    </div>

                    <div className="feat-card">
                        <div className="feat-icon-wrap" style={{ background: "rgba(220,38,38,0.10)" }}>
                            <img
                                src="https://img.icons8.com/material/20/DC2626/web-design--v1.png"
                                alt=""
                                style={{ width: "20px", height: "20px" }}
                            />
                        </div>
                        <h3>6 tipos de proyecto</h3>
                        <p>
                            Producción, Mix & Master, Composición, Grabación, Edición y Colaboración.
                            Cada tipo tiene su propio flujo de estados adaptado a cómo trabajas.
                        </p>
                    </div>

                    <div className="feat-card">
                        <div className="feat-icon-wrap" style={{ background: "rgba(220,38,38,0.10)" }}>
                            <img
                                src="https://img.icons8.com/material/20/DC2626/conference-call--v1.png"
                                alt=""
                                style={{ width: "20px", height: "20px" }}
                            />
                        </div>
                        <h3>Registro de artistas</h3>
                        <p>
                            Historial de proyectos por artista, notas de cada sesión y datos de contacto.
                            Siempre sabes con quién trabajas y qué quedó pendiente.
                        </p>
                    </div>

                    <div className="feat-card">
                        <div className="feat-icon-wrap" style={{ background: "rgba(220,38,38,0.10)" }}>
                            <img
                                src="https://img.icons8.com/material/20/DC2626/stack-of-paper--v1.png"
                                alt=""
                                style={{ width: "20px", height: "20px" }}
                            />
                        </div>
                        <h3>EPs y álbumes agrupados</h3>
                        <p>
                            Etiqueta proyectos con un EP o álbum y Rumba los agrupa automáticamente.
                            Ve el avance de todo un proyecto discográfico en una sola vista.
                        </p>
                    </div>

                    <div className="feat-card">
                        <div className="feat-icon-wrap" style={{ background: "rgba(220,38,38,0.10)" }}>
                            <img
                                src="https://img.icons8.com/material/20/DC2626/google-docs--v1.png"
                                alt=""
                                style={{ width: "20px", height: "20px" }}
                            />
                        </div>
                        <h3>Contratos y licencias</h3>
                        <p>
                            Genera PDFs con plantillas de licencia exclusiva, no-exclusiva y libre de regalías
                            directo desde cada proyecto. Sin Word, sin Google Docs.
                        </p>
                    </div>

                    <div className="feat-card feat-highlight">
                        <div className="feat-icon-wrap" style={{ background: "linear-gradient(135deg,#DC2626,#EF4444)" }}>
                            <img
                                src="https://img.icons8.com/material/20/FFFFFF/star--v1.png"
                                alt=""
                                style={{ width: "20px", height: "20px" }}
                            />
                        </div>
                        <h3>Tuyo, siempre</h3>
                        <p>
                            Cero comisiones. Cero suscripciones. Corre en tu máquina.
                            Tus datos no van a ningún servidor externo. Nunca.
                        </p>
                    </div>
                </div>
            </section>

            {/* FLUJO DE TRABAJO */}
            <section className="states-section" id="states">
                <div className="section-header">
                    <p className="label-eyebrow">Flujo de trabajo</p>
                    <h2 className="section-title">Cada proyecto en su estado exacto</h2>
                    <p className="section-desc">
                        De la idea al entregable, Rumba te acompaña en cada etapa sin perder el hilo.
                    </p>
                </div>
                <div className="states-grid">
                    <div className="state-card">
                        <div className="state-dot dot-available"></div>
                        <div>
                            <div className="state-name">Pendiente</div>
                            <div className="text-xs-muted">En la lista, aún sin empezar.</div>
                        </div>
                    </div>
                    <div className="state-card">
                        <div className="state-dot dot-negotiation"></div>
                        <div>
                            <div className="state-name">En progreso</div>
                            <div className="text-xs-muted">Actualmente trabajando en él.</div>
                        </div>
                    </div>
                    <div className="state-card">
                        <div className="state-dot dot-licensed"></div>
                        <div>
                            <div className="state-name">En revisión</div>
                            <div className="text-xs-muted">Enviado al artista, esperando feedback.</div>
                        </div>
                    </div>
                    <div className="state-card">
                        <div className="state-dot dot-exclusive"></div>
                        <div>
                            <div className="state-name">Completado</div>
                            <div className="text-xs-muted">Entregado y cerrado.</div>
                        </div>
                    </div>
                    <div className="state-card">
                        <div className="state-dot dot-retired"></div>
                        <div>
                            <div className="state-name">Archivado</div>
                            <div className="text-xs-muted">Fuera del flujo activo. Guardado.</div>
                        </div>
                    </div>
                    <div className="state-card">
                        <div className="state-dot dot-custom"></div>
                        <div>
                            <div className="state-name">+ Estado personalizado</div>
                            <div className="text-xs-muted">Crea los estados que tu flujo necesite.</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRODUCTORES AFILIADOS */}
            <section className="features-section" id="producers">
                <div className="section-header">
                    <p className="label-eyebrow">Productores que usan Rumba</p>
                    <h2 className="section-title">
                        Hecho por productores,<br />probado por productores
                    </h2>
                    <p className="section-desc">
                        Desde el Caribe colombiano, los primeros en confiar en Rumba para organizar su estudio.
                    </p>
                </div>

                <div className="features-grid">

                    {/* Brayan */}
                    <div className="feat-card">
                        <div style={{ position: "relative", marginBottom: "1rem", borderRadius: "14px", overflow: "hidden", height: "140px" }}>
                            <img
                                src={brayanImg}
                                alt="Brayan De Aviila"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <div style={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                                pointerEvents: "none"
                            }} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.9rem" }}>
                            <div
                                className="feat-icon-wrap"
                                style={{
                                    background: "rgba(220,38,38,0.12)",
                                    width: "42px",
                                    height: "42px",
                                    borderRadius: "50%",
                                    margin: 0,
                                    flexShrink: 0,
                                }}
                            >
                                <img
                                    src="https://img.icons8.com/material/20/DC2626/keyboard.png"
                                    alt=""
                                    style={{ width: "20px", height: "20px" }}
                                />
                            </div>
                            <div>
                                <div className="text-bold-sm">Brayan De Aviila</div>
                                <div className="text-xs-muted">Productor, beatmaker</div>
                            </div>
                        </div>
                        <p>
                            Productor musical especializado en Reggaeton y géneros urbanos de la costa.
                            Desarrollador de Rumba.
                        </p>
                        <div className="flex-row-wrap" style={{ marginTop: "0.75rem" }}>
                            <span className="tag tag-genre">Reggaeton</span>
                            <span className="tag tag-bpm">Afrobeat</span>
                            <span className="tag tag-bpm">Trap</span>
                            <span className="tag tag-bpm">Vallenato</span>
                        </div>
                    </div>

                    {/* DBK */}
                    <div className="feat-card">
                        <div style={{ position: "relative", marginBottom: "1rem", borderRadius: "14px", overflow: "hidden", height: "140px" }}>
                            <img
                                src={dbkImg}
                                alt="DBK"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <div style={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                                pointerEvents: "none"
                            }} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.9rem" }}>
                            <div
                                className="feat-icon-wrap"
                                style={{
                                    background: "rgba(220,38,38,0.12)",
                                    width: "42px",
                                    height: "42px",
                                    borderRadius: "50%",
                                    margin: 0,
                                    flexShrink: 0,
                                }}
                            >
                                <img
                                    src="https://img.icons8.com/material/20/DC2626/keyboard.png"
                                    alt=""
                                    style={{ width: "20px", height: "20px" }}
                                />
                            </div>
                            <div>
                                <div className="text-bold-sm">DBK</div>
                                <div className="text-xs-muted">Productor musical, Ingeniero de mezcla y master</div>
                            </div>
                        </div>
                        <p>
                            Productor musical e ingeniero de mezcla y master. Posicionado en el vallenato moderno
                            junto con el cantante Luisra Solano y consolidado en sonidos urbanos.
                        </p>
                        <div className="flex-row-wrap" style={{ marginTop: "0.75rem" }}>
                            <span className="tag tag-genre">Urbano</span>
                            <span className="tag tag-bpm">Mix & Master</span>
                        </div>
                    </div>

                    {/* Nelman */}
                    <div className="feat-card">
                        <div style={{ position: "relative", marginBottom: "1rem", borderRadius: "14px", overflow: "hidden", height: "140px" }}>
                            <img
                                src={nelmanImg}
                                alt="Nelman"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <div style={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                                pointerEvents: "none"
                            }} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.9rem" }}>
                            <div
                                className="feat-icon-wrap"
                                style={{
                                    background: "rgba(220,38,38,0.12)",
                                    width: "42px",
                                    height: "42px",
                                    borderRadius: "50%",
                                    margin: 0,
                                    flexShrink: 0,
                                }}
                            >
                                <img
                                    src="https://img.icons8.com/material/20/DC2626/keyboard.png"
                                    alt=""
                                    style={{ width: "20px", height: "20px" }}
                                />
                            </div>
                            <div>
                                <div className="text-bold-sm">Nelman</div>
                                <div className="text-xs-muted">Productor musical</div>
                            </div>
                        </div>
                        <p>
                            Productor musical trabajando con grandes artistas del Caribe tales como Ana del Castillo o L'Omy.
                            Experto en fusión de géneros tradicionales con sonidos contemporáneos.
                        </p>
                        <div className="flex-row-wrap" style={{ marginTop: "0.75rem" }}>
                            <span className="tag tag-genre">Tropical</span>
                            <span className="tag tag-bpm">Fusión</span>
                        </div>
                    </div>

                </div>
            </section>

            {/* CTA FINAL */}
            <section className="cta-section">
                <div className="cta-content">
                    <p className="label-eyebrow">¿Listo para organizarte?</p>
                    <h2 className="cta-title">
                        Tu estudio merece<br /><em>mejor organización.</em>
                    </h2>
                    <p className="cta-desc">
                        Gratis. Local. Sin registro externo.<br />
                        Abre Rumba y empieza hoy mismo.
                    </p>
                    <div className="cta-actions">
                        <button className="btn-primary btn-large" onClick={handleIngresar}>
                            <span>Abrir Rumba</span>
                            <img
                                src="https://img.icons8.com/material/16/FFFFFF/chevron-right.png"
                                alt=""
                                style={{ width: "16px", height: "16px" }}
                            />
                        </button>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <a href="#" className="footer-logo">
                    <img className="logo-img" src={logo} alt="Rumba" />
                </a>
                <p className="footer-tagline">Hecho para productores. Por productores.</p>
                <p className="footer-copy">© 2026 Rumba — Tu estudio, organizado.</p>
            </footer>
        </>
    );
}

export default Landing;

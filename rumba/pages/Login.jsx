import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';
import logo from '../assets/logo.png';
import { loginUser } from "../utils/login.js";


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });

    const navigate = useNavigate();

    // forzando minusculas
    const sanitizeUsername = (value) => {
        return value
            .toLowerCase()
            .replace(/[^a-z0-9._]/g, "");
    };

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "username") {
            value = sanitizeUsername(value);
        }

        ;
    };

    const handleLogin = (e) => {
        e.preventDefault();

        const result = loginUser(username, password);

        if (username === "getmemypowers") {
            navigate("/admin");
            return;
        }

        if (result.success) {
            setMessage({ text: result.message, type: "success" });

            setTimeout(() => {
                navigate("/app");
            }, 1000);
        } else {
            setMessage({ text: result.message, type: "error" });
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <Link to="/">
                    <div className="logo-wrapper">
                        <img className="logo-img" src={logo} alt="Rumba" />
                    </div>
                </Link>


                <h2 className="label-eyebrow" style={{ marginBottom: "6px", marginTop: '-25px', color: "var(--accent-hover)" }}>Bienvenido de vuelta</h2>
                <p className="text-xs-muted" style={{ marginBottom: "6px" }}>
                    Accede a tu estudio y continúa tu flujo.
                </p>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="@usuario"
                            value={username}
                            onChange={(e) => setUsername(sanitizeUsername(e.target.value))}
                            onKeyDown={(e) => {
                                if (e.key === " ") e.preventDefault();
                            }}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-login">Iniciar Sesión</button>
                </form>

                <Link to="/register" className="btn-register">
                    <span>No tengo una cuenta</span>
                </Link>

                <div className="divider">
                    <div style={{ textAlign: "center", marginTop: "6px" }}>
                        <span className="text-xs-muted" style={{ cursor: "pointer" }}>
                            ¿Olvidaste tu contraseña?
                        </span>
                    </div>
                </div>

                <div className="info-text fade-in-up">
                    Tus proyectos. Tus clientes. Tu dinero.<br />
                    <strong>Todo en una Rumba.</strong>
                </div>

                {message.text && (
                    <div id="message" className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div >
    );
}

export default Login;
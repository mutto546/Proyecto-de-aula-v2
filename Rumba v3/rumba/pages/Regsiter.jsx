import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";
import logo from "../assets/logo.png";

import { registerUser } from "../utils/register";

function Register() {
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // forzando minusculas
    const sanitizeUsername = (value) => {
        return value
            .toLowerCase()
            .replace(/[^a-z0-9._]/g, "");
    };

    const [message, setMessage] = useState({ text: "", type: "" });

    const navigate = useNavigate();

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "username") {
            value = sanitizeUsername(value);
        }

        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleRegister = (e) => {
        e.preventDefault();

        const result = registerUser(form);

        if (result.success) {
            setMessage({ text: result.message, type: "success" });

            setTimeout(() => {
                navigate("/login");
            }, 1200);
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


                <h2 className="label-eyebrow" style={{ marginBottom: "6px", marginTop: '-25px', color: "var(--accent-hover)" }}>empieza a rumbear</h2>
                <p className="text-xs-muted" style={{ marginBottom: "6px" }}>
                    Asegúrate de revisar todos los campos antes de crear tu cuenta.
                </p>

                <form onSubmit={handleRegister} style={{ marginTop: '10px' }}>

                    {/* NOMBRE REAL */}
                    <div className="input-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre"
                            onChange={handleChange}
                        />
                    </div>

                    {/* USERNAME CON @ */}
                    <div className="input-group" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: "#A1A1AA" }}>@</span>
                        <input
                            type="text"
                            name="username"
                            placeholder="usuario"
                            value={form.username}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === " ") e.preventDefault();
                            }}
                            style={{ flex: 1 }}
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="tu@correo.com"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Repetir contraseña"
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn-register">
                        Crear cuenta
                    </button>
                </form>

                <div className="divider">
                    <Link to="/login">
                        <span className="text-xs-muted btn-ghost" style={{ cursor: "pointer" }}>
                            Ya tengo una cuenta
                        </span></Link>
                </div>

                <div className="info-text fade-in-up">
                    Todos usan Rumba.<br />
                    <strong>Menos tú.</strong>
                </div>



                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div >
    );
}

export default Register;
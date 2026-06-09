import { useState } from "react";
import { auth } from "../services/api";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await auth.forgotPassword({ email });
      setMessage(`Token generado: ${res.token}`);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Recuperar contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-login">Enviar</button>
        </form>
        {message && <p className="message success">{message}</p>}
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/login" className="btn-register">Volver al login</Link>
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { auth } from "../services/api";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await auth.resetPassword({ token, newPassword });
      setMessage(res.message);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Resetear contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Token recibido"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Cambiar contraseña</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

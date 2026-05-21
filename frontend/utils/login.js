// ============================================
// utils/login.js
// Autenticación con JWT — reemplaza el sistema
// anterior basado solo en localStorage
// ============================================

import { auth, setToken, setUser, clearToken, clearUser, getToken, getUser } from "../services/api";

// Iniciar sesión — devuelve el usuario o lanza error
export async function login(email, password) {
  const data = await auth.login({ email, password });
  setToken(data.token);
  setUser(data.user);
  return data.user;
}

// Registrar — devuelve el usuario o lanza error
export async function register({ name, username, email, password }) {
  const data = await auth.register({ name, username, email, password });
  setToken(data.token);
  setUser(data.user);
  return data.user;
}

// Cerrar sesión — borra token y usuario
export function logout() {
  clearToken();
  clearUser();
}

// Leer sesión actual del localStorage
export function getSession() {
  const token = getToken();
  const user  = getUser();
  if (!token || !user) return null;
  return user;
}

// Verificar que el token sigue válido contra la API
// Útil al montar el Dashboard para detectar tokens expirados
export async function verificarSesion() {
  try {
    const user = await auth.me();
    setUser(user); // actualizar datos del usuario por si cambiaron
    return user;
  } catch {
    clearToken();
    clearUser();
    return null;
  }
}

// ============================================
// api.js — cliente HTTP centralizado
// Todas las llamadas a la API pasan por aquí
// El token JWT se agrega automáticamente
// ============================================

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// --- Guardar / leer / borrar token ---
export const getToken  = ()        => localStorage.getItem("rumba_token");
export const setToken  = (token)   => localStorage.setItem("rumba_token", token);
export const clearToken = ()       => localStorage.removeItem("rumba_token");

// --- Guardar / leer usuario en sesión ---
export const getUser   = ()        => {
  const raw = localStorage.getItem("rumba_user");
  return raw ? JSON.parse(raw) : null;
};
export const setUser   = (user)    => localStorage.setItem("rumba_user", JSON.stringify(user));
export const clearUser = ()        => localStorage.removeItem("rumba_user");

// --- Fetch base con JWT inyectado automáticamente ---
async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers
  });

  // Si el servidor devuelve 401, el token expiró o es inválido
  if (res.status === 401) {
    clearToken();
    clearUser();
    window.location.href = "/login";
    return;
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Lanzar el mensaje de error del servidor si existe
    throw new Error(data?.message || `Error ${res.status}`);
  }

  return data;
}

// ============================================
// AUTH
// ============================================
export const auth = {
  register: (body) => request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login:    (body) => request("/api/auth/login",    { method: "POST", body: JSON.stringify(body) }),
  me:       ()     => request("/api/auth/me")
};

// ============================================
// RUMBAS
// ============================================
export const rumbas = {
  getAll:    ()         => request("/api/rumbas"),
  getById:   (id)       => request(`/api/rumbas/${id}`),
  create:    (body)     => request("/api/rumbas",              { method: "POST",   body: JSON.stringify(body) }),
  update:    (id, body) => request(`/api/rumbas/${id}`,        { method: "PUT",    body: JSON.stringify(body) }),
  completar: (id)       => request(`/api/rumbas/${id}/completar`, { method: "PATCH" }),
  delete:    (id)       => request(`/api/rumbas/${id}`,        { method: "DELETE" }),
  deleteMany:(ids)      => request("/api/rumbas",              { method: "DELETE", body: JSON.stringify({ ids }) }),
  metricas:  ()         => request("/api/rumbas/metricas")
};

// ============================================
// CLIENTES
// ============================================
export const clientes = {
  getAll:  ()         => request("/api/clientes"),
  getById: (id)       => request(`/api/clientes/${id}`),
  create:  (body)     => request("/api/clientes",        { method: "POST",   body: JSON.stringify(body) }),
  update:  (id, body) => request(`/api/clientes/${id}`,  { method: "PUT",    body: JSON.stringify(body) }),
  delete:  (id)       => request(`/api/clientes/${id}`,  { method: "DELETE" })
};

const USERS_KEY = "rumba_users";
const SESSION_KEY = "rumba_session";

export function loginUser(username, password) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (!user) {
        return { success: false, message: "Usuario o contraseña incorrectos" };
    }

    // guardar sesión
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));

    return { success: true, message: "¡Bienvenido!" };
}

export function getSession() {
    try {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    } catch (error) {
        console.error("Error parsing session:", error);
        return null;
    }
}

export function logout() {
    localStorage.removeItem(SESSION_KEY);
}
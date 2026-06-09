const USERS_KEY = "rumba_users";
const ID_KEY = "rumba_user_id_counter";

export function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

function validateUsername(username) {
    const regex = /^[a-z0-9._]+$/;
    return regex.test(username);
}

function getNextId() {
    let currentId = localStorage.getItem(ID_KEY);

    if (!currentId) {
        localStorage.setItem(ID_KEY, "1");
        return 1;
    }

    const nextId = parseInt(currentId) + 1;
    localStorage.setItem(ID_KEY, nextId.toString());

    return nextId;
}


export function registerUser({ name, username, email, password, confirmPassword }) {
    if (!name || !username || !email || !password || !confirmPassword) {
        return { success: false, message: "Todos los campos son obligatorios" };
    }

    if (!name) {
        return { success: false, message: "El nombre es obligatorio" };
    }

    if (!validateEmail(email)) {
        return { success: false, message: "Correo inválido" };
    }

    if (password !== confirmPassword) {
        return { success: false, message: "Las contraseñas no coinciden" };
    }

    if (!validateUsername(username)) {
        return {
            success: false,
            message: "El usuario solo puede tener minúsculas, números, . o _",
        };
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

    const exists = users.find(
        (u) => u.username === username || u.email === email
    );

    if (exists) {
        return { success: false, message: "El usuario o correo ya existe" };
    }

    const newUser = {
        id: getNextId(),
        name,
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return { success: true, message: "Cuenta creada correctamente" };
}
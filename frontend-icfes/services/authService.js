import config from "@/config/config";
const API_URL = config.API_BASE_URL;

export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/api/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Error al iniciar sesión");

    localStorage.setItem("token", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("usuario", JSON.stringify(data.user));
    localStorage.setItem("role", data.role);

    return data.user;
  } catch (error) {
    throw error;
  }
}

export async function register(name, email, password) {
  try {
    const response = await fetch(`${API_URL}/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al registrar");
    }

    return data.message;
  } catch (error) {
    throw error;
  }
}

export function logout() {
  localStorage.removeItem("usuario");
}

export function getUsuario() {
  try {
    return JSON.parse(localStorage.getItem("usuario"));
  } catch {
    return null;
  }
}

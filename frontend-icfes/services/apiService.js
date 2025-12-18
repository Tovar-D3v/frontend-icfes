const getToken = () => localStorage.getItem("token");
const getRefreshToken = () => localStorage.getItem("refresh");
import config from "@/config/config";
const API_URL = config.API_BASE_URL;

export async function apiFetch(endpoint, options = {}) {
  let token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_URL}/api/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();

          localStorage.setItem("token", refreshData.access);

          headers["Authorization"] = `Bearer ${refreshData.access}`;
          response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
          });

          return response;
        }
      } catch (err) {
        console.error("Error intentando refrescar token", err);
      }
    }

    logout();
    throw new Error("Su sesión ha expirado definitivamente.");
  }

  return response;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  window.location.href = "/";
}

import { apiFetch } from "./apiService";

export async function getInformacionUsuario() {
  try {
    const res = await apiFetch("/api/perfil/mi-perfil/");
    
    if (!res.ok) {
      throw new Error("Error obteniendo materias");
    }
    
    return await res.json();
  } catch (error) {
    throw error;
  }
}


export async function updateInformacionUsuario(data) {
  try {
    const res = await apiFetch("/api/perfil/mi-perfil/", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      throw new Error("Error actualizando información del usuario");
    }
    
    return await res.json();
  } catch (error) {
    throw error;
  }
}
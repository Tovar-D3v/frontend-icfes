import { apiFetch } from "../apiService";

export async function getMaterias() {
  try {
    const res = await apiFetch("/api/materias_icfes/lista_materias/");
    
    if (!res.ok) {
      throw new Error("Error obteniendo materias");
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error cargando materias:", error);
    throw error;
  }
}
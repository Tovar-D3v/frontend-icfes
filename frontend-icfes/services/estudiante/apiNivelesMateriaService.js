import { apiFetch } from "../apiService";

export async function getNivelesByMateria(materiaId) {
  try {
    const res = await apiFetch(`/api/niveles/${materiaId}/contenido_materia/`);

    if (!res.ok) {
      throw new Error("Error obteniendo niveles por materia");
    }

    return await res.json();
  } catch (error) {
    console.error("Error cargando niveles por materia:", error);
    throw error;
  }
}

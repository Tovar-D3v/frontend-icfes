import { apiFetch } from "../apiService";

export async function getInformacionEstudiante(asignacionId, estudiante_id) {
  try {
    const res = await apiFetch(
      `/api/profesores/profesor/${asignacionId}/detalle-estudiante/${estudiante_id}/`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw new Error("Error al obtener la información del estudiante");
    }

    return await res.json();
  } catch (error) {
    console.error("Error al obtener la información del estudiante:", error);
    throw error;
  }
}
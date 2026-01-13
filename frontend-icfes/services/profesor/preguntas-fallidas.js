import { apiFetch } from "../apiService";

export async function getPreguntasFallidas(asignacionId) {
  try {
    const res = await apiFetch(
      `/api/profesores/profesor/${asignacionId}/preguntas-fallidas-curso/`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw new Error("Error al obtener las preguntas fallidas");
    }

    return await res.json();
  } catch (error) {
    console.error("Error al obtener las preguntas fallidas:", error);
    throw error;
  }
}
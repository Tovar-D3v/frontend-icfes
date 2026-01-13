import { apiFetch } from "../apiService";

export async function getRendimientoCurso(asignacionId) {
  try {
    const res = await apiFetch(
      `/api/profesores/profesor/${asignacionId}/rendimiento_curso/`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw new Error("Error al obtener el rendimiento del curso");
    }

    return await res.json();
  } catch (error) {
    console.error("Error al obtener el rendimiento del curso:", error);
    throw error;
  }
}
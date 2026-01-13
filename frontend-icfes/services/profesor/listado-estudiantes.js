import { apiFetch } from "../apiService";

export async function getListadoEstudiantes(asignacionId) {
  try {
    const res = await apiFetch(
      `/api/profesores/profesor/${asignacionId}/lista_estudiantes`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw new Error("Error al obtener el listado de estudiantes");
    }

    return await res.json();
  } catch (error) {
    console.error("Error al obtener el listado de estudiantes:", error);
    throw error;
  }
}

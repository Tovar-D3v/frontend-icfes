import { apiFetch } from "../apiService";

export async function getCursosMateriasByProfesor() {
  try {
    const res = await apiFetch("/api/profesores/profesor/mis_cursos/", {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Error al obtener cursos y materias del profesor");
    }

    return await res.json();
  } catch (error) {
    console.error("Error al obtener cursos y materias del profesor:", error);
    throw error;
  }
}

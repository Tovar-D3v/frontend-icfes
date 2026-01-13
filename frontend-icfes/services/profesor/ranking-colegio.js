import { apiFetch } from "../apiService";

export async function getRankingColegio(curso_id) {
  try {
    const res = await apiFetch(
      `/api/profesores/profesor/ranking-colegio/${curso_id}/`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw new Error("Error al obtener el ranking del colegio");
    }

    return await res.json();
  } catch (error) {
    console.error("Error al obtener el ranking del colegio:", error);
    throw error;
  }
}
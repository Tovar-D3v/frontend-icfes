import { apiFetch } from "../apiService";

export async function getRankingColegio() {
  try {
    const res = await apiFetch(`/api/ranking/ranking_colegio/`);

    if (!res.ok) {
      throw new Error("Error obteniendo ranking del colegio");
    }

    return await res.json();
  } catch (error) {
    console.error("Error cargando ranking del colegio:", error);
    throw error;
  }
}

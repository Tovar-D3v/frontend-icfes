import { apiFetch } from "../../apiService";

export async function finalizarNivel(intentoId) {
  try {
    const res = await apiFetch(`/api/juego/${intentoId}/finalizar_nivel/`, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Error finalizando nivel de quiz");
    }

    return await res.json();
  } catch (error) {
    console.error("Error finalizando nivel de quiz:", error);
    throw error;
  }
}

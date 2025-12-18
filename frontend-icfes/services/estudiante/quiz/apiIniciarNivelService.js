import { apiFetch } from "../../apiService";

export async function iniciarNivel(nivelId) {
  try {
    const res = await apiFetch(`/api/juego/${nivelId}/iniciar_nivel/`, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Error iniciando nivel de quiz");
    }

    return await res.json();
  } catch (error) {
    console.error("Error iniciando nivel de quiz:", error);
    throw error;
  }
}

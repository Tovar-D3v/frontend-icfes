import { apiFetch } from "../../apiService";

export async function getPreguntasOpciones(nivelId) {
  try {
    const res = await apiFetch(
      `/api/juego/${nivelId}/obtener_preguntas/`
    );

    if (!res.ok) {
      throw new Error("Error obteniendo opciones por pregunta");
    }

    return await res.json();
  } catch (error) {
    console.error("Error cargando opciones por pregunta:", error);
    throw error;
  }
}
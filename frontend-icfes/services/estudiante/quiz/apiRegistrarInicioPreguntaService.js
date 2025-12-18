import { apiFetch } from "../../apiService";

export async function registrarInicioPregunta(intentoId, preguntaId) {
  try {
    const res = await apiFetch(`/api/juego/registrar_inicio_pregunta/`, {
      method: "POST",
      body: JSON.stringify({
        intento_id: intentoId,
        pregunta_id: preguntaId,
      }),
    });
    if (!res.ok) {
      throw new Error("Error registrando inicio de pregunta");
    }
    return await res.json();
  } catch (error) {
    console.error("Error registrando inicio de pregunta:", error);
    throw error;
  }
}

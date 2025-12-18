import { apiFetch } from "../../apiService";

export async function validarRespuesta(
  intentoId,
  preguntaId,
  respuesta_seleccionada
) {
  try {
    const res = await apiFetch(`/api/juego/validar_respuesta/`, {
      method: "POST",
      body: JSON.stringify({
        intento_nivel: intentoId,
        pregunta: preguntaId,
        respuesta_seleccionada: [respuesta_seleccionada],
      }),
    });

    if (!res.ok) {
      throw new Error("Error validando respuesta");
    }

    return await res.json();
  } catch (error) {
    console.error("Error validando respuesta:", error);
    throw error;
  }
}

import { apiFetch } from "../apiService";

export async function chatInforme(informeId, pregunta) {
  try {
    const path = informeId ? `/api/ia/chat-informe/${informeId}/` : `/api/ia/chat-informe/`;
    const res = await apiFetch(path, {
      method: "POST",
      body: JSON.stringify({ pregunta }),
    });
    if (!res.ok) {
      throw new Error("Error al obtener respuesta del chat del informe");
    }
    return await res.json();
  } catch (error) {
    console.error("Error al obtener respuesta del chat del informe:", error);
    throw error;
  }
}

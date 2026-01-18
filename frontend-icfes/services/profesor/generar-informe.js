import { apiFetch } from "../apiService";

export async function generarInforme(asignacionId) {
  try {
    const res = await apiFetch(
      `/api/ia/generar-informe/${asignacionId}/`,
      {
        method: "POST",
      }
    );

    if (!res.ok) {
      throw new Error("Error al generar el informe");
    }

    return await res.json();
  } catch (error) {
    console.error("Error al generar el informe:", error);
    throw error;
  }
}

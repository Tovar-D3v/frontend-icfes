import config from "../config/config"
const API_URL = `${config.API_BASE_URL}/api`;

export async function getUnitsBySubject(subjectId) {
  try {
    const res = await fetch(`${API_URL}/materias/${subjectId}/unidades/`);
    if (!res.ok) {
      throw new Error("No se pudieron obtener las unidades");
    }
    return await res.json();
  } catch (error) {
    console.error("Error consultando unidades:", error);
    throw error;
  }
}

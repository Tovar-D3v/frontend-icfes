import config from "@/config/config";
const API_URL = `${config.API_BASE_URL}/api`;

export async function getMaterias() {
  try {
    const res = await fetch(`${API_URL}/materias/`);
    if (!res.ok) {
      throw new Error("Error obteniendo materias");
    }
    return await res.json();
  } catch (error) {
    console.error("Error cargando materias:", error);
    throw error;
  }
}

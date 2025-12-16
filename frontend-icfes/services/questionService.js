import config from "@/config/config";


export async function getQuestionsByUnit(unitId) {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/unidades/${unitId}/preguntas/`);
      if (!response.ok) throw new Error("Error al obtener preguntas");
  
      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  
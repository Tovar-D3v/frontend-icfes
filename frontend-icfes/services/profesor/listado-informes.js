import { apiFetch } from "../apiService";

export async function getListadoInformes(asignacionId) {
    try {
        const res = await apiFetch(
        `/api/ia/informes/?asignacion_id=${asignacionId}`,
        {
            method: "GET",
        }
        );
    
        if (!res.ok) {
        throw new Error("Error al obtener el listado de informes");
        }
    
        return await res.json();
    } catch (error) {
        console.error("Error al obtener el listado de informes:", error);
        throw error;
    }
}
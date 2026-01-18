import { apiFetch } from "../apiService";

export async function getMensajesInforme(informeId) {
    try {
        const res = await apiFetch(
        `/api/ia/informes/${informeId}/mensajes/`,
        {
            method: "GET",
        }
        );
    
        if (!res.ok) {
        throw new Error("Error al obtener los mensajes del informe");
        }
    
        return await res.json();
    } catch (error) {
        console.error("Error al obtener los mensajes del informe:", error);
        throw error;
    }
}
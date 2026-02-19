import { apiGet } from "./api";
import type { Event, News } from "../types";

/**
 * Obtiene una lista de eventos públicos del backend
 * @param limit - Número máximo de eventos a retornar
 * @param offset - Número de eventos a saltar (para paginación)
 * @param estado - Filtrar por estado (opcional)
 * @returns Promise con array de eventos
 */
export async function getEvents(
  limit?: number,
  offset?: number,
  estado?: string
): Promise<Event[]> {
  try {
    const params = new URLSearchParams();

    if (limit) params.append("limit", limit.toString());
    if (offset) params.append("offset", offset.toString());
    if (estado) params.append("estado", estado);

    const queryString = params.toString();
    const endpoint = `/events/public${queryString ? `?${queryString}` : ""}`;

    const response = await apiGet<Event[]>(endpoint);

    if (response.error) {
      console.error("Error fetching events:", response.error);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error("Error in getEvents:", error);
    return [];
  }
}

/**
 * Obtiene los detalles de un evento específico
 * @param id - ID del evento
 * @returns Promise con los datos del evento
 */
export async function getEventById(id: string): Promise<Event | null> {
  try {
    const response = await apiGet<Event>(`/events/${id}`);

    if (response.error) {
      console.error(`Error fetching event ${id}:`, response.error);
      return null;
    }

    return response.data || null;
  } catch (error) {
    console.error(`Error in getEventById:`, error);
    return null;
  }
}

/**
 * Obtiene noticias/comunicados públicos
 * @param limit - Número máximo de noticias a retornar
 * @param offset - Número de noticias a saltar (para paginación)
 * @returns Promise con array de noticias
 */
export async function getNews(limit?: number, offset?: number): Promise<News[]> {
  try {
    const params = new URLSearchParams();

    if (limit) params.append("limit", limit.toString());
    if (offset) params.append("offset", offset.toString());

    const queryString = params.toString();
    const endpoint = `/news/public${queryString ? `?${queryString}` : ""}`;

    const response = await apiGet<News[]>(endpoint);

    if (response.error) {
      console.error("Error fetching news:", response.error);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error("Error in getNews:", error);
    return [];
  }
}

/**
 * Obtiene una noticia específica por ID
 * @param id - ID de la noticia
 * @returns Promise con los datos de la noticia
 */
export async function getNewsById(id: string): Promise<News | null> {
  try {
    const response = await apiGet<News>(`/news/${id}`);

    if (response.error) {
      console.error(`Error fetching news ${id}:`, response.error);
      return null;
    }

    return response.data || null;
  } catch (error) {
    console.error(`Error in getNewsById:`, error);
    return null;
  }
}

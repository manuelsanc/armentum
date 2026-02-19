import { useState, useEffect } from "react";
import { getEvents, getEventById } from "../services/events";
import type { Event } from "../types";

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
}

interface UseEventReturn {
  event: Event | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook para obtener lista de eventos
 * @param limit - Número máximo de eventos
 * @param offset - Paginación
 * @param estado - Filtro de estado
 */
export function useEvents(limit?: number, offset?: number, estado?: string): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const data = await getEvents(limit, offset, estado);
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar eventos");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [limit, offset, estado]);

  return { events, loading, error };
}

/**
 * Hook para obtener un evento específico
 * @param id - ID del evento
 */
export function useEvent(id: string): UseEventReturn {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchEvent() {
      setLoading(true);
      setError(null);
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar evento");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  return { event, loading, error };
}

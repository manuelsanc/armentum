import { useState, useCallback } from "react";
import * as adminService from "../services/admin";
import type { Event, ApiResponse } from "../types";
import { toast } from "sonner";

interface UseAdminEventsState {
  events: Event[];
  total: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
}

export function useAdminEvents(pageSize = 10) {
  const [state, setState] = useState<UseAdminEventsState>({
    events: [],
    total: 0,
    isLoading: false,
    error: null,
    currentPage: 1,
  });

  const fetchEvents = useCallback(
    async (page = 1) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await adminService.getAllEvents(page, pageSize);
        if (response.data) {
          setState((prev) => ({
            ...prev,
            events: response.data.events,
            total: response.data.total,
            currentPage: page,
            isLoading: false,
          }));
        } else {
          throw new Error(response.error || "Error al cargar eventos");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        setState((prev) => ({ ...prev, error: message, isLoading: false }));
        toast.error(message);
      }
    },
    [pageSize]
  );

  const createEvent = useCallback(
    async (data: Partial<Event>) => {
      try {
        const response = await adminService.createEvent(data);
        if (response.data) {
          toast.success("Evento creado exitosamente");
          await fetchEvents(state.currentPage);
          return response.data;
        } else {
          throw new Error(response.error || "Error al crear evento");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        throw error;
      }
    },
    [fetchEvents, state.currentPage]
  );

  const updateEvent = useCallback(
    async (id: string, data: Partial<Event>) => {
      try {
        const response = await adminService.updateEvent(id, data);
        if (response.data) {
          toast.success("Evento actualizado exitosamente");
          await fetchEvents(state.currentPage);
          return response.data;
        } else {
          throw new Error(response.error || "Error al actualizar evento");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        throw error;
      }
    },
    [fetchEvents, state.currentPage]
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      try {
        const response = await adminService.deleteEvent(id);
        toast.success("Evento eliminado exitosamente");
        await fetchEvents(state.currentPage);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        throw error;
      }
    },
    [fetchEvents, state.currentPage]
  );

  const goToPage = useCallback(
    async (page: number) => {
      await fetchEvents(page);
    },
    [fetchEvents]
  );

  return {
    ...state,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    goToPage,
  };
}

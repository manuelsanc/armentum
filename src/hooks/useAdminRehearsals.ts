import { useState, useCallback } from "react";
import * as adminService from "../services/admin";
import type { Rehearsal, ApiResponse } from "../types";
import { toast } from "sonner";

interface UseAdminRehearsalsState {
  rehearsals: Rehearsal[];
  total: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
}

export function useAdminRehearsals(pageSize = 10) {
  const [state, setState] = useState<UseAdminRehearsalsState>({
    rehearsals: [],
    total: 0,
    isLoading: false,
    error: null,
    currentPage: 1,
  });

  const fetchRehearsals = useCallback(
    async (page = 1) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await adminService.getAllRehearsals(page, pageSize);
        if (response.data) {
          setState((prev) => ({
            ...prev,
            rehearsals: response.data.rehearsals,
            total: response.data.total,
            currentPage: page,
            isLoading: false,
          }));
        } else {
          throw new Error(response.error || "Error al cargar ensayos");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        setState((prev) => ({ ...prev, error: message, isLoading: false }));
        toast.error(message);
      }
    },
    [pageSize]
  );

  const createRehearsal = useCallback(
    async (data: Partial<Rehearsal>) => {
      try {
        const response = await adminService.createRehearsal(data);
        if (response.data) {
          toast.success("Ensayo creado exitosamente");
          await fetchRehearsals(state.currentPage);
          return response.data;
        } else {
          throw new Error(response.error || "Error al crear ensayo");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        throw error;
      }
    },
    [fetchRehearsals, state.currentPage]
  );

  const updateRehearsal = useCallback(
    async (id: string, data: Partial<Rehearsal>) => {
      try {
        const response = await adminService.updateRehearsal(id, data);
        if (response.data) {
          toast.success("Ensayo actualizado exitosamente");
          await fetchRehearsals(state.currentPage);
          return response.data;
        } else {
          throw new Error(response.error || "Error al actualizar ensayo");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        throw error;
      }
    },
    [fetchRehearsals, state.currentPage]
  );

  const deleteRehearsal = useCallback(
    async (id: string) => {
      try {
        const response = await adminService.deleteRehearsal(id);
        toast.success("Ensayo eliminado exitosamente");
        await fetchRehearsals(state.currentPage);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        throw error;
      }
    },
    [fetchRehearsals, state.currentPage]
  );

  const goToPage = useCallback(
    async (page: number) => {
      await fetchRehearsals(page);
    },
    [fetchRehearsals]
  );

  return {
    ...state,
    fetchRehearsals,
    createRehearsal,
    updateRehearsal,
    deleteRehearsal,
    goToPage,
  };
}

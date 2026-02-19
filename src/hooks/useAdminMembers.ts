import { useState, useCallback } from "react";
import * as adminService from "../services/admin";
import type { MemberProfile, ApiResponse } from "../types";
import { toast } from "sonner";

interface UseAdminMembersState {
  members: MemberProfile[];
  total: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  search: string;
  status: string;
}

export function useAdminMembers(pageSize = 10) {
  const [state, setState] = useState<UseAdminMembersState>({
    members: [],
    total: 0,
    isLoading: false,
    error: null,
    currentPage: 1,
    search: "",
    status: "",
  });

  const fetchMembers = useCallback(
    async (page = 1, search = "", status = "") => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await adminService.getAllMembers(search, status, page, pageSize);
        if (response.data) {
          setState((prev) => ({
            ...prev,
            members: response.data.members,
            total: response.data.total,
            currentPage: page,
            search,
            status,
            isLoading: false,
          }));
        } else {
          throw new Error(response.error || "Error al cargar miembros");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        setState((prev) => ({ ...prev, error: message, isLoading: false }));
        toast.error(message);
      }
    },
    [pageSize]
  );

  const createMember = useCallback(
    async (data: Partial<MemberProfile>) => {
      try {
        const response = await adminService.createMember(data);
        if (response.data) {
          toast.success("Miembro creado exitosamente");
          await fetchMembers(state.currentPage, state.search, state.status);
          return response.data;
        } else {
          throw new Error(response.error || "Error al crear miembro");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        throw error;
      }
    },
    [fetchMembers, state.currentPage, state.search, state.status]
  );

  const updateMember = useCallback(
    async (id: string, data: Partial<MemberProfile>) => {
      try {
        const response = await adminService.updateMember(id, data);
        if (response.data) {
          toast.success("Miembro actualizado exitosamente");
          await fetchMembers(state.currentPage, state.search, state.status);
          return response.data;
        } else {
          throw new Error(response.error || "Error al actualizar miembro");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        throw error;
      }
    },
    [fetchMembers, state.currentPage, state.search, state.status]
  );

  const deactivateMember = useCallback(
    async (id: string) => {
      try {
        const response = await adminService.deactivateMember(id);
        if (response.data) {
          toast.success("Miembro desactivado exitosamente");
          await fetchMembers(state.currentPage, state.search, state.status);
          return response.data;
        } else {
          throw new Error(response.error || "Error al desactivar miembro");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        throw error;
      }
    },
    [fetchMembers, state.currentPage, state.search, state.status]
  );

  const searchMembers = useCallback(
    async (query: string) => {
      await fetchMembers(1, query, state.status);
    },
    [fetchMembers, state.status]
  );

  const filterByStatus = useCallback(
    async (filterStatus: string) => {
      await fetchMembers(1, state.search, filterStatus);
    },
    [fetchMembers, state.search]
  );

  const goToPage = useCallback(
    async (page: number) => {
      await fetchMembers(page, state.search, state.status);
    },
    [fetchMembers, state.search, state.status]
  );

  return {
    ...state,
    fetchMembers,
    createMember,
    updateMember,
    deactivateMember,
    searchMembers,
    filterByStatus,
    goToPage,
  };
}

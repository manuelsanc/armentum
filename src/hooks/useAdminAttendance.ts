import { useState, useCallback } from "react";
import * as adminService from "../services/admin";
import type { Attendance, Rehearsal } from "../types";
import { toast } from "sonner";

interface UseAdminAttendanceState {
  attendances: Attendance[];
  rehearsals: Rehearsal[];
  selectedRehearsal: Rehearsal | null;
  isLoading: boolean;
  error: string | null;
  voiceFilter: string;
}

export function useAdminAttendance() {
  const [state, setState] = useState<UseAdminAttendanceState>({
    attendances: [],
    rehearsals: [],
    selectedRehearsal: null,
    isLoading: false,
    error: null,
    voiceFilter: "",
  });

  const fetchRehearsals = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await adminService.getAllRehearsals(1, 100);
      if (response.data) {
        setState((prev) => ({
          ...prev,
          rehearsals: response.data?.rehearsals || [],
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
  }, []);

  const fetchAttendance = useCallback(async (rehearsalId: string, voz?: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await adminService.getRehearsalAttendance(rehearsalId, voz);
      if (response.data) {
        const rehearsalResponse = await adminService.getRehearsalById(rehearsalId);
        setState((prev) => ({
          ...prev,
          attendances: response.data || [],
          selectedRehearsal: rehearsalResponse.data || null,
          voiceFilter: voz || "",
          isLoading: false,
        }));
      } else {
        throw new Error(response.error || "Error al cargar asistencias");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      setState((prev) => ({ ...prev, error: message, isLoading: false }));
      toast.error(message);
    }
  }, []);

  const updateAttendance = useCallback(
    async (
      rehearsalId: string,
      attendanceId: string,
      presente: boolean,
      justificacion?: string
    ) => {
      try {
        const response = await adminService.updateAttendance(rehearsalId, attendanceId, {
          presente,
          justificacion,
        });
        if (response.data) {
          toast.success(presente ? "Marcado como presente" : "Marcado como ausente");
          if (state.selectedRehearsal) {
            await fetchAttendance(state.selectedRehearsal.id, state.voiceFilter || undefined);
          }
          return response.data;
        } else {
          throw new Error(response.error || "Error al actualizar asistencia");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        throw error;
      }
    },
    [state.selectedRehearsal, state.voiceFilter, fetchAttendance]
  );

  const markPresent = useCallback(
    async (rehearsalId: string, attendanceId: string) => {
      return updateAttendance(rehearsalId, attendanceId, true);
    },
    [updateAttendance]
  );

  const markAbsent = useCallback(
    async (rehearsalId: string, attendanceId: string, justificacion?: string) => {
      return updateAttendance(rehearsalId, attendanceId, false, justificacion);
    },
    [updateAttendance]
  );

  const getReport = useCallback(async (startDate: string, endDate: string, memberId?: string) => {
    try {
      const response = await adminService.getAttendanceReport(startDate, endDate, memberId);
      if (response.data) {
        return response.data;
      } else {
        throw new Error(response.error || "Error al obtener reporte");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      toast.error(message);
      throw error;
    }
  }, []);

  const filterByVoice = useCallback(
    async (voz: string) => {
      if (state.selectedRehearsal) {
        await fetchAttendance(state.selectedRehearsal.id, voz || undefined);
      }
    },
    [state.selectedRehearsal, fetchAttendance]
  );

  return {
    ...state,
    fetchRehearsals,
    fetchAttendance,
    updateAttendance,
    markPresent,
    markAbsent,
    getReport,
    filterByVoice,
  };
}

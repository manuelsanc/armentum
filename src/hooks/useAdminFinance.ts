import { useState, useCallback } from "react";
import * as adminService from "../services/admin";
import type { Cuota, FinanceHistory, FinanceSummary } from "../types";
import { toast } from "sonner";

interface UseAdminFinanceState {
  cuotas: Cuota[];
  payments: FinanceHistory[];
  summary: FinanceSummary | null;
  total: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  statusFilter: string;
  memberIdFilter: string;
}

export function useAdminFinance(pageSize = 10) {
  const [state, setState] = useState<UseAdminFinanceState>({
    cuotas: [],
    payments: [],
    summary: null,
    total: 0,
    isLoading: false,
    error: null,
    currentPage: 1,
    statusFilter: "",
    memberIdFilter: "",
  });

  const fetchSummary = useCallback(async () => {
    try {
      const response = await adminService.getFinanceSummary();
      setState((prev) => ({ ...prev, summary: response.data ?? null }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      toast.error(message);
    }
  }, []);

  const fetchCuotas = useCallback(
    async (page = 1, statusFilter = "", memberIdFilter = "") => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await adminService.getAllCuotas(
          statusFilter || undefined,
          memberIdFilter || undefined,
          page,
          pageSize
        );
        if (!response.data) throw new Error(response.error || "Error al cargar cuotas");
        setState((prev) => ({
          ...prev,
          cuotas: response.data?.cuotas ?? [],
          total: response.data?.total ?? 0,
          currentPage: page,
          statusFilter,
          memberIdFilter,
          isLoading: false,
        }));
        await fetchSummary();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        setState((prev) => ({ ...prev, error: message, isLoading: false }));
        toast.error(message);
      }
    },
    [pageSize, fetchSummary]
  );

  const createCuota = useCallback(
    async (data: Partial<Cuota>) => {
      try {
        const response = await adminService.createCuota(data);
        if (!response.data) throw new Error(response.error || "Error al crear cuota");
        toast.success("Cuota creada exitosamente");
        await fetchCuotas(state.currentPage, state.statusFilter, state.memberIdFilter);
        return response.data;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        throw error;
      }
    },
    [fetchCuotas, state.currentPage, state.statusFilter, state.memberIdFilter]
  );

  const updateCuota = useCallback(
    async (id: string, data: Partial<Cuota>) => {
      try {
        const response = await adminService.updateCuota(id, data);
        if (!response.data) throw new Error(response.error || "Error al actualizar cuota");
        toast.success("Cuota actualizada exitosamente");
        await fetchCuotas(state.currentPage, state.statusFilter, state.memberIdFilter);
        return response.data;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        throw error;
      }
    },
    [fetchCuotas, state.currentPage, state.statusFilter, state.memberIdFilter]
  );

  const markAsPaid = useCallback(
    async (cuotaId: string, paymentData: Partial<FinanceHistory>) => {
      try {
        const response = await adminService.markCuotaAsPaid(cuotaId, paymentData);
        if (!response.data) throw new Error(response.error || "Error al registrar pago");
        toast.success("Pago registrado exitosamente");
        await fetchCuotas(state.currentPage, state.statusFilter, state.memberIdFilter);
        return response.data;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        throw error;
      }
    },
    [fetchCuotas, state.currentPage, state.statusFilter, state.memberIdFilter]
  );

  const fetchPayments = useCallback(
    async (page = 1) => {
      try {
        const response = await adminService.getPaymentHistory(page, pageSize);
        if (response.data) {
          setState((prev) => ({
            ...prev,
            payments: response.data.payments,
            total: response.data.total,
          }));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
      }
    },
    [pageSize]
  );

  const getReport = useCallback(async (startDate: string, endDate: string, memberId?: string) => {
    try {
      const response = await adminService.getFinanceReport(startDate, endDate, memberId);
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

  const filterByStatus = useCallback(
    async (statusFilter: string) => {
      await fetchCuotas(1, statusFilter, state.memberIdFilter);
    },
    [fetchCuotas, state.memberIdFilter]
  );

  const filterByMember = useCallback(
    async (memberId: string) => {
      await fetchCuotas(1, state.statusFilter, memberId);
    },
    [fetchCuotas, state.statusFilter]
  );

  const goToPage = useCallback(
    async (page: number) => {
      await fetchCuotas(page, state.statusFilter, state.memberIdFilter);
    },
    [fetchCuotas, state.statusFilter, state.memberIdFilter]
  );

  return {
    ...state,
    fetchCuotas,
    fetchSummary,
    createCuota,
    updateCuota,
    markAsPaid,
    fetchPayments,
    getReport,
    filterByStatus,
    filterByMember,
    goToPage,
  };
}

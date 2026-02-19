import { apiGet } from "./api";
import type { Cuota, FinanceHistory, FinanceSummary, ApiResponse } from "../types";

export async function getCuotas(): Promise<ApiResponse<Cuota[]>> {
  return apiGet<Cuota[]>("/finance/me");
}

export async function getFinanceHistory(): Promise<ApiResponse<FinanceHistory[]>> {
  return apiGet<FinanceHistory[]>("/finance/me/history");
}

export async function getFinanceSummary(): Promise<ApiResponse<FinanceSummary>> {
  return apiGet<FinanceSummary>("/finance/me/summary");
}

export async function getCuotaById(id: string): Promise<ApiResponse<Cuota>> {
  return apiGet<Cuota>(`/finance/${id}`);
}

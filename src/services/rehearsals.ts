import { apiGet } from "./api";
import type { Rehearsal, ApiResponse } from "../types";

export async function getRehearsals(): Promise<ApiResponse<Rehearsal[]>> {
  return apiGet<Rehearsal[]>("/rehearsals");
}

export async function getUpcomingRehearsals(): Promise<ApiResponse<Rehearsal[]>> {
  return apiGet<Rehearsal[]>("/rehearsals?state=scheduled");
}

export async function getRehearsalById(id: string): Promise<ApiResponse<Rehearsal>> {
  return apiGet<Rehearsal>(`/rehearsals/${id}`);
}

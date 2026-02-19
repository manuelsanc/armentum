import { apiCall } from "./api";
import type {
  MemberProfile,
  Event,
  Rehearsal,
  Attendance,
  Cuota,
  FinanceHistory,
  ApiResponse,
} from "../types";

// ============ MEMBERS ============

export async function getAllMembers(
  search?: string,
  status?: string,
  page = 1,
  limit = 10
): Promise<ApiResponse<{ members: MemberProfile[]; total: number }>> {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  return apiCall<{ members: MemberProfile[]; total: number }>(
    `/admin/members?${params.toString()}`
  );
}

export async function createMember(
  data: Partial<MemberProfile>
): Promise<ApiResponse<MemberProfile>> {
  return apiCall<MemberProfile>("/admin/members", "POST", data);
}

export async function updateMember(
  id: string,
  data: Partial<MemberProfile>
): Promise<ApiResponse<MemberProfile>> {
  return apiCall<MemberProfile>(`/admin/members/${id}`, "PUT", data);
}

export async function deactivateMember(id: string): Promise<ApiResponse<MemberProfile>> {
  return apiCall<MemberProfile>(`/admin/members/${id}/deactivate`, "PUT", {
    activo: false,
  });
}

export async function getMemberById(id: string): Promise<ApiResponse<MemberProfile>> {
  return apiCall<MemberProfile>(`/admin/members/${id}`);
}

// ============ EVENTS ============

export async function getAllEvents(
  page = 1,
  limit = 10
): Promise<ApiResponse<{ events: Event[]; total: number }>> {
  return apiCall<{ events: Event[]; total: number }>(`/admin/events?page=${page}&limit=${limit}`);
}

export async function createEvent(data: Partial<Event>): Promise<ApiResponse<Event>> {
  return apiCall<Event>("/admin/events", "POST", data);
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<ApiResponse<Event>> {
  return apiCall<Event>(`/admin/events/${id}`, "PUT", data);
}

export async function deleteEvent(id: string): Promise<ApiResponse<void>> {
  return apiCall<void>(`/admin/events/${id}`, "DELETE");
}

export async function getEventById(id: string): Promise<ApiResponse<Event>> {
  return apiCall<Event>(`/admin/events/${id}`);
}

// ============ REHEARSALS ============

export async function getAllRehearsals(
  page = 1,
  limit = 10
): Promise<ApiResponse<{ rehearsals: Rehearsal[]; total: number }>> {
  return apiCall<{ rehearsals: Rehearsal[]; total: number }>(
    `/admin/rehearsals?page=${page}&limit=${limit}`
  );
}

export async function createRehearsal(data: Partial<Rehearsal>): Promise<ApiResponse<Rehearsal>> {
  return apiCall<Rehearsal>("/admin/rehearsals", "POST", data);
}

export async function updateRehearsal(
  id: string,
  data: Partial<Rehearsal>
): Promise<ApiResponse<Rehearsal>> {
  return apiCall<Rehearsal>(`/admin/rehearsals/${id}`, "PUT", data);
}

export async function deleteRehearsal(id: string): Promise<ApiResponse<void>> {
  return apiCall<void>(`/admin/rehearsals/${id}`, "DELETE");
}

export async function getRehearsalById(id: string): Promise<ApiResponse<Rehearsal>> {
  return apiCall<Rehearsal>(`/admin/rehearsals/${id}`);
}

// ============ ATTENDANCE ============

export async function getRehearsalAttendance(
  rehearsalId: string
): Promise<ApiResponse<Attendance[]>> {
  return apiCall<Attendance[]>(`/admin/rehearsals/${rehearsalId}/attendance`);
}

export async function createAttendance(
  rehearsalId: string,
  data: Partial<Attendance>
): Promise<ApiResponse<Attendance>> {
  return apiCall<Attendance>(`/admin/rehearsals/${rehearsalId}/attendance`, "POST", data);
}

export async function updateAttendance(
  rehearsalId: string,
  attendanceId: string,
  data: Partial<Attendance>
): Promise<ApiResponse<Attendance>> {
  return apiCall<Attendance>(
    `/admin/rehearsals/${rehearsalId}/attendance/${attendanceId}`,
    "PUT",
    data
  );
}

export async function getAttendanceReport(
  startDate: string,
  endDate: string,
  memberId?: string
): Promise<ApiResponse<any>> {
  const params = new URLSearchParams();
  params.append("startDate", startDate);
  params.append("endDate", endDate);
  if (memberId) params.append("memberId", memberId);

  return apiCall<any>(`/admin/attendance/report?${params.toString()}`);
}

// ============ FINANCE ============

export async function getAllCuotas(
  status?: string,
  memberId?: string,
  page = 1,
  limit = 10
): Promise<ApiResponse<{ cuotas: Cuota[]; total: number }>> {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (memberId) params.append("memberId", memberId);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  return apiCall<{ cuotas: Cuota[]; total: number }>(`/admin/finance/cuotas?${params.toString()}`);
}

export async function createCuota(data: Partial<Cuota>): Promise<ApiResponse<Cuota>> {
  return apiCall<Cuota>("/admin/finance/cuotas", "POST", data);
}

export async function updateCuota(id: string, data: Partial<Cuota>): Promise<ApiResponse<Cuota>> {
  return apiCall<Cuota>(`/admin/finance/cuotas/${id}`, "PUT", data);
}

export async function markCuotaAsPaid(
  cuotaId: string,
  paymentData: Partial<FinanceHistory>
): Promise<ApiResponse<FinanceHistory>> {
  return apiCall<FinanceHistory>(`/admin/finance/cuotas/${cuotaId}/pay`, "POST", paymentData);
}

export async function getCuotaById(id: string): Promise<ApiResponse<Cuota>> {
  return apiCall<Cuota>(`/admin/finance/cuotas/${id}`);
}

export async function getFinanceSummary(): Promise<
  ApiResponse<{
    totalIngresos: number;
    totalPendiente: number;
    totalVencido: number;
  }>
> {
  return apiCall<{
    totalIngresos: number;
    totalPendiente: number;
    totalVencido: number;
  }>("/admin/finance/summary");
}

export async function getFinanceReport(
  startDate: string,
  endDate: string,
  memberId?: string
): Promise<ApiResponse<any>> {
  const params = new URLSearchParams();
  params.append("startDate", startDate);
  params.append("endDate", endDate);
  if (memberId) params.append("memberId", memberId);

  return apiCall<any>(`/admin/finance/report?${params.toString()}`);
}

export async function getPaymentHistory(
  page = 1,
  limit = 10
): Promise<ApiResponse<{ payments: FinanceHistory[]; total: number }>> {
  return apiCall<{ payments: FinanceHistory[]; total: number }>(
    `/admin/finance/payments?page=${page}&limit=${limit}`
  );
}

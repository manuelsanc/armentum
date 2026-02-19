import { apiGet } from "./api";
import type { Attendance, AttendanceStats, ApiResponse } from "../types";

export async function getAttendance(): Promise<ApiResponse<Attendance[]>> {
  return apiGet<Attendance[]>("/attendance/me");
}

export async function getAttendanceStats(): Promise<ApiResponse<AttendanceStats>> {
  return apiGet<AttendanceStats>("/attendance/me/stats");
}

export async function getAttendanceById(id: string): Promise<ApiResponse<Attendance>> {
  return apiGet<Attendance>(`/attendance/${id}`);
}

import { apiGet, apiPut } from "./api";
import type { MemberProfile, ApiResponse } from "../types";

export async function getProfile(): Promise<ApiResponse<MemberProfile>> {
  return apiGet<MemberProfile>("/members/profile");
}

export async function updateProfile(
  data: Partial<MemberProfile>
): Promise<ApiResponse<MemberProfile>> {
  return apiPut<MemberProfile>("/members/profile", data);
}

export async function getProfileById(id: string): Promise<ApiResponse<MemberProfile>> {
  return apiGet<MemberProfile>(`/members/${id}`);
}

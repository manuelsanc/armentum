/**
 * Gallery Service
 * API calls for gallery image management (admin and public)
 */

import type {
  GalleryImage,
  GalleryImageListResponse,
  GalleryImageUpdate,
  ApiResponse,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function getStoredTokens() {
  const accessToken = sessionStorage.getItem("accessToken");
  const refreshToken = sessionStorage.getItem("refreshToken");
  if (accessToken && refreshToken) {
    return { accessToken, refreshToken };
  }
  return null;
}

/**
 * Admin: Get gallery images with filters
 */
export async function getGalleryImages(
  search?: string,
  tags?: string[],
  startDate?: string,
  endDate?: string,
  page: number = 1,
  limit: number = 25
): Promise<ApiResponse<GalleryImageListResponse>> {
  const offset = (page - 1) * limit;
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  if (search) params.append("search", search);
  if (tags && tags.length > 0) params.append("tags", tags.join(","));
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  const tokens = getStoredTokens();
  const response = await fetch(`${API_BASE_URL}/admin/gallery?${params.toString()}`, {
    method: "GET",
    headers: {
      ...(tokens?.accessToken && { Authorization: `Bearer ${tokens.accessToken}` }),
    },
  });

  const data = await response.json();
  return {
    data: response.ok ? data : undefined,
    error: response.ok ? undefined : data.detail || "Error fetching images",
    status: response.status,
  };
}

/**
 * Admin: Upload a new gallery image
 */
export async function uploadGalleryImage(
  titulo: string,
  fecha: string,
  file: File,
  descripcion?: string,
  tags?: string[]
): Promise<ApiResponse<{ message: string; image: GalleryImage }>> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("titulo", titulo);
  formData.append("fecha", fecha);

  if (descripcion) {
    formData.append("descripcion", descripcion);
  }

  if (tags && tags.length > 0) {
    formData.append("tags", tags.join(","));
  }

  const tokens = getStoredTokens();
  const response = await fetch(`${API_BASE_URL}/admin/gallery`, {
    method: "POST",
    headers: {
      ...(tokens?.accessToken && { Authorization: `Bearer ${tokens.accessToken}` }),
    },
    body: formData,
  });

  const data = await response.json();
  return {
    data: response.ok ? data : undefined,
    error: response.ok ? undefined : data.detail || "Error uploading image",
    status: response.status,
  };
}

/**
 * Admin: Update gallery image metadata
 */
export async function updateGalleryImage(
  id: string,
  data: GalleryImageUpdate
): Promise<ApiResponse<GalleryImage>> {
  const formData = new FormData();

  if (data.titulo) formData.append("titulo", data.titulo);
  if (data.descripcion !== undefined)
    formData.append("descripcion", data.descripcion);
  if (data.fecha) formData.append("fecha", data.fecha);
  if (data.tags !== undefined)
    formData.append("tags", data.tags.join(","));

  const tokens = getStoredTokens();
  const response = await fetch(`${API_BASE_URL}/admin/gallery/${id}`, {
    method: "PUT",
    headers: {
      ...(tokens?.accessToken && { Authorization: `Bearer ${tokens.accessToken}` }),
    },
    body: formData,
  });

  const responseData = await response.json();
  return {
    data: response.ok ? responseData : undefined,
    error: response.ok ? undefined : responseData.detail || "Error updating image",
    status: response.status,
  };
}

/**
 * Admin: Replace the image file
 */
export async function replaceGalleryImage(
  id: string,
  file: File
): Promise<ApiResponse<GalleryImage>> {
  const formData = new FormData();
  formData.append("file", file);

  const tokens = getStoredTokens();
  const response = await fetch(`${API_BASE_URL}/admin/gallery/${id}/replace`, {
    method: "PUT",
    headers: {
      ...(tokens?.accessToken && { Authorization: `Bearer ${tokens.accessToken}` }),
    },
    body: formData,
  });

  const data = await response.json();
  return {
    data: response.ok ? data : undefined,
    error: response.ok ? undefined : data.detail || "Error replacing image",
    status: response.status,
  };
}

/**
 * Admin: Delete a gallery image permanently
 */
export async function deleteGalleryImage(
  id: string
): Promise<ApiResponse<{ message: string }>> {
  const tokens = getStoredTokens();
  const response = await fetch(`${API_BASE_URL}/admin/gallery/${id}`, {
    method: "DELETE",
    headers: {
      ...(tokens?.accessToken && { Authorization: `Bearer ${tokens.accessToken}` }),
    },
  });

  const data = await response.json();
  return {
    data: response.ok ? data : undefined,
    error: response.ok ? undefined : data.detail || "Error deleting image",
    status: response.status,
  };
}

/**
 * Admin: Get all unique tags
 */
export async function getAllGalleryTags(): Promise<ApiResponse<string[]>> {
  const tokens = getStoredTokens();
  const response = await fetch(`${API_BASE_URL}/admin/gallery/tags`, {
    method: "GET",
    headers: {
      ...(tokens?.accessToken && { Authorization: `Bearer ${tokens.accessToken}` }),
    },
  });

  const data = await response.json();
  return {
    data: response.ok ? data : undefined,
    error: response.ok ? undefined : data.detail || "Error fetching tags",
    status: response.status,
  };
}

/**
 * Public: Get gallery images for the public page
 */
export async function getPublicGallery(
  tags?: string[],
  limit: number = 100
): Promise<ApiResponse<GalleryImageListResponse>> {
  const params = new URLSearchParams();
  params.append("limit", limit.toString());

  if (tags && tags.length > 0) {
    params.append("tags", tags.join(","));
  }

  const response = await fetch(`${API_BASE_URL}/gallery?${params.toString()}`, {
    method: "GET",
  });

  const data = await response.json();
  return {
    data: response.ok ? data : undefined,
    error: response.ok ? undefined : data.detail || "Error fetching gallery",
    status: response.status,
  };
}

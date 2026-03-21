import { useState, useCallback, useEffect } from "react";
import * as galleryService from "../services/gallery";
import type { GalleryImage } from "../types";
import { toast } from "sonner";

interface UseGalleryState {
  images: GalleryImage[];
  total: number;
  isLoading: boolean;
  error: string | null;
  selectedTags: string[];
}

export function useGallery(autoFetch = true) {
  const [state, setState] = useState<UseGalleryState>({
    images: [],
    total: 0,
    isLoading: false,
    error: null,
    selectedTags: [],
  });

  const fetchImages = useCallback(async (tags: string[] = []) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await galleryService.getPublicGallery(tags, 100);

      if (response.data) {
        setState((prev) => ({
          ...prev,
          images: response.data.images,
          total: response.data.total,
          selectedTags: tags,
          isLoading: false,
        }));
      } else {
        throw new Error(response.error || "Error al cargar galería");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      setState((prev) => ({ ...prev, error: message, isLoading: false }));
      toast.error(message);
    }
  }, []);

  const filterByTags = useCallback(
    async (tags: string[]) => {
      await fetchImages(tags);
    },
    [fetchImages]
  );

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchImages();
    }
  }, [autoFetch, fetchImages]);

  return {
    ...state,
    fetchImages,
    filterByTags,
  };
}

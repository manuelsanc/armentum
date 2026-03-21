import { useState, useCallback } from "react";
import * as galleryService from "../services/gallery";
import type { GalleryImage, GalleryImageUpdate } from "../types";
import { toast } from "sonner";

interface UseAdminGalleryState {
  images: GalleryImage[];
  total: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  search: string;
  selectedTags: string[];
  startDate: string;
  endDate: string;
}

export function useAdminGallery(pageSize = 25) {
  const [state, setState] = useState<UseAdminGalleryState>({
    images: [],
    total: 0,
    isLoading: false,
    error: null,
    currentPage: 1,
    search: "",
    selectedTags: [],
    startDate: "",
    endDate: "",
  });

  const fetchImages = useCallback(
    async (
      page = 1,
      search = "",
      tags: string[] = [],
      startDate = "",
      endDate = ""
    ) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await galleryService.getGalleryImages(
          search,
          tags,
          startDate,
          endDate,
          page,
          pageSize
        );

        if (response.data) {
          setState((prev) => ({
            ...prev,
            images: response.data.images,
            total: response.data.total,
            currentPage: page,
            search,
            selectedTags: tags,
            startDate,
            endDate,
            isLoading: false,
          }));
        } else {
          throw new Error(response.error || "Error al cargar imágenes");
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error desconocido";
        setState((prev) => ({ ...prev, error: message, isLoading: false }));
        toast.error(message);
      }
    },
    [pageSize]
  );

  const uploadImage = useCallback(
    async (
      titulo: string,
      fecha: string,
      file: File,
      descripcion?: string,
      tags?: string[]
    ) => {
      try {
        const response = await galleryService.uploadGalleryImage(
          titulo,
          fecha,
          file,
          descripcion,
          tags
        );

        if (response.data) {
          toast.success("Imagen subida exitosamente");
          await fetchImages(
            state.currentPage,
            state.search,
            state.selectedTags,
            state.startDate,
            state.endDate
          );
          return response.data.image;
        } else {
          throw new Error(response.error || "Error al subir imagen");
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        throw error;
      }
    },
    [
      fetchImages,
      state.currentPage,
      state.search,
      state.selectedTags,
      state.startDate,
      state.endDate,
    ]
  );

  const updateImage = useCallback(
    async (id: string, data: GalleryImageUpdate) => {
      try {
        const response = await galleryService.updateGalleryImage(id, data);

        if (response.data) {
          toast.success("Imagen actualizada exitosamente");
          await fetchImages(
            state.currentPage,
            state.search,
            state.selectedTags,
            state.startDate,
            state.endDate
          );
          return response.data;
        } else {
          throw new Error(response.error || "Error al actualizar imagen");
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        throw error;
      }
    },
    [
      fetchImages,
      state.currentPage,
      state.search,
      state.selectedTags,
      state.startDate,
      state.endDate,
    ]
  );

  const replaceImage = useCallback(
    async (id: string, file: File) => {
      try {
        const response = await galleryService.replaceGalleryImage(id, file);

        if (response.data) {
          toast.success("Imagen reemplazada exitosamente");
          await fetchImages(
            state.currentPage,
            state.search,
            state.selectedTags,
            state.startDate,
            state.endDate
          );
          return response.data;
        } else {
          throw new Error(response.error || "Error al reemplazar imagen");
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        throw error;
      }
    },
    [
      fetchImages,
      state.currentPage,
      state.search,
      state.selectedTags,
      state.startDate,
      state.endDate,
    ]
  );

  const deleteImage = useCallback(
    async (id: string) => {
      try {
        const response = await galleryService.deleteGalleryImage(id);

        if (response.data) {
          toast.success("Imagen eliminada exitosamente");
          await fetchImages(
            state.currentPage,
            state.search,
            state.selectedTags,
            state.startDate,
            state.endDate
          );
          return response.data;
        } else {
          throw new Error(response.error || "Error al eliminar imagen");
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        throw error;
      }
    },
    [
      fetchImages,
      state.currentPage,
      state.search,
      state.selectedTags,
      state.startDate,
      state.endDate,
    ]
  );

  const searchImages = useCallback(
    async (query: string) => {
      await fetchImages(
        1,
        query,
        state.selectedTags,
        state.startDate,
        state.endDate
      );
    },
    [fetchImages, state.selectedTags, state.startDate, state.endDate]
  );

  const filterByTags = useCallback(
    async (tags: string[]) => {
      await fetchImages(1, state.search, tags, state.startDate, state.endDate);
    },
    [fetchImages, state.search, state.startDate, state.endDate]
  );

  const filterByDateRange = useCallback(
    async (startDate: string, endDate: string) => {
      await fetchImages(
        1,
        state.search,
        state.selectedTags,
        startDate,
        endDate
      );
    },
    [fetchImages, state.search, state.selectedTags]
  );

  const goToPage = useCallback(
    async (page: number) => {
      await fetchImages(
        page,
        state.search,
        state.selectedTags,
        state.startDate,
        state.endDate
      );
    },
    [fetchImages, state.search, state.selectedTags, state.startDate, state.endDate]
  );

  return {
    ...state,
    fetchImages,
    uploadImage,
    updateImage,
    replaceImage,
    deleteImage,
    searchImages,
    filterByTags,
    filterByDateRange,
    goToPage,
  };
}

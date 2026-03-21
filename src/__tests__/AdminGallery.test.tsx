/**
 * Tests for AdminGallery Component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminGallery } from "../app/components/admin/AdminGallery";
import * as galleryService from "../services/gallery";

// Mock the gallery service
vi.mock("../services/gallery");

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockGalleryImages = [
  {
    id: "1",
    titulo: "Concierto de Navidad",
    descripcion: "Concierto anual",
    fecha: "2024-12-25",
    tags: ["conciertos", "navidad"],
    image_url: "https://example.com/image1_full.jpg",
    thumbnail_url: "https://example.com/image1_thumb.jpg",
    created_by: "user1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    titulo: "Ensayo General",
    descripcion: "Preparación para el concierto",
    fecha: "2024-12-10",
    tags: ["ensayos"],
    image_url: "https://example.com/image2_full.jpg",
    thumbnail_url: "https://example.com/image2_thumb.jpg",
    created_by: "user1",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
];

describe("AdminGallery Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock successful API responses
    vi.mocked(galleryService.getGalleryImages).mockResolvedValue({
      data: {
        total: mockGalleryImages.length,
        limit: 25,
        offset: 0,
        images: mockGalleryImages,
      },
      status: 200,
    });
  });

  it("renders the gallery management interface", async () => {
    render(<AdminGallery />);

    expect(screen.getByText("Gestión de Galería")).toBeInTheDocument();
    expect(screen.getByText("Subir Imagen")).toBeInTheDocument();
  });

  it("displays gallery images in table", async () => {
    render(<AdminGallery />);

    await waitFor(() => {
      expect(screen.getByText("Concierto de Navidad")).toBeInTheDocument();
      expect(screen.getByText("Ensayo General")).toBeInTheDocument();
    });
  });

  it("opens upload dialog when clicking 'Subir Imagen' button", async () => {
    const user = userEvent.setup();
    render(<AdminGallery />);

    const uploadButton = screen.getByText("Subir Imagen");
    await user.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText("Subir Nueva Imagen")).toBeInTheDocument();
      expect(screen.getByLabelText(/Archivo de Imagen/i)).toBeInTheDocument();
    });
  });

  it("handles image search", async () => {
    const user = userEvent.setup();
    render(<AdminGallery />);

    const searchInput = screen.getByPlaceholderText(/Buscar por título/i);
    await user.type(searchInput, "Concierto");

    await waitFor(() => {
      expect(galleryService.getGalleryImages).toHaveBeenCalledWith(
        "Concierto",
        [],
        "",
        "",
        1,
        25
      );
    });
  });

  it("displays tags as badges", async () => {
    render(<AdminGallery />);

    await waitFor(() => {
      expect(screen.getByText("conciertos")).toBeInTheDocument();
      expect(screen.getByText("navidad")).toBeInTheDocument();
      expect(screen.getByText("ensayos")).toBeInTheDocument();
    });
  });

  it("opens edit dialog when clicking edit button", async () => {
    const user = userEvent.setup();
    render(<AdminGallery />);

    await waitFor(() => {
      expect(screen.getByText("Concierto de Navidad")).toBeInTheDocument();
    });

    // Find all edit buttons (icon buttons)
    const editButtons = screen.getAllByTitle("Editar metadatos");
    await user.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Editar Imagen")).toBeInTheDocument();
    });
  });

  it("submits upload form successfully", async () => {
    const user = userEvent.setup();

    vi.mocked(galleryService.uploadGalleryImage).mockResolvedValue({
      data: {
        message: "Success",
        image: mockGalleryImages[0],
      },
      status: 201,
    });

    render(<AdminGallery />);

    // Open upload dialog
    const uploadButton = screen.getByText("Subir Imagen");
    await user.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText("Subir Nueva Imagen")).toBeInTheDocument();
    });

    // Fill form
    const tituloInput = screen.getByLabelText(/Título/i);
    await user.type(tituloInput, "Nueva Imagen");

    const fechaInput = screen.getByLabelText(/Fecha/i);
    await user.type(fechaInput, "2024-12-31");

    // Create a mock file
    const file = new File(["dummy content"], "test.jpg", { type: "image/jpeg" });
    const fileInput = screen.getByLabelText(/Archivo de Imagen/i);
    await user.upload(fileInput, file);

    // Submit form
    const submitButton = screen.getByRole("button", { name: /Subir Imagen/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(galleryService.uploadGalleryImage).toHaveBeenCalled();
    });
  });

  it("handles delete confirmation", async () => {
    const user = userEvent.setup();

    vi.mocked(galleryService.deleteGalleryImage).mockResolvedValue({
      data: { message: "Deleted successfully" },
      status: 200,
    });

    render(<AdminGallery />);

    await waitFor(() => {
      expect(screen.getByText("Concierto de Navidad")).toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByTitle("Eliminar");
    await user.click(deleteButtons[0]);

    // Confirm deletion
    await waitFor(() => {
      expect(screen.getByText("¿Estás seguro?")).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole("button", { name: /Eliminar/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(galleryService.deleteGalleryImage).toHaveBeenCalledWith("1");
    });
  });

  it("shows empty state when no images", async () => {
    vi.mocked(galleryService.getGalleryImages).mockResolvedValue({
      data: {
        total: 0,
        limit: 25,
        offset: 0,
        images: [],
      },
      status: 200,
    });

    render(<AdminGallery />);

    await waitFor(() => {
      expect(screen.getByText("No se encontraron imágenes")).toBeInTheDocument();
    });
  });
});

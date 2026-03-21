import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAdminGallery } from "../../../hooks/useAdminGallery";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Plus, Edit, Trash2, Upload, Search } from "lucide-react";
import { Label } from "../ui/label";
import { TagInput } from "../ui/tag-input";
import type { GalleryImage } from "../../../types";
import { Badge } from "../ui/badge";

interface GalleryFormState {
  titulo: string;
  descripcion: string;
  fecha: string;
  tags: string[];
  file: File | null;
}

const formatDate = (input?: string): string => {
  if (!input) return new Date().toISOString().slice(0, 10);
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
};

export function AdminGallery(): JSX.Element {
  const {
    images,
    total,
    isLoading,
    currentPage,
    fetchImages,
    uploadImage,
    updateImage,
    replaceImage,
    deleteImage,
    searchImages,
    goToPage,
  } = useAdminGallery(25);

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isReplaceDialogOpen, setIsReplaceDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);

  const [formState, setFormState] = useState<GalleryFormState>({
    titulo: "",
    descripcion: "",
    fecha: new Date().toISOString().slice(0, 10),
    tags: [],
    file: null,
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    searchImages(value);
  };

  const handleOpenUploadDialog = () => {
    setFormState({
      titulo: "",
      descripcion: "",
      fecha: new Date().toISOString().slice(0, 10),
      tags: [],
      file: null,
    });
    setIsUploadDialogOpen(true);
  };

  const handleCloseUploadDialog = () => {
    setIsUploadDialogOpen(false);
    setFormState({
      titulo: "",
      descripcion: "",
      fecha: new Date().toISOString().slice(0, 10),
      tags: [],
      file: null,
    });
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.titulo || !formState.fecha || !formState.file) {
      toast.error("Título, fecha y archivo son requeridos");
      return;
    }

    setIsUploading(true);
    try {
      await uploadImage(
        formState.titulo,
        formState.fecha,
        formState.file,
        formState.descripcion || undefined,
        formState.tags.length > 0 ? formState.tags : undefined
      );
      handleCloseUploadDialog();
    } catch {
      // Error already handled by hook
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenEditDialog = (image: GalleryImage) => {
    setEditingImage(image);
    setFormState({
      titulo: image.titulo,
      descripcion: image.descripcion || "",
      fecha: formatDate(image.fecha),
      tags: image.tags || [],
      file: null,
    });
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingImage(null);
    setFormState({
      titulo: "",
      descripcion: "",
      fecha: new Date().toISOString().slice(0, 10),
      tags: [],
      file: null,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingImage || !formState.titulo || !formState.fecha) {
      toast.error("Título y fecha son requeridos");
      return;
    }

    setIsUpdating(true);
    try {
      await updateImage(editingImage.id, {
        titulo: formState.titulo,
        descripcion: formState.descripcion || undefined,
        fecha: formState.fecha,
        tags: formState.tags,
      });
      handleCloseEditDialog();
    } catch {
      // Error already handled by hook
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenReplaceDialog = (image: GalleryImage) => {
    setEditingImage(image);
    setReplaceFile(null);
    setIsReplaceDialogOpen(true);
  };

  const handleCloseReplaceDialog = () => {
    setIsReplaceDialogOpen(false);
    setEditingImage(null);
    setReplaceFile(null);
  };

  const handleReplaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingImage || !replaceFile) {
      toast.error("Por favor selecciona un archivo");
      return;
    }

    setIsReplacing(true);
    try {
      await replaceImage(editingImage.id, replaceFile);
      handleCloseReplaceDialog();
    } catch {
      // Error already handled by hook
    } finally {
      setIsReplacing(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setImageToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (imageToDelete) {
      try {
        await deleteImage(imageToDelete);
        setIsDeleteAlertOpen(false);
        setImageToDelete(null);
      } catch {
        // Error already handled by hook
      }
    }
  };

  const totalPages = Math.ceil(total / 25);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Gestión de Galería</CardTitle>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenUploadDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                Subir Imagen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Subir Nueva Imagen</DialogTitle>
                <DialogDescription>Completa los datos de la imagen</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upload-file">Archivo de Imagen *</Label>
                  <Input
                    id="upload-file"
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => setFormState({ ...formState, file: e.target.files?.[0] || null })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Formatos permitidos: JPEG, PNG, GIF, WEBP. Máximo 10MB.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upload-titulo">Título *</Label>
                  <Input
                    id="upload-titulo"
                    value={formState.titulo}
                    onChange={(e) => setFormState({ ...formState, titulo: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upload-fecha">Fecha *</Label>
                  <Input
                    id="upload-fecha"
                    type="date"
                    value={formState.fecha}
                    onChange={(e) => setFormState({ ...formState, fecha: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upload-descripcion">Descripción</Label>
                  <Textarea
                    id="upload-descripcion"
                    value={formState.descripcion}
                    onChange={(e) => setFormState({ ...formState, descripcion: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Etiquetas</Label>
                  <TagInput
                    tags={formState.tags}
                    onChange={(tags) => setFormState({ ...formState, tags })}
                    placeholder="Agregar etiquetas (conciertos, ensayos, giras...)"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseUploadDialog} disabled={isUploading}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? "Subiendo..." : "Subir Imagen"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título o descripción..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {isLoading && <div className="text-center py-8">Cargando...</div>}

          {!isLoading && images.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron imágenes
            </div>
          )}

          {!isLoading && images.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Vista Previa</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Etiquetas</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {images.map((image) => (
                    <TableRow key={image.id}>
                      <TableCell>
                        <img
                          src={image.thumbnail_url}
                          alt={image.titulo}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{image.titulo}</TableCell>
                      <TableCell>
                        {(() => {
                          // Parse date as local to avoid timezone issues
                          const [year, month, day] = image.fecha.split("-").map(Number);
                          const date = new Date(year, month - 1, day);
                          return date.toLocaleDateString();
                        })()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {image.tags && image.tags.length > 0 ? (
                            image.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">Sin etiquetas</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(image)}
                            title="Editar metadatos"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenReplaceDialog(image)}
                            title="Reemplazar imagen"
                          >
                            <Upload className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(image.id)}
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5) {
                          if (currentPage > 3) {
                            pageNum = currentPage - 2 + i;
                          }
                          if (currentPage > totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          }
                        }
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => goToPage(pageNum)}
                              isActive={currentPage === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Imagen</DialogTitle>
            <DialogDescription>Actualizar metadatos de la imagen</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-titulo">Título *</Label>
              <Input
                id="edit-titulo"
                value={formState.titulo}
                onChange={(e) => setFormState({ ...formState, titulo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-fecha">Fecha *</Label>
              <Input
                id="edit-fecha"
                type="date"
                value={formState.fecha}
                onChange={(e) => setFormState({ ...formState, fecha: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-descripcion">Descripción</Label>
              <Textarea
                id="edit-descripcion"
                value={formState.descripcion}
                onChange={(e) => setFormState({ ...formState, descripcion: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Etiquetas</Label>
              <TagInput
                tags={formState.tags}
                onChange={(tags) => setFormState({ ...formState, tags })}
                placeholder="Agregar etiquetas (conciertos, ensayos, giras...)"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseEditDialog} disabled={isUpdating}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Replace Dialog */}
      <Dialog open={isReplaceDialogOpen} onOpenChange={setIsReplaceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reemplazar Imagen</DialogTitle>
            <DialogDescription>
              Selecciona un nuevo archivo para reemplazar la imagen actual
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReplaceSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="replace-file">Nuevo Archivo de Imagen *</Label>
              <Input
                id="replace-file"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => setReplaceFile(e.target.files?.[0] || null)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Formatos permitidos: JPEG, PNG, GIF, WEBP. Máximo 10MB.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseReplaceDialog} disabled={isReplacing}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isReplacing}>
                {isReplacing ? "Reemplazando..." : "Reemplazar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la imagen y sus archivos del servidor.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

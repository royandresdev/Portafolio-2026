import { useState, useEffect } from "react";

interface UseImagesManagerProps {
  initialCover?: string | null;
  initialGallery?: string[];
  onRemoveExisting?: (url: string, index: number) => Promise<void>;
}

/**
 * Hook reutilizable y general para gestionar la carga local de imágenes,
 * previsualizaciones temporales y eliminación de imágenes de galería (nuevas o existentes).
 * Sigue el principio de Responsabilidad Única (SRP).
 */
export function useImagesManager({
  initialCover = null,
  initialGallery = [],
  onRemoveExisting,
}: UseImagesManagerProps = {}) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialCover);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(initialGallery);

  // Sincronizar previsualizaciones si cambian las iniciales externas (ej. al cargar datos de BD)
  useEffect(() => {
    setCoverPreview(initialCover);
  }, [initialCover]);

  // Usamos la concatenación de las URLs como dependencia de efecto para evitar bucles infinitos
  // por referencias de arrays de JS recreadas en cada renderizado.
  const galleryJoin = initialGallery?.join(",") || "";
  useEffect(() => {
    setGalleryPreviews(initialGallery || []);
  }, [galleryJoin]);

  // Manejo de carga local de la portada
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Manejo de carga local de múltiples imágenes de galería
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileList = Array.from(files);
      setGalleryFiles((prev) => [...prev, ...fileList]);

      const newPreviews = fileList.map((file) => URL.createObjectURL(file));
      setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // Remover imagen de galería
  const removeGalleryImage = async (index: number) => {
    const numExisting = initialGallery.length;

    if (index >= numExisting) {
      // Si es un archivo local nuevo
      const localIndex = index - numExisting;
      setGalleryFiles((prev) => prev.filter((_, i) => i !== localIndex));
      setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Si es una imagen ya existente en la base de datos/storage
      const urlToRemove = initialGallery[index];
      if (onRemoveExisting) {
        try {
          await onRemoveExisting(urlToRemove, index);
        } catch (err) {
          console.error("Falla en callback al remover imagen existente:", err);
        }
      }
      // Actualizar previsualización en el UI
      setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const reset = () => {
    setCoverFile(null);
    setCoverPreview(initialCover);
    setGalleryFiles([]);
    setGalleryPreviews(initialGallery);
  };

  return {
    coverFile,
    coverPreview,
    galleryFiles,
    galleryPreviews,
    handleCoverChange,
    handleGalleryChange,
    removeGalleryImage,
    reset,
  };
}

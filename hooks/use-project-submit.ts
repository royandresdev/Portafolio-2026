import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ProjectService, getPathFromUrl } from "@/services/projects";
import { createProjectAction, updateProjectAction } from "@/app/actions/projects";
import { useImagesManager } from "./use-images-manager";

interface ProjectData {
  id?: number | string;
  name: string;
  description: string;
  image: string;
  gallery_images?: string[];
  technologies: string[];
  linkDemo: string;
  linkRepo: string;
  linkFigma?: string;
  typeApp: string;
}

interface UseProjectSubmitProps {
  project?: ProjectData;
}

/**
 * Custom hook para encapsular la lógica de envío de formularios y mutaciones de proyectos.
 * Utiliza Server Actions para insertar/actualizar registros en la base de datos de manera segura y evitar desincronizaciones de sesión/RLS.
 */
export function useProjectSubmit({ project }: UseProjectSubmitProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const isEditMode = !!project;
  const supabase = createClient();

  // Callback para eliminar imágenes existentes en el storage cuando se quitan de la galería
  const handleRemoveExistingImage = async (url: string, index: number) => {
    const pathToRemove = getPathFromUrl(url);
    if (pathToRemove) {
      try {
        await ProjectService.removeStorageFiles(supabase, [pathToRemove]);
      } catch (err) {
        console.error("Error al eliminar imagen existente del storage:", err);
      }
    }

    // Sincronizar el objeto project prop si aplica
    if (project?.gallery_images) {
      project.gallery_images = project.gallery_images.filter((_, i) => i !== index);
    }
  };

  // Delegar gestión de visuales al hook especializado
  const {
    coverFile,
    coverPreview,
    galleryFiles,
    galleryPreviews,
    handleCoverChange,
    handleGalleryChange,
    removeGalleryImage,
  } = useImagesManager({
    initialCover: project?.image,
    initialGallery: project?.gallery_images,
    onRemoveExisting: handleRemoveExistingImage,
  });

  // Callback de envío de Formik
  const handleSubmit = async (values: {
    name: string;
    technologies: string;
    description: string;
    typeApp: string;
    linkDemo: string;
    linkRepo: string;
    linkFigma?: string;
  }) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      let projectId = project?.id;
      const techArray = values.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);

      // ── 1. GUARDAR O CREAR EL REGISTRO BASE (BD mediante Server Action) ──
      if (!isEditMode) {
        const result = await createProjectAction({
          name: values.name,
          description: values.description,
          technologies: techArray,
          typeApp: values.typeApp,
          linkDemo: values.linkDemo,
          linkRepo: values.linkRepo,
          linkFigma: values.linkFigma || null,
          image: "",
          gallery_images: [],
        });
        if (!result.success) {
          throw new Error(result.error);
        }
        projectId = result.data.id;
      } else {
        // Si estamos editando y el nombre cambió, renombrar los archivos existentes
        if (project.id) {
          const renamed = await ProjectService.renameImages(
            supabase,
            project.id,
            project.name,
            values.name,
            project
          );
          project.image = renamed.image || "";
          project.gallery_images = renamed.gallery_images;
        }
      }

      if (!projectId) throw new Error("No se pudo obtener el ID del proyecto");

      // ── 2. SUBIR NUEVOS ARCHIVOS A STORAGE (Lado del cliente) ──
      let coverUrl = isEditMode ? project?.image || "" : "";
      if (coverFile) {
        if (isEditMode && project?.image) {
          const oldCoverPath = getPathFromUrl(project.image);
          if (oldCoverPath) {
            await ProjectService.removeStorageFiles(supabase, [oldCoverPath]);
          }
        }

        coverUrl = await ProjectService.uploadCover(supabase, projectId, values.name, coverFile);
      }

      // Subir nuevas imágenes a galería
      const uploadedGalleryUrls = [...(isEditMode ? (project?.gallery_images || []) : [])];
      if (galleryFiles.length > 0) {
        const newUrls = await ProjectService.uploadGalleryImages(
          supabase,
          projectId,
          values.name,
          galleryFiles,
          uploadedGalleryUrls.length
        );
        uploadedGalleryUrls.push(...newUrls);
      }

      const result = await updateProjectAction(projectId, {
        name: values.name,
        description: values.description,
        technologies: techArray,
        typeApp: values.typeApp,
        linkDemo: values.linkDemo,
        linkRepo: values.linkRepo,
        linkFigma: values.linkFigma || null,
        image: coverUrl,
        gallery_images: uploadedGalleryUrls,
      });
      if (!result.success) {
        throw new Error(result.error);
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err: unknown) {
      console.error("Error al procesar el proyecto:", err);
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado al guardar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    errorMsg,
    coverPreview,
    galleryPreviews,
    handleCoverChange,
    handleGalleryChange,
    removeGalleryImage,
    handleSubmit,
  };
}

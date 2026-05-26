import { SupabaseClient } from "@supabase/supabase-js";

export interface ProjectInput {
  name: string;
  description: string;
  technologies: string[];
  typeApp: string;
  linkDemo: string;
  linkRepo: string;
  linkFigma?: string | null;
  image?: string;
  gallery_images?: string[];
}

// Helper para sanitizar nombres de archivos (Slugify)
export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
    .replace(/[^a-z0-9_-]/g, "-") // Reemplazar caracteres especiales y espacios por guión
    .replace(/-+/g, "-") // Colapsar guiones consecutivos
    .replace(/^-|-$/g, ""); // Quitar guiones al inicio/final
}

// Helper para extraer la ruta de almacenamiento de una URL de Supabase
export function getPathFromUrl(url: string): string | null {
  try {
    const marker = "PortafolioBucket/";
    const index = url.indexOf(marker);
    if (index === -1) return null;
    const rawPath = url.substring(index + marker.length);
    const pathWithoutQuery = rawPath.split("?")[0];
    return decodeURIComponent(pathWithoutQuery);
  } catch {
    return null;
  }
}

/**
 * Servicio unificado para gestionar las operaciones CRUD y de almacenamiento (storage) de los proyectos.
 * Ubicado en el directorio raíz /services para un acceso global óptimo.
 */
export const ProjectService = {
  // ── OPERACIONES DE BASE DE DATOS (CRUD) ──

  async getAll(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("Projects")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(supabase: SupabaseClient, id: number | string) {
    const { data, error } = await supabase
      .from("Projects")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(supabase: SupabaseClient, project: ProjectInput) {
    const { data, error } = await supabase
      .from("Projects")
      .insert([project])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(supabase: SupabaseClient, id: number | string, project: Partial<ProjectInput>) {
    const { data, error } = await supabase
      .from("Projects")
      .update(project)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(supabase: SupabaseClient, id: number | string) {
    const { error } = await supabase
      .from("Projects")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    return { success: true };
  },

  // ── OPERACIONES DE ALMACENAMIENTO (STORAGE) ──

  async uploadCover(supabase: SupabaseClient, projectId: number | string, name: string, file: File) {
    const ext = file.name.split(".").pop();
    const sanitizedName = sanitizeFilename(name);
    const coverPath = `${projectId}-${sanitizedName}-cover.${ext}`;

    const { error } = await supabase.storage
      .from("PortafolioBucket")
      .upload(coverPath, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage.from("PortafolioBucket").getPublicUrl(coverPath);
    return data.publicUrl;
  },

  async uploadGalleryImages(
    supabase: SupabaseClient,
    projectId: number | string,
    name: string,
    files: File[],
    existingGalleryLength: number
  ) {
    const sanitizedName = sanitizeFilename(name);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop();
      const indexSuffix = existingGalleryLength + i;
      const galleryPath = `${projectId}-${sanitizedName}-gallery-${indexSuffix}.${ext}`;

      const { error } = await supabase.storage
        .from("PortafolioBucket")
        .upload(galleryPath, file, { upsert: true });

      if (error) throw error;

      const { data } = supabase.storage.from("PortafolioBucket").getPublicUrl(galleryPath);
      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  },

  async removeStorageFiles(supabase: SupabaseClient, paths: string[]) {
    if (paths.length === 0) return { success: true };
    const { error } = await supabase.storage
      .from("PortafolioBucket")
      .remove(paths);
    
    if (error) throw error;
    return { success: true };
  },

  async renameImages(
    supabase: SupabaseClient,
    projectId: number | string,
    oldName: string,
    newName: string,
    project: { image?: string; gallery_images?: string[] }
  ) {
    const oldSanitized = sanitizeFilename(oldName);
    const newSanitized = sanitizeFilename(newName);
    if (oldSanitized === newSanitized) return project;

    let updatedImage = project.image;
    let updatedGallery = project.gallery_images ? [...project.gallery_images] : [];

    // Renombrar Portada
    if (project.image) {
      const oldCoverPath = getPathFromUrl(project.image);
      if (oldCoverPath) {
        const ext = oldCoverPath.split(".").pop();
        const newCoverPath = `${projectId}-${newSanitized}-cover.${ext}`;
        try {
          await supabase.storage.from("PortafolioBucket").move(oldCoverPath, newCoverPath);
          const { data } = supabase.storage.from("PortafolioBucket").getPublicUrl(newCoverPath);
          updatedImage = data.publicUrl;
        } catch (err) {
          console.error("No se pudo renombrar la portada en storage:", err);
        }
      }
    }

    // Renombrar Galería
    if (project.gallery_images && project.gallery_images.length > 0) {
      const renamedGallery: string[] = [];
      for (let i = 0; i < project.gallery_images.length; i++) {
        const oldUrl = project.gallery_images[i];
        const oldPath = getPathFromUrl(oldUrl);
        if (oldPath) {
          const ext = oldPath.split(".").pop();
          const newPath = `${projectId}-${newSanitized}-gallery-${i}.${ext}`;
          try {
            await supabase.storage.from("PortafolioBucket").move(oldPath, newPath);
            const { data } = supabase.storage.from("PortafolioBucket").getPublicUrl(newPath);
            renamedGallery.push(data.publicUrl);
          } catch (err) {
            console.error("No se pudo renombrar imagen de galería:", err);
            renamedGallery.push(oldUrl);
          }
        } else {
          renamedGallery.push(oldUrl);
        }
      }
      updatedGallery = renamedGallery;
    }

    return {
      image: updatedImage,
      gallery_images: updatedGallery,
    };
  }
};

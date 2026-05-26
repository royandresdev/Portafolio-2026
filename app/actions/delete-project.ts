"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function getPathFromUrl(url: string): string | null {
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
 * Server Action para eliminar un proyecto de la base de datos y limpiar su storage
 */
export async function deleteProject(projectId: number | string) {
  const supabase = await createClient();

  // 1. Validar autenticación
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("No autorizado para realizar esta acción");
  }

  // 2. Obtener el proyecto para conocer las URLs de sus imágenes
  const { data: project, error: fetchError } = await supabase
    .from("Projects")
    .select("image, gallery_images")
    .eq("id", projectId)
    .single();

  if (fetchError || !project) {
    throw new Error("El proyecto no existe o ya fue eliminado");
  }

  // 3. Recopilar rutas de storage de la portada y la galería
  const pathsToRemove: string[] = [];
  
  if (project.image) {
    const path = getPathFromUrl(project.image);
    if (path) pathsToRemove.push(path);
  }

  if (project.gallery_images && Array.isArray(project.gallery_images)) {
    project.gallery_images.forEach((url: string) => {
      const path = getPathFromUrl(url);
      if (path) pathsToRemove.push(path);
    });
  }

  // 4. Eliminar las imágenes del storage
  if (pathsToRemove.length > 0) {
    try {
      const { error: storageError } = await supabase.storage
        .from("PortafolioBucket")
        .remove(pathsToRemove);
      
      if (storageError) {
        console.error("Error al eliminar archivos de storage:", storageError);
      }
    } catch (err) {
      console.error("Excepción al eliminar archivos de storage:", err);
    }
  }

  // 5. Eliminar el registro en la base de datos
  const { error: deleteError } = await supabase
    .from("Projects")
    .delete()
    .eq("id", projectId);

  if (deleteError) {
    throw deleteError;
  }

  // 6. Revalidar rutas para refrescar los datos
  revalidatePath("/admin/projects");
  revalidatePath("/");

  return { success: true };
}

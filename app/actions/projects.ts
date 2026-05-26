"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ProjectService, getPathFromUrl, ProjectInput } from "@/services/projects";
import { SupabaseClient } from "@supabase/supabase-js";

// Validar que el usuario esté autenticado
async function validateAuth(supabase: SupabaseClient) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("No autorizado para realizar esta acción. Inicie sesión nuevamente.");
  }
  return user;
}

/**
 * Server Action: Crear un nuevo proyecto
 */
export async function createProjectAction(projectInput: ProjectInput) {
  try {
    const supabase = await createClient();
    await validateAuth(supabase);

    const data = await ProjectService.create(supabase, projectInput);
    
    revalidatePath("/admin/projects");
    revalidatePath("/");
    
    return { success: true, data };
  } catch (err) {
    console.error("Error en Server Action createProjectAction:", err);
    return { success: false, error: err instanceof Error ? err.message : "Error al crear el proyecto" };
  }
}

/**
 * Server Action: Actualizar un proyecto existente
 */
export async function updateProjectAction(id: number | string, projectInput: Partial<ProjectInput>) {
  try {
    const supabase = await createClient();
    await validateAuth(supabase);

    const data = await ProjectService.update(supabase, id, projectInput);
    
    revalidatePath("/admin/projects");
    revalidatePath("/");
    
    return { success: true, data };
  } catch (err) {
    console.error("Error en Server Action updateProjectAction:", err);
    return { success: false, error: err instanceof Error ? err.message : "Error al actualizar el proyecto" };
  }
}

/**
 * Server Action: Eliminar un proyecto y limpiar sus recursos de almacenamiento
 */
export async function deleteProjectAction(id: number | string) {
  try {
    const supabase = await createClient();
    await validateAuth(supabase);

    const project = await ProjectService.getById(supabase, id);
    if (!project) {
      throw new Error("El proyecto no existe o ya fue eliminado");
    }

    // Recopilar rutas de storage a eliminar
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

    // Limpiar almacenamiento
    if (pathsToRemove.length > 0) {
      try {
        await ProjectService.removeStorageFiles(supabase, pathsToRemove);
      } catch (err) {
        console.error("Error al eliminar archivos de storage:", err);
      }
    }

    // Eliminar registro
    const data = await ProjectService.delete(supabase, id);
    
    revalidatePath("/admin/projects");
    revalidatePath("/");
    
    return { success: true, data };
  } catch (err) {
    console.error("Error en Server Action deleteProjectAction:", err);
    return { success: false, error: err instanceof Error ? err.message : "Error al eliminar el proyecto" };
  }
}

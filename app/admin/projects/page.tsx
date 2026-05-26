import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminProjectsHeader } from "./components/admin-projects-header";
import { AdminProjectsEmptyState } from "./components/admin-projects-empty-state";
import { AdminProjectRow } from "./components/admin-project-row";

/**
 * Página principal del panel de administración de proyectos.
 * Responsabilidad: Control de autenticación, obtención de datos del servidor y orquestación de la vista. (SRP)
 */
export default async function AdminProjectsPage() {
  const supabase = await createClient();

  // Validar autenticación de administrador
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/auth/login");
  }

  // Obtener todos los proyectos ordenados por fecha de creación descendente
  const { data: projects, error: dbError } = await supabase
    .from("Projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (dbError) {
    console.error("Error fetching projects:", dbError);
  }

  return (
    <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-12 md:py-16 md:px-12 flex flex-col gap-12">
      {/* Encabezado Principal */}
      <AdminProjectsHeader />

      {/* Listado de Proyectos */}
      <div className="flex flex-col w-full pt-4">
        {/* Cabecera de Tabla (Solo visible en Desktop) */}
        <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-gray-2/10 text-[#bdbdbd] text-[10px] font-semibold tracking-[1px] uppercase">
          <div className="col-span-8">Nombre del Proyecto</div>
          <div className="col-span-4 text-right">Acciones</div>
        </div>

        {/* Filas de Proyectos */}
        <div className="flex flex-col gap-4 mt-4">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <AdminProjectRow key={project.id} project={project} />
            ))
          ) : (
            <AdminProjectsEmptyState />
          )}
        </div>
      </div>
    </main>
  );
}

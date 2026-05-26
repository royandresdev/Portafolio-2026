import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

// Función para formatear fechas relativas tal como en el diseño de Figma (en inglés)
function getRelativeTimeString(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 7) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `Last updated: ${month} ${day}, ${year}`;
  } else if (diffInDays >= 2) {
    return `Last updated: ${diffInDays} days ago`;
  } else if (diffInDays === 1) {
    return "Last updated: Yesterday";
  } else if (diffInHours >= 1) {
    return `Last updated: ${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInMins >= 1) {
    return `Last updated: ${diffInMins} minute${diffInMins > 1 ? "s" : ""} ago`;
  } else {
    return "Last updated: just now";
  }
}

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  // Validar autenticación
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/auth/login");
  }

  // Obtener proyectos
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
        <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[#00ff99] text-xs font-semibold tracking-[2.4px] uppercase font-mono">
              Dashboard
            </span>
            <h1 className="text-[#eaeaea] text-3xl md:text-[48px] font-extrabold tracking-[-1.2px] leading-tight md:leading-[48px]">
              Panel de administración de<br className="hidden md:inline" /> proyectos
            </h1>
          </div>
          <button className="bg-[#00ff99] hover:bg-[#00ff99]/90 text-[#242424] font-bold px-6 py-4 rounded-lg flex items-center justify-center gap-3 transition-colors duration-200 w-full md:w-auto shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] select-none">
            <Plus className="size-5 stroke-[3px]" />
            <span className="text-base">Agregar proyecto</span>
          </button>
        </div>

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
                <div
                  key={project.id}
                  className="bg-[#242424] p-6 rounded-lg w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 md:grid md:grid-cols-12 md:gap-0 md:px-6 md:py-8 border border-transparent hover:border-[#00ff99]/10 transition-all duration-300 shadow-md"
                >
                  {/* Info del Proyecto */}
                  <div className="flex items-center gap-4 sm:col-span-8 md:col-span-8">
                    {/* Miniatura de Imagen de Portada */}
                    <div className="bg-black flex items-center justify-center overflow-clip rounded-[2px] size-12 shrink-0 border border-gray-2/20">
                      {project.image ? (
                        <img
                          alt={project.name}
                          className="object-cover size-full opacity-60 hover:opacity-80 transition-opacity duration-300"
                          src={project.image}
                        />
                      ) : (
                        <div className="size-full bg-black-2 flex items-center justify-center text-[10px] text-gray-4">
                          No Img
                        </div>
                      )}
                    </div>

                    {/* Título y Estado */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {/* Indicador de Estado Verde Luminoso */}
                        <span className="inline-block bg-[#00ff99] rounded-full shadow-[0_0_10px_0_#00ffa3] size-2 shrink-0 animate-pulse" />
                        <h3 className="font-bold text-[#eaeaea] text-lg leading-snug">
                          {project.name}
                        </h3>
                      </div>
                      <p className="text-[#bdbdbd] text-xs font-normal leading-normal">
                        {getRelativeTimeString(project.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center justify-end gap-3 sm:col-span-4 md:col-span-4">
                    {/* Botón Editar */}
                    <button className="border border-[rgba(0,255,163,0.2)] hover:border-[#00ff99] hover:bg-[#00ff99]/10 text-[#00ff99] font-semibold text-sm px-[17px] py-[8px] rounded-[2px] transition-all duration-200 cursor-pointer select-none">
                      Editar
                    </button>

                    {/* Botón Eliminar */}
                    <button className="hover:bg-[#eb5757]/10 p-2 rounded-[2px] transition-all duration-200 group cursor-pointer select-none">
                      <Trash2 className="text-[#eb5757] size-[18px] group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full py-16 flex flex-col items-center justify-center border border-dashed border-gray-2/20 rounded-lg bg-black-3/20">
                <p className="text-gray-4 text-sm">No se encontraron proyectos en la base de datos.</p>
              </div>
            )}
          </div>
        </div>

      </main>
  );
}

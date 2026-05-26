import { getRelativeTimeString } from "@/lib/date";
import Link from "next/link";
import { DeleteProjectButton } from "./delete-project-button";
import Image from "next/image";

interface Project {
  id: number | string;
  name: string;
  image?: string;
  created_at: string | Date;
}

interface AdminProjectRowProps {
  project: Project;
}

/**
 * Componente que renderiza una fila de proyecto dentro de la lista de administración.
 * Se encarga de mostrar la miniatura, nombre del proyecto, fecha relativa y acciones de edición/eliminación.
 */
export function AdminProjectRow({ project }: AdminProjectRowProps) {
  return (
    <div
      className="bg-[#242424] p-6 rounded-lg w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 md:grid md:grid-cols-12 md:gap-0 md:px-6 md:py-8 border border-transparent hover:border-[#00ff99]/10 transition-all duration-300 shadow-md"
    >
      {/* Info del Proyecto */}
      <div className="flex items-center gap-4 sm:col-span-8 md:col-span-8">
        {/* Miniatura de Imagen de Portada */}
        <div className="bg-black flex items-center justify-center overflow-clip rounded-[2px] size-12 shrink-0 border border-gray-2/20">
          {project.image ? (
            <Image
              alt={project.name}
              className="object-cover size-full opacity-60 hover:opacity-80 transition-opacity duration-300"
              src={project.image}
              width={48}
              height={48}
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
        <Link
          href={`/admin/projects/${project.id}/edit`}
          className="border border-[rgba(0,255,163,0.2)] hover:border-[#00ff99] hover:bg-[#00ff99]/10 text-[#00ff99] font-semibold text-sm px-[17px] py-[8px] rounded-[2px] transition-all duration-200 cursor-pointer select-none text-center"
        >
          Editar
        </Link>

        {/* Botón Eliminar */}
        <DeleteProjectButton projectId={project.id} projectName={project.name} />
      </div>
    </div>
  );
}

import { Plus } from "lucide-react";
import Link from "next/link";

/**
 * Componente que representa el encabezado del dashboard de proyectos del administrador.
 */
export function AdminProjectsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-[#00ff99] text-xs font-semibold tracking-[2.4px] uppercase font-mono">
          Dashboard
        </span>
        <h1 className="text-[#eaeaea] text-3xl md:text-[48px] font-extrabold tracking-[-1.2px] leading-tight md:leading-[48px]">
          Panel de administración de<br className="hidden md:inline" /> proyectos
        </h1>
      </div>
      <Link
        href="/admin/projects/new"
        className="bg-[#00ff99] hover:bg-[#00ff99]/90 text-[#242424] font-bold px-6 py-4 rounded-lg flex items-center justify-center gap-3 transition-colors duration-200 w-full md:w-auto shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] select-none text-center"
      >
        <Plus className="size-5 stroke-[3px]" />
        <span className="text-base">Agregar proyecto</span>
      </Link>
    </div>
  );
}

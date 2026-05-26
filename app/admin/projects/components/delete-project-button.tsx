"use client";

import { useState, useTransition } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { deleteProjectAction as deleteProject } from "@/app/actions/projects";

interface DeleteProjectButtonProps {
  projectId: number | string;
  projectName: string;
}

/**
 * Botón interactivo de eliminación de proyecto con modal de confirmación premium
 * y soporte para transiciones asíncronas de React 19.
 */
export function DeleteProjectButton({ projectId, projectName }: DeleteProjectButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = () => {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await deleteProject(projectId);
        setIsOpen(false);
      } catch (err) {
        console.error("Error deleting project:", err);
        setErrorMsg(err instanceof Error ? err.message : "Ocurrió un error inesperado al eliminar el proyecto.");
      }
    });
  };

  return (
    <>
      {/* Botón Principal de Borrado (Accionador) */}
      <button
        onClick={() => setIsOpen(true)}
        className="hover:bg-[#eb5757]/10 p-2 rounded-[2px] transition-all duration-200 group cursor-pointer select-none"
        title={`Eliminar ${projectName}`}
        aria-label={`Eliminar ${projectName}`}
      >
        <Trash2 className="text-[#eb5757] size-[18px] group-hover:scale-110 transition-transform" />
      </button>

      {/* Modal de Confirmación */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Fondo Oscuro / Backdrop con blur */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => !isPending && setIsOpen(false)}
          />

          {/* Caja del Modal */}
          <div className="bg-[#1e1e1e] border border-gray-2/20 rounded-lg p-6 max-w-md w-full relative z-10 shadow-2xl flex flex-col gap-6 transform transition-all duration-300 scale-100">
            {/* Header del Modal */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#eb5757]/10 rounded-full text-[#eb5757] shrink-0">
                <AlertTriangle className="size-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-gray-5">¿Eliminar proyecto?</h3>
                <p className="text-sm text-gray-4 leading-relaxed">
                  Estás a punto de eliminar el proyecto <strong className="text-white">&quot;{projectName}&quot;</strong>. Esta acción borrará el registro de forma permanente de la base de datos y eliminará todas sus imágenes de portada y galería en Supabase Storage.
                </p>
              </div>
            </div>

            {/* Mensaje de Error en caso de falla */}
            {errorMsg && (
              <div className="p-3 bg-[#eb5757]/10 border border-[#eb5757]/20 rounded-[2px] text-xs text-[#eb5757] font-mono text-center">
                {errorMsg}
              </div>
            )}

            {/* Botones de Acción */}
            <div className="flex items-center justify-end gap-4 mt-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-2/20 hover:border-gray-2/40 text-gray-4 hover:text-white rounded-[2px] text-sm font-semibold transition-all duration-200 select-none cursor-pointer disabled:opacity-50"
              >
                CANCELAR
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="px-4 py-2 bg-[#eb5757] hover:bg-[#eb5757]/90 text-white rounded-[2px] text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 select-none cursor-pointer disabled:opacity-50 min-w-[120px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>ELIMINANDO</span>
                  </>
                ) : (
                  <span>ELIMINAR</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

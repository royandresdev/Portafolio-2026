import { Save } from "lucide-react";
import Link from "next/link";

interface FormActionsProps {
  isSubmitting: boolean;
  errorMsg: string | null;
}

/**
 * Componente que renderiza los botones de acción del formulario (CANCELAR, GUARDAR CAMBIOS)
 * junto con la caja de errores generales de envío. (SRP)
 */
export function FormActions({ isSubmitting, errorMsg }: FormActionsProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Mensaje de error general si ocurre al enviar */}
      {errorMsg && (
        <div className="w-full p-4 bg-danger/10 border border-danger/20 rounded-[2px] text-xs text-danger text-center font-mono">
          {errorMsg}
        </div>
      )}

      {/* Botones de Acción */}
      <div className="flex items-center justify-end gap-6 pt-6">
        <Link
          href="/admin/projects"
          className="text-[#eb5757] hover:text-[#eb5757]/80 text-sm font-semibold tracking-[1.4px] uppercase select-none transition-colors"
        >
          CANCELAR
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#00ff99] hover:bg-[#00ff99]/90 text-[#151515] font-extrabold px-10 py-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(0,255,153,0.3)] transition-all select-none cursor-pointer disabled:opacity-50"
        >
          <Save className="size-[18px]" />
          <span className="text-sm tracking-[1.4px] uppercase">
            {isSubmitting ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
          </span>
        </button>
      </div>
    </div>
  );
}

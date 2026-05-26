/**
 * Componente para mostrar cuando no hay proyectos en la base de datos.
 */
export function AdminProjectsEmptyState() {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center border border-dashed border-gray-2/20 rounded-lg bg-black-3/20">
      <p className="text-gray-4 text-sm">No se encontraron proyectos en la base de datos.</p>
    </div>
  );
}

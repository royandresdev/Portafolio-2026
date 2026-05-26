import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteProjectButton } from "@/app/admin/projects/components/delete-project-button";
import * as actions from "@/app/actions/delete-project";

vi.mock("@/app/actions/delete-project", () => ({
  deleteProject: vi.fn(),
}));

describe("Componente: DeleteProjectButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const props = {
    projectId: 123,
    projectName: "Proyecto A Borrar",
  };

  it("debe mostrar solo el botón con icono de papelera inicialmente", () => {
    render(<DeleteProjectButton {...props} />);

    // Verificamos que el botón inicial existe por su rol/label
    const triggerBtn = screen.getByRole("button", { name: /eliminar Proyecto A Borrar/i });
    expect(triggerBtn).toBeInTheDocument();
    
    // El modal de confirmación no debe estar en el DOM
    expect(screen.queryByText(/¿Eliminar proyecto?/i)).not.toBeInTheDocument();
  });

  it("debe abrir el modal de confirmación al hacer clic en el botón de borrar", () => {
    render(<DeleteProjectButton {...props} />);

    const triggerBtn = screen.getByRole("button", { name: /eliminar Proyecto A Borrar/i });
    fireEvent.click(triggerBtn);

    // Ahora el modal debe estar visible
    expect(screen.getByText(/¿Eliminar proyecto?/i)).toBeInTheDocument();
    expect(screen.getByText(/Proyecto A Borrar/i)).toBeInTheDocument();
  });

  it("debe cerrar el modal si se presiona CANCELAR", () => {
    render(<DeleteProjectButton {...props} />);

    // Abrimos el modal
    fireEvent.click(screen.getByRole("button", { name: /eliminar Proyecto A Borrar/i }));
    expect(screen.getByText(/¿Eliminar proyecto?/i)).toBeInTheDocument();

    // Hacemos clic en Cancelar
    const cancelBtn = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelBtn);

    // El modal ya no debe estar en el DOM
    expect(screen.queryByText(/¿Eliminar proyecto?/i)).not.toBeInTheDocument();
  });

  it("debe llamar a deleteProject y cerrar el modal si se confirma la eliminación", async () => {
    // Simulamos respuesta exitosa de la Server Action
    vi.mocked(actions.deleteProject).mockResolvedValue({ success: true });

    render(<DeleteProjectButton {...props} />);

    // Abrimos modal
    fireEvent.click(screen.getByRole("button", { name: /eliminar Proyecto A Borrar/i }));

    // Clic en Confirmar / Eliminar
    const confirmBtn = screen.getByRole("button", { name: /^eliminar$/i });
    fireEvent.click(confirmBtn);

    // Verificamos que se llame al Server Action con el ID adecuado
    expect(actions.deleteProject).toHaveBeenCalledWith(123);

    // El modal se cierra tras la confirmación exitosa
    await waitFor(() => {
      expect(screen.queryByText(/¿Eliminar proyecto?/i)).not.toBeInTheDocument();
    });
  });

  it("debe mostrar mensaje de error si la acción de eliminación falla", async () => {
    // Simulamos error de la Server Action
    vi.mocked(actions.deleteProject).mockRejectedValue(new Error("Error al borrar de Supabase"));

    render(<DeleteProjectButton {...props} />);

    // Abrimos modal
    fireEvent.click(screen.getByRole("button", { name: /eliminar Proyecto A Borrar/i }));

    // Clic en Confirmar / Eliminar
    const confirmBtn = screen.getByRole("button", { name: /^eliminar$/i });
    fireEvent.click(confirmBtn);

    // El modal sigue visible y muestra el error
    expect(await screen.findByText(/Error al borrar de Supabase/i)).toBeInTheDocument();
    expect(screen.getByText(/¿Eliminar proyecto?/i)).toBeInTheDocument();
  });
});

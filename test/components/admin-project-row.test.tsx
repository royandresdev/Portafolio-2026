import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AdminProjectRow } from "@/app/admin/projects/components/admin-project-row";

// Mock de la fecha relativa
vi.mock("@/lib/date", () => ({
  getRelativeTimeString: (date: string | Date) => `Last updated: Just now (${date})`,
}));

// Mock del botón de borrado para aislar las pruebas de la fila
vi.mock("@/app/admin/projects/components/delete-project-button", () => ({
  DeleteProjectButton: ({ projectId, projectName }: { projectId: any; projectName: string }) => (
    <button data-testid={`delete-btn-${projectId}`}>Delete {projectName}</button>
  ),
}));

describe("Componente: AdminProjectRow", () => {
  const mockProject = {
    id: 123,
    name: "Proyecto de Test",
    image: "https://example.com/image.png",
    created_at: "2026-05-25T12:00:00Z",
  };

  it("debe renderizar el nombre del proyecto y la fecha relativa formateada", () => {
    render(<AdminProjectRow project={mockProject} />);

    expect(screen.getByText("Proyecto de Test")).toBeInTheDocument();
    expect(screen.getByText("Last updated: Just now (2026-05-25T12:00:00Z)")).toBeInTheDocument();
  });

  it("debe mostrar la miniatura de la imagen si está presente", () => {
    render(<AdminProjectRow project={mockProject} />);

    const img = screen.getByRole("img", { name: /Proyecto de Test/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/image.png");
  });

  it("debe mostrar texto alternativo cuando la imagen de portada no está definida", () => {
    const projectNoImg = { ...mockProject, image: undefined };
    render(<AdminProjectRow project={projectNoImg} />);

    expect(screen.getByText("No Img")).toBeInTheDocument();
  });

  it("debe renderizar el enlace a la página de edición con la ruta correcta", () => {
    render(<AdminProjectRow project={mockProject} />);

    const editLink = screen.getByRole("link", { name: /editar/i });
    expect(editLink).toBeInTheDocument();
    expect(editLink).toHaveAttribute("href", "/admin/projects/123/edit");
  });

  it("debe integrar el botón de eliminación pasando las props adecuadas", () => {
    render(<AdminProjectRow project={mockProject} />);

    const deleteBtn = screen.getByTestId("delete-btn-123");
    expect(deleteBtn).toBeInTheDocument();
    expect(deleteBtn).toHaveTextContent("Delete Proyecto de Test");
  });
});

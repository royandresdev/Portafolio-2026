import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProjectForm } from "@/components/project-form";
import * as submitHook from "@/hooks/use-project-submit";

// Mock del custom hook
vi.mock("@/hooks/use-project-submit", () => ({
  useProjectSubmit: vi.fn(),
}));

// Mock del router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe("Componente: ProjectForm", () => {
  const mockProject = {
    id: 1,
    name: "Proyecto Existente",
    description: "Una descripción de prueba",
    image: "https://example.com/existing-cover.png",
    gallery_images: ["https://example.com/existing-gal1.png"],
    technologies: ["React", "CSS"],
    linkDemo: "https://demo.com",
    linkRepo: "https://github.com",
    typeApp: "Plataforma Web",
  };

  const defaultMockSubmit = {
    isSubmitting: false,
    errorMsg: null,
    coverPreview: null,
    galleryPreviews: [],
    handleCoverChange: vi.fn(),
    handleGalleryChange: vi.fn(),
    removeGalleryImage: vi.fn(),
    handleSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar el título de crear proyecto si no se pasa proyecto", () => {
    vi.mocked(submitHook.useProjectSubmit).mockReturnValue(defaultMockSubmit);

    render(<ProjectForm />);

    expect(screen.getByRole("heading", { name: /crear proyecto/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ej. Arquitectura Central Obsidiana/i)).toBeInTheDocument();
  });

  it("debe renderizar el título de editar proyecto y rellenar campos si se pasa proyecto", () => {
    vi.mocked(submitHook.useProjectSubmit).mockReturnValue({
      ...defaultMockSubmit,
      coverPreview: mockProject.image,
      galleryPreviews: mockProject.gallery_images,
    });

    render(<ProjectForm project={mockProject} />);

    expect(screen.getByRole("heading", { name: /editar proyecto/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre del proyecto/i)).toHaveValue("Proyecto Existente");
    expect(screen.getByLabelText(/tecnologías/i)).toHaveValue("React, CSS");
    expect(screen.getByLabelText(/tipo de aplicación/i)).toHaveValue("Plataforma Web");
    expect(screen.getByLabelText(/descripción/i)).toHaveValue("Una descripción de prueba");
  });

  it("debe mostrar errores de validación de campos obligatorios en el submit", async () => {
    vi.mocked(submitHook.useProjectSubmit).mockReturnValue(defaultMockSubmit);

    render(<ProjectForm />);

    const submitBtn = screen.getByRole("button", { name: /guardar cambios/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/el nombre del proyecto es requerido/i)).toBeInTheDocument();
    expect(await screen.findByText(/ingrese tecnologías separadas por comas/i)).toBeInTheDocument();
    expect(await screen.findByText(/la descripción es requerida/i)).toBeInTheDocument();
    expect(await screen.findByText(/el tipo de aplicación es requerido/i)).toBeInTheDocument();
  });

  it("debe invocar a handleSubmit si todos los campos son válidos", async () => {
    const mockHandleSubmit = vi.fn();
    vi.mocked(submitHook.useProjectSubmit).mockReturnValue({
      ...defaultMockSubmit,
      handleSubmit: mockHandleSubmit,
    });

    render(<ProjectForm />);

    // Rellenamos el formulario con datos válidos
    fireEvent.change(screen.getByLabelText(/nombre del proyecto/i), {
      target: { value: "Nuevo Proyecto" },
    });
    fireEvent.change(screen.getByLabelText(/tecnologías/i), {
      target: { value: "NextJS, Supabase" },
    });
    fireEvent.change(screen.getByLabelText(/tipo de aplicación/i), {
      target: { value: "Plataforma Web" },
    });
    fireEvent.change(screen.getByLabelText(/descripción/i), {
      target: { value: "Esta es la descripción del nuevo proyecto de prueba." },
    });
    fireEvent.change(screen.getByLabelText(/url de demostración/i), {
      target: { value: "https://mi-demo.com" },
    });
    fireEvent.change(screen.getByLabelText(/url del repositorio/i), {
      target: { value: "https://github.com/usuario/repo" },
    });

    const submitBtn = screen.getByRole("button", { name: /guardar cambios/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });

  it("debe mostrar el mensaje de error general si errorMsg está definido", () => {
    vi.mocked(submitHook.useProjectSubmit).mockReturnValue({
      ...defaultMockSubmit,
      errorMsg: "Error crítico al guardar en la base de datos de Supabase",
    });

    render(<ProjectForm />);

    expect(screen.getByText("Error crítico al guardar en la base de datos de Supabase")).toBeInTheDocument();
  });
});

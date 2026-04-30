import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Contact } from "@/components/contact";
import * as actions from "@/app/actions/send-email";

// Mock de la Server Action
vi.mock("@/app/actions/send-email", () => ({
  sendEmail: vi.fn(),
}));

// Mock de Iconify (ya que es un componente externo que carga recursos)
vi.mock("@iconify/react", () => ({
  Icon: () => <span data-testid="icon" />,
}));

describe("Componente: Contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe mostrar errores de validación si los campos están vacíos al intentar enviar", async () => {
    render(<Contact />);
    
    const submitButton = screen.getByRole("button", { name: /Enviar Mensaje/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/El nombre es requerido/i)).toBeInTheDocument();
    expect(await screen.findByText(/El correo es requerido/i)).toBeInTheDocument();
    expect(await screen.findByText(/El mensaje es requerido/i)).toBeInTheDocument();
  });

  it("debe mostrar error si el formato del correo es inválido", async () => {
    render(<Contact />);
    
    const emailInput = screen.getByLabelText(/Correo/i);
    fireEvent.change(emailInput, { target: { value: "correo-invalido" } });
    fireEvent.blur(emailInput);

    expect(await screen.findByText(/Correo inválido/i)).toBeInTheDocument();
  });

  it("debe mostrar estado de carga y éxito al enviar correctamente", async () => {
    // Simulamos respuesta exitosa
    vi.mocked(actions.sendEmail).mockResolvedValue({ success: true });

    render(<Contact />);
    
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: "Roy" } });
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: "roy@test.com" } });
    fireEvent.change(screen.getByLabelText(/Mensaje/i), { target: { value: "Hola, este es un mensaje válido." } });

    const submitButton = screen.getByRole("button", { name: /Enviar Mensaje/i });
    fireEvent.click(submitButton);

    // Verificamos que el botón cambie de estado (opcional dependiendo de la velocidad del mock)
    expect(submitButton).toBeDisabled();

    // Verificamos mensaje de éxito
    expect(await screen.findByText(/¡Mensaje enviado con éxito!/i)).toBeInTheDocument();
  });

  it("debe mostrar mensaje de error si la Server Action falla", async () => {
    // Simulamos error del servidor
    vi.mocked(actions.sendEmail).mockResolvedValue({ success: false, error: "Error de servidor" });

    render(<Contact />);
    
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: "Roy" } });
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: "roy@test.com" } });
    fireEvent.change(screen.getByLabelText(/Mensaje/i), { target: { value: "Hola, este es un mensaje válido." } });

    fireEvent.click(screen.getByRole("button", { name: /Enviar Mensaje/i }));

    expect(await screen.findByText(/Error de servidor/i)).toBeInTheDocument();
  });
});

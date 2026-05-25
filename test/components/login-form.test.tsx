import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginForm } from "@/components/login-form";

// Mock del router de Next.js
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock del cliente de Supabase
const mockSignInWithPassword = vi.fn();
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
    },
  }),
}));

// Mock de Iconify
vi.mock("@iconify/react", () => ({
  Icon: () => <span data-testid="icon" />,
}));

describe("Componente: LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar los inputs de correo, contraseña y botón de ingreso", () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/clave de encriptación/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /acceder al sistema/i })).toBeInTheDocument();
  });

  it("debe mostrar mensajes de validación si los campos están vacíos al intentar acceder", async () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole("button", { name: /acceder al sistema/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/el correo es requerido/i)).toBeInTheDocument();
    expect(await screen.findByText(/la clave es requerida/i)).toBeInTheDocument();
  });

  it("debe mostrar error de formato si el correo electrónico es inválido", async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    fireEvent.change(emailInput, { target: { value: "correo-invalido" } });
    fireEvent.blur(emailInput);

    expect(await screen.findByText(/el formato del correo es inválido/i)).toBeInTheDocument();
  });

  it("debe llamar a la API de Supabase y redirigir al Home Page al ingresar con credenciales válidas", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/clave de encriptación/i), {
      target: { value: "password123" },
    });

    const submitButton = screen.getByRole("button", { name: /acceder al sistema/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "admin@test.com",
        password: "password123",
      });
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("debe mostrar un mensaje de error si la autenticación de Supabase falla", async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: { message: "Credenciales incorrectas" },
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/clave de encriptación/i), {
      target: { value: "password123" },
    });

    const submitButton = screen.getByRole("button", { name: /acceder al sistema/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/credenciales incorrectas/i)).toBeInTheDocument();
  });
});

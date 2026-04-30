import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendEmail } from "@/app/actions/send-email";

// Mocks
vi.mock("resend", () => ({
  Resend: vi.fn(function () {
    return {
      emails: {
        send: vi.fn().mockResolvedValue({ data: { id: "test-id" }, error: null }),
      },
    };
  }),
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: vi.fn(function () {
    return {
      limit: vi.fn().mockResolvedValue({ success: true }),
    };
  }),
}));

vi.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: vi.fn(),
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue("127.0.0.1"),
  }),
}));

describe("Server Action: sendEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe enviar el correo exitosamente con datos válidos", async () => {
    const validData = {
      nombre: "Roy Andres",
      correo: "test@example.com",
      mensaje: "Hola, este es un mensaje de prueba de más de 10 caracteres.",
    };

    const result = await sendEmail(validData);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it("debe fallar si los datos no cumplen con el esquema de Yup", async () => {
    const invalidData = {
      nombre: "R", // Demasiado corto
      correo: "email-invalido",
      mensaje: "Corto",
    };

    const result = await sendEmail(invalidData);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("debe activar el Honeypot si el campo oculto está lleno", async () => {
    const spamData = {
      nombre: "Bot",
      correo: "bot@spam.com",
      mensaje: "Este es un mensaje de spam persistente.",
      _hp_phone: "555-1234", // Campo que los bots suelen llenar
    };

    const result = await sendEmail(spamData);

    // El sistema debe retornar success: true para engañar al bot, pero no enviar el correo
    expect(result.success).toBe(true);
  });
});

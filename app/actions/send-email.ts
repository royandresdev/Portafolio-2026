"use server";

import { Resend } from "resend";
import { ContactEmailTemplate } from "@/components/emails/contact-email";
import * as React from "react";
import { ContactSchema } from "@/lib/validations/contact-schema";
import { ValidationError } from "yup";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

const resend = new Resend(process.env.NEXT_RESEND_API_KEY);

// Configuración de Rate Limiting (Upstash Redis)
// Limitamos a 3 mensajes por cada 1 hora por dirección IP
const ratelimit = process.env.UPSTASH_REDIS_REST_URL
  ? new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    analytics: true,
    prefix: "@upstash/ratelimit",
  })
  : null;

// El esquema de validación se ha movido a @/lib/validations/contact-schema.ts

export async function sendEmail(formData: {
  nombre: string;
  correo: string;
  mensaje: string;
  _hp_phone?: string; // Campo Honeypot
}) {
  try {
    // 1. Rate Limiting: Protege contra spam masivo por IP
    if (ratelimit) {
      const headersList = await headers();
      const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";
      const { success } = await ratelimit.limit(ip);

      if (!success) {
        return {
          success: false,
          error: "Has superado el límite de mensajes permitidos. Intenta de nuevo en una hora.",
        };
      }
    }

    // 2. Verificación Honeypot: si el bot llenó este campo, ignoramos el envío
    if (formData._hp_phone) {
      console.warn("Honeypot detectado: Intento de spam bloqueado.");
      return { success: true }; // Engañamos al bot haciéndole creer que tuvo éxito
    }

    // 3. Validación de servidor: previene bypass de validación de cliente
    await ContactSchema.validate(formData, { abortEarly: false });

    const { nombre, correo, mensaje } = formData;

    // 2. Intento de envío a través de Resend
    const { data, error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>", // Cambiar a tu dominio verificado después
      to: ["contact@royandresdev.com"], // Reemplaza con tu correo personal si es distinto
      subject: `Nuevo mensaje de ${nombre} - Portafolio`,
      react: ContactEmailTemplate({
        nombre,
        correo,
        mensaje,
      }) as React.ReactElement,
    });

    if (error) {
      console.error("Error de Resend:", error);
      return { success: false, error: "No se pudo enviar el correo. Intente más tarde." };
    }

    return { success: true, data };
  } catch (error) {
    // 3. Manejo de errores de validación o inesperados
    if (error instanceof ValidationError) {
      return { success: false, error: error.errors[0] }; // Retorna el primer mensaje de error de Yup
    }

    console.error("Error al enviar el correo:", error);
    return {
      success: false,
      error: "Ocurrió un error inesperado al enviar el mensaje.",
    };
  }
}

"use server";

import { Resend } from "resend";
import { ContactEmailTemplate } from "@/components/emails/contact-email";
import * as React from "react";

const resend = new Resend(process.env.NEXT_RESEND_API_KEY);

export async function sendEmail(formData: {
  nombre: string;
  correo: string;
  mensaje: string;
}) {
  try {
    const { nombre, correo, mensaje } = formData;

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
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return {
      success: false,
      error: "Ocurrió un error inesperado al enviar el mensaje.",
    };
  }
}

"use server";

import { Resend } from "resend";
import { ContactEmailTemplate } from "@/components/emails/contact-email";
import * as React from "react";
import * as Yup from "yup";

const resend = new Resend(process.env.NEXT_RESEND_API_KEY);

// Definimos el esquema de validación en el servidor para asegurar la integridad de los datos
const ContactSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(2, "Demasiado corto")
    .max(100, "Nombre demasiado largo")
    .required("El nombre es requerido"),
  correo: Yup.string()
    .email("Correo inválido")
    .max(100, "Correo demasiado largo")
    .required("El correo es requerido"),
  mensaje: Yup.string()
    .min(10, "Mensaje demasiado corto")
    .max(2000, "El mensaje no puede exceder los 2000 caracteres")
    .required("El mensaje es requerido"),
});

export async function sendEmail(formData: {
  nombre: string;
  correo: string;
  mensaje: string;
  _hp_phone?: string; // Campo Honeypot
}) {
  try {
    // 1. Verificación Honeypot: si el bot llenó este campo, ignoramos el envío
    if (formData._hp_phone) {
      console.warn("Honeypot detectado: Intento de spam bloqueado.");
      return { success: true }; // Engañamos al bot haciéndole creer que tuvo éxito
    }

    // 2. Validación de servidor: previene bypass de validación de cliente
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
    if (error instanceof Yup.ValidationError) {
      return { success: false, error: error.errors[0] }; // Retorna el primer mensaje de error de Yup
    }

    console.error("Error al enviar el correo:", error);
    return {
      success: false,
      error: "Ocurrió un error inesperado al enviar el mensaje.",
    };
  }
}

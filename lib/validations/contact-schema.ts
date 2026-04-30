import * as Yup from "yup";

export const ContactSchema = Yup.object().shape({
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
  _hp_phone: Yup.string().optional(), // Campo Honeypot
});

export type ContactFormData = Yup.InferType<typeof ContactSchema>;

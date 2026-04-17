"use client";

import { Icon } from "@iconify/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ContactSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(2, "Demasiado corto")
    .required("El nombre es requerido"),
  correo: Yup.string()
    .email("Correo inválido")
    .required("El correo es requerido"),
  mensaje: Yup.string()
    .min(10, "Mensaje demasiado corto")
    .required("El mensaje es requerido"),
});

export function Contact() {
  return (
    <section className="container mx-auto px-6 py-24 max-w-[1280px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-18 items-start">
        {/* Columna Izquierda: Formulario */}
        <div className="bg-black-3 border border-gray-2 rounded-[32px] px-8 py-16 backdrop-blur-[2px] custom-shadow w-full">
          <Formik
            initialValues={{ nombre: "", correo: "", mensaje: "" }}
            validationSchema={ContactSchema}
            onSubmit={(values, { resetForm }) => {
              console.log(values);
              alert("Mensaje enviado con éxito");
              resetForm();
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-6 w-full">
                {/* Input Nombre */}
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="nombre" className="text-gray-4 text-base font-semibold uppercase">
                    Nombre
                  </label>
                  <Field
                    name="nombre"
                    type="text"
                    className="bg-black-2 border border-gray-2 rounded-lg h-10 px-4 text-white focus:border-primary outline-none transition-colors"
                  />
                  <ErrorMessage name="nombre" component="span" className="text-danger text-sm" />
                </div>

                {/* Input Correo */}
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="correo" className="text-gray-4 text-base font-semibold uppercase">
                    Correo
                  </label>
                  <Field
                    name="correo"
                    type="email"
                    className="bg-black-2 border border-gray-2 rounded-lg h-10 px-4 text-white focus:border-primary outline-none transition-colors"
                  />
                  <ErrorMessage name="correo" component="span" className="text-danger text-sm" />
                </div>

                {/* Input Mensaje */}
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="mensaje" className="text-gray-4 text-base font-semibold uppercase">
                    Mensaje
                  </label>
                  <Field
                    name="mensaje"
                    as="textarea"
                    className="bg-black-2 border border-gray-2 rounded-lg min-h-[120px] p-4 text-white focus:border-primary outline-none transition-colors resize-none"
                  />
                  <ErrorMessage name="mensaje" component="span" className="text-danger text-sm" />
                </div>

                {/* Botón Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gray-1 border border-gray-2 py-4 rounded-lg custom-shadow text-gray-5 font-semibold uppercase hover:bg-gray-2 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Columna Derecha: Info de Contacto */}
        <div className="flex flex-col gap-8">
          <h2 className="text-5xl font-bold text-primary uppercase leading-tight">
            Contacto
          </h2>
          <p className="text-gray-5 text-base font-medium leading-relaxed">
            Gracias por visitar mi portafolio web. Espero que te haya gustado lo que has visto. Aquí puedes encontrar mis datos de contacto.
          </p>

          <div className="flex flex-col gap-8 mt-4">
            {/* Item Dirección */}
            <div className="flex items-center gap-4">
              <Icon icon="mdi:location" className="text-primary text-[32px]" />
              <div className="flex flex-col">
                <p className="text-gray-5 font-bold text-base">Dirección</p>
                <p className="text-primary font-medium text-base">Lima, Perú</p>
              </div>
            </div>

            {/* Item Celular */}
            <div className="flex items-center gap-4">
              <Icon icon="ic:round-phone" className="text-primary text-[32px]" />
              <div className="flex flex-col">
                <p className="text-gray-5 font-bold text-base">Celular</p>
                <p className="text-primary font-medium text-base">993 927 044</p>
              </div>
            </div>

            {/* Item Correo */}
            <div className="flex items-center gap-4">
              <Icon icon="material-symbols:mail" className="text-primary text-[32px]" />
              <div className="flex flex-col">
                <p className="text-gray-5 font-bold text-base">Correo</p>
                <a href="mailto:contact@royandres.dev" className="text-primary font-medium text-base hover:underline italic">
                  contact@royandres.dev
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

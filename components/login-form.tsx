"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IconInput } from "@/components/ui/icon-input";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // Definición del esquema de validación con Yup
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("El formato del correo es inválido")
      .required("El correo es requerido"),
    password: Yup.string()
      .required("La clave es requerida"),
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const supabase = createClient();
      setError(null);
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) throw new Error(error.message);

        // Redirigir al panel de administración de proyectos
        router.push("/admin/projects");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Credenciales inválidas");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className={cn("w-full flex flex-col gap-12", className)} {...props}>
      <div className="backdrop-blur-md bg-black-3/60 border border-gray-2/20 rounded-[4px] py-10 px-8 md:px-10 shadow-2xl w-full flex flex-col gap-10">

        {/* Header del Formulario */}
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl md:text-3xl! font-bold text-gray-5 tracking-tight uppercase">
            Acceso de Administrador
          </h2>
          <p className="text-sm font-light text-[#b9cbbd] leading-relaxed">
            Ingresa tus credenciales para gestionar el portafolio.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">

          {/* Campo de Correo Electrónico */}
          <IconInput
            id="email"
            name="email"
            type="email"
            label="CORREO ELECTRÓNICO"
            iconName="bi:at"
            placeholder="arquitecto@obsidiana.sis"
            error={formik.errors.email}
            touched={formik.touched.email}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          />

          {/* Campo de Contraseña */}
          <IconInput
            id="password"
            name="password"
            type="password"
            label="CLAVE DE ENCRIPTACIÓN"
            iconName="bi:lock-fill"
            placeholder="••••••••••••"
            error={formik.errors.password}
            touched={formik.touched.password}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          />

          {/* Mensajes de Error de la API de Supabase */}
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-[2px] p-3 text-xs text-danger text-center">
              {error}
            </div>
          )}

          {/* Acciones */}
          <div className="flex flex-col gap-6 pt-4">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-primary hover:bg-primary/95 text-black-1 font-bold py-4 rounded-[2px] transition-all duration-300 text-xs tracking-[1.5px] uppercase hover:shadow-[0_0_15px_rgba(0,255,153,0.3)] disabled:opacity-50 cursor-pointer text-center"
            >
              {formik.isSubmitting ? "ACCEDIENDO AL SISTEMA..." : "ACCEDER AL SISTEMA"}
            </button>
          </div>

        </form>
      </div>

      {/* Minimalist Meta Footer */}
      <div className="text-center text-[10px] font-normal tracking-[4px] text-gray-4/40 uppercase w-full select-none">
        royandresdev © {year || 2026} • VERSIÓN 1.0.0
      </div>
    </div>
  );
}

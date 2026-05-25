"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

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
        if (error) throw error;

        // Redirigir temporalmente al Home Page
        router.push("/");
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
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[#b9cbbd] text-[11px] font-bold tracking-[1.1px] uppercase px-1">
              CORREO ELECTRÓNICO
            </label>
            <div className="relative w-full">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="arquitecto@obsidiana.sis"
                className={cn(
                  "w-full bg-black-2 border rounded-[2px] py-4 pl-12 pr-4 text-sm text-gray-5 placeholder-gray-4/20 focus:outline-none transition-all duration-300",
                  formik.touched.email && formik.errors.email
                    ? "border-danger/50 focus:border-danger focus:shadow-[0_0_10px_rgba(235,87,87,0.15)]"
                    : "border-gray-2/30 focus:border-primary/50 focus:shadow-[0_0_10px_rgba(0,255,153,0.15)]"
                )}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
              />
              <Icon
                icon="bi:at"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-4/40 w-5 h-5 pointer-events-none"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <span className="text-xs text-danger px-1 mt-0.5">{formik.errors.email}</span>
            )}
          </div>

          {/* Campo de Contraseña */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[#b9cbbd] text-[11px] font-bold tracking-[1.1px] uppercase px-1">
              CLAVE DE ENCRIPTACIÓN
            </label>
            <div className="relative w-full">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••••••"
                className={cn(
                  "w-full bg-black-2 border rounded-[2px] py-4 pl-12 pr-4 text-sm text-gray-5 placeholder-gray-4/20 focus:outline-none transition-all duration-300",
                  formik.touched.password && formik.errors.password
                    ? "border-danger/50 focus:border-danger focus:shadow-[0_0_10px_rgba(235,87,87,0.15)]"
                    : "border-gray-2/30 focus:border-primary/50 focus:shadow-[0_0_10px_rgba(0,255,153,0.15)]"
                )}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
              />
              <Icon
                icon="bi:lock-fill"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-4/40 w-4 h-4 pointer-events-none"
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <span className="text-xs text-danger px-1 mt-0.5">{formik.errors.password}</span>
            )}
          </div>

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

            <Link
              href="/auth/forgot-password"
              className="text-center block text-[11px] font-bold tracking-[1.2px] text-[#b9cbbd] hover:text-primary transition-colors uppercase"
            >
              ¿OLVIDASTE TU CONTRASEÑA?
            </Link>
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

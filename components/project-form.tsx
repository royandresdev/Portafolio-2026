"use client";

import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useProjectSubmit } from "@/hooks/use-project-submit";
import { DetailsSection } from "./project-form/details-section";
import { VisualsSection } from "./project-form/visuals-section";
import { LinksSection } from "./project-form/links-section";
import { FormActions } from "./project-form/form-actions";

// Tipado del Proyecto para el componente
interface ProjectData {
  id?: number | string;
  name: string;
  description: string;
  image: string;
  gallery_images?: string[];
  technologies: string[];
  linkDemo: string;
  linkRepo: string;
  linkFigma?: string;
  typeApp: string;
}

interface ProjectFormProps {
  project?: ProjectData;
}

/**
 * Componente orquestador del formulario de creación y edición de proyectos.
 * Responsabilidad: Orquestar el diseño general y propagar el contexto de Formik. (SRP)
 */
export function ProjectForm({ project }: ProjectFormProps) {
  // Lógica y estados encapsulados en custom hook
  const {
    isSubmitting,
    errorMsg,
    coverPreview,
    galleryPreviews,
    handleCoverChange,
    handleGalleryChange,
    removeGalleryImage,
    handleSubmit,
  } = useProjectSubmit({ project });

  const isEditMode = !!project;

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre del proyecto es requerido"),
    technologies: Yup.string().required("Ingrese tecnologías separadas por comas"),
    description: Yup.string().required("La descripción es requerida"),
    typeApp: Yup.string().required("El tipo de aplicación es requerido"),
    linkDemo: Yup.string().url("Debe ser una URL válida").required("La URL de demostración es requerida"),
    linkRepo: Yup.string().url("Debe ser una URL válida").required("La URL del repositorio es requerida"),
    linkFigma: Yup.string().url("Debe ser una URL válida").nullable(),
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      name: project?.name || "",
      technologies: project?.technologies.join(", ") || "",
      description: project?.description || "",
      typeApp: project?.typeApp || "",
      linkDemo: project?.linkDemo || "",
      linkRepo: project?.linkRepo || "",
      linkFigma: project?.linkFigma || "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <FormikProvider value={formik}>
      <div className="w-full flex flex-col gap-6">
        {/* Retorno al listado */}
        <Link
          href="/admin/projects"
          className="text-[#00ff99] hover:text-[#00ff99]/85 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 flex items-center gap-2 self-start select-none"
        >
          <ArrowLeft className="size-4" />
          <span>PANEL DE ADMINISTRACIÓN</span>
        </Link>

        {/* Encabezado */}
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-2">
            <h1 className="text-[#eaeaea] text-3xl md:text-[36px] font-extrabold tracking-[-1.8px] leading-tight">
              {isEditMode ? "Editar Proyecto" : "Crear Proyecto"}
            </h1>
            <p className="text-gray-4 text-sm md:text-base font-medium">
              {isEditMode
                ? "Modificar detalles arquitectónicos centrales y configuraciones de despliegue."
                : "Registrar un nuevo proyecto dentro de la galería del portafolio empresarial."}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="bg-[#00ff99] rounded-full size-2 animate-pulse" />
            <span className="text-[#00ff99] text-[10px] tracking-[1px] uppercase font-bold">
              Sistema en línea
            </span>
          </div>
        </div>

        {/* Formulario Bento Grid */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6 w-full mt-4">
          {/* Card 1: Detalles Principales */}
          <DetailsSection isSubmitting={isSubmitting} />

          {/* Grid para Card 2 (Visuales) y Card 3 (Enlaces) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Card 2: Recursos Visuales */}
            <VisualsSection
              isSubmitting={isSubmitting}
              coverPreview={coverPreview}
              galleryPreviews={galleryPreviews}
              onCoverChange={handleCoverChange}
              onGalleryChange={handleGalleryChange}
              onRemoveGalleryImage={removeGalleryImage}
            />

            {/* Card 3: Enlaces de Despliegue */}
            <LinksSection isSubmitting={isSubmitting} />
          </div>

          {/* Botones de Acción y Errores */}
          <FormActions isSubmitting={isSubmitting} errorMsg={errorMsg} />
        </form>
      </div>
    </FormikProvider>
  );
}

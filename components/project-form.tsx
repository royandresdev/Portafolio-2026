"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Globe,
  Github,
  Palette,
  CheckCircle2,
  Trash2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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

// Helper para sanitizar nombres de archivos (Slugify)
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
    .replace(/[^a-z0-9_-]/g, "-") // Reemplazar caracteres especiales y espacios por guión
    .replace(/-+/g, "-") // Colapsar guiones consecutivos
    .replace(/^-|-$/g, ""); // Quitar guiones al inicio/final
}

// Helper para extraer la ruta de almacenamiento de una URL de Supabase
function getPathFromUrl(url: string): string | null {
  try {
    const marker = "PortafolioBucket/";
    const index = url.indexOf(marker);
    if (index === -1) return null;
    const rawPath = url.substring(index + marker.length);
    const pathWithoutQuery = rawPath.split("?")[0];
    return decodeURIComponent(pathWithoutQuery);
  } catch {
    return null;
  }
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados para archivos locales cargados en el cliente
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(project?.image || null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(project?.gallery_images || []);

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
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setErrorMsg(null);
      const supabase = createClient();

      try {
        let projectId = project?.id;
        const sanitizedName = sanitizeFilename(values.name);
        const techArray = values.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech.length > 0);

        // ── 1. GUARDAR O CREAR EL REGISTRO BASE EN LA BASE DE DATOS ──
        if (!isEditMode) {
          // Crear proyecto (Insert inicial sin URLs definitivas de imágenes)
          const { data: newProj, error: insertError } = await supabase
            .from("Projects")
            .insert([
              {
                name: values.name,
                description: values.description,
                technologies: techArray,
                typeApp: values.typeApp,
                linkDemo: values.linkDemo,
                linkRepo: values.linkRepo,
                linkFigma: values.linkFigma || null,
                image: "", // Temp
                gallery_images: [], // Temp
              },
            ])
            .select()
            .single();

          if (insertError) throw insertError;
          projectId = newProj.id;
        } else {
          // Si estamos editando y el nombre cambió, renombrar los archivos existentes en Supabase Storage
          const oldSanitizedName = sanitizeFilename(project.name);
          if (oldSanitizedName !== sanitizedName && project.id) {
            // Renombrar Portada Actual
            if (project.image) {
              const oldCoverPath = getPathFromUrl(project.image);
              if (oldCoverPath) {
                const ext = oldCoverPath.split(".").pop();
                const newCoverPath = `${project.id}-${sanitizedName}-cover.${ext}`;
                try {
                  await supabase.storage.from("PortafolioBucket").move(oldCoverPath, newCoverPath);
                  const { data } = supabase.storage.from("PortafolioBucket").getPublicUrl(newCoverPath);
                  project.image = data.publicUrl;
                } catch (err) {
                  console.error("No se pudo renombrar la portada en storage:", err);
                }
              }
            }

            // Renombrar Galería Actual
            if (project.gallery_images && project.gallery_images.length > 0) {
              const updatedGallery: string[] = [];
              for (let i = 0; i < project.gallery_images.length; i++) {
                const oldUrl = project.gallery_images[i];
                const oldPath = getPathFromUrl(oldUrl);
                if (oldPath) {
                  const ext = oldPath.split(".").pop();
                  const newPath = `${project.id}-${sanitizedName}-gallery-${i}.${ext}`;
                  try {
                    await supabase.storage.from("PortafolioBucket").move(oldPath, newPath);
                    const { data } = supabase.storage.from("PortafolioBucket").getPublicUrl(newPath);
                    updatedGallery.push(data.publicUrl);
                  } catch (err) {
                    console.error("No se pudo renombrar imagen de galería:", err);
                    updatedGallery.push(oldUrl);
                  }
                } else {
                  updatedGallery.push(oldUrl);
                }
              }
              project.gallery_images = updatedGallery;
            }
          }
        }

        if (!projectId) throw new Error("No se pudo obtener el ID del proyecto");

        // ── 2. SUBIR NUEVOS ARCHIVOS A SUPABASE STORAGE ──
        let coverUrl = isEditMode ? project.image : "";
        if (coverFile) {
          // Si el usuario subió una nueva portada, subimos el archivo
          const ext = coverFile.name.split(".").pop();
          const coverPath = `${projectId}-${sanitizedName}-cover.${ext}`;

          // Eliminar la portada vieja antes de subir la nueva (si aplica)
          if (isEditMode && project.image) {
            const oldCoverPath = getPathFromUrl(project.image);
            if (oldCoverPath) {
              await supabase.storage.from("PortafolioBucket").remove([oldCoverPath]);
            }
          }

          const { error: uploadError } = await supabase.storage
            .from("PortafolioBucket")
            .upload(coverPath, coverFile, { upsert: true });

          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from("PortafolioBucket").getPublicUrl(coverPath);
          coverUrl = data.publicUrl;
        }

        // Subir nuevas imágenes de galería
        const uploadedGalleryUrls = [...(isEditMode ? (project.gallery_images || []) : [])];
        if (galleryFiles.length > 0) {
          for (let i = 0; i < galleryFiles.length; i++) {
            const file = galleryFiles[i];
            const ext = file.name.split(".").pop();
            const indexSuffix = uploadedGalleryUrls.length + i;
            const galleryPath = `${projectId}-${sanitizedName}-gallery-${indexSuffix}.${ext}`;

            const { error: uploadError } = await supabase.storage
              .from("PortafolioBucket")
              .upload(galleryPath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("PortafolioBucket").getPublicUrl(galleryPath);
            uploadedGalleryUrls.push(data.publicUrl);
          }
        }

        // ── 3. ACTUALIZAR EL REGISTRO CON LAS URLS FINALES DE LAS IMÁGENES ──
        const { error: updateError } = await supabase
          .from("Projects")
          .update({
            name: values.name,
            description: values.description,
            technologies: techArray,
            typeApp: values.typeApp,
            linkDemo: values.linkDemo,
            linkRepo: values.linkRepo,
            linkFigma: values.linkFigma || null,
            image: coverUrl,
            gallery_images: uploadedGalleryUrls,
          })
          .eq("id", projectId);

        if (updateError) throw updateError;

        router.push("/admin/projects");
        router.refresh();
      } catch (err: unknown) {
        console.error("Error al procesar el proyecto:", err);
        setErrorMsg(err instanceof Error ? err.message : "Error inesperado al guardar");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Manejo de carga local de la portada
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Manejo de carga local de múltiples imágenes de galería
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileList = Array.from(files);
      setGalleryFiles((prev) => [...prev, ...fileList]);

      const newPreviews = fileList.map((file) => URL.createObjectURL(file));
      setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // Remover imagen de galería (existente o nueva)
  const removeGalleryImage = async (index: number) => {
    const supabase = createClient();

    // Si es un archivo local nuevo
    const numExisting = isEditMode ? (project?.gallery_images?.length || 0) : 0;
    if (index >= numExisting) {
      const localIndex = index - numExisting;
      setGalleryFiles((prev) => prev.filter((_, i) => i !== localIndex));
      setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Si es una imagen existente en la base de datos
      if (project?.gallery_images) {
        const urlToRemove = project.gallery_images[index];
        const pathToRemove = getPathFromUrl(urlToRemove);

        if (pathToRemove) {
          try {
            await supabase.storage.from("PortafolioBucket").remove([pathToRemove]);
          } catch (err) {
            console.error("Error al eliminar del storage:", err);
          }
        }

        // Actualizar el array local en el UI
        const updatedGallery = project.gallery_images.filter((_, i) => i !== index);
        project.gallery_images = updatedGallery;
        setGalleryPreviews(updatedGallery);
      }
    }
  };

  return (
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
        <div className="bg-black-3 p-6 md:p-8 rounded-lg border border-gray-2/10 relative overflow-hidden flex flex-col gap-6 shadow-md">
          {/* Línea superior con gradiente (estilo Figma) */}
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#00ff99] to-transparent opacity-30" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre del Proyecto */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="name" className="text-gray-4 text-label-form">
                Nombre del Proyecto
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full bg-black-2 border border-gray-2/20 focus:border-primary/50 rounded-[2px] px-4 py-3 text-gray-5 focus:outline-none transition-colors text-sm"
                placeholder="Ej. Arquitectura Central Obsidiana"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                disabled={isSubmitting}
              />
              {formik.touched.name && formik.errors.name && (
                <span className="text-[#eb5757] text-xs px-1">{formik.errors.name}</span>
              )}
            </div>

            {/* Tecnologías */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="technologies" className="text-gray-4 text-label-form">
                Tecnologías (Separadas por comas)
              </label>
              <input
                id="technologies"
                name="technologies"
                type="text"
                className="w-full bg-black-2 border border-gray-2/20 focus:border-primary/50 rounded-[2px] px-4 py-3 text-gray-5 focus:outline-none transition-colors text-sm"
                placeholder="Ej. React, Tailwind, Supabase"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.technologies}
                disabled={isSubmitting}
              />
              {formik.touched.technologies && formik.errors.technologies && (
                <span className="text-[#eb5757] text-xs px-1">{formik.errors.technologies}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de Aplicación (typeApp) */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="typeApp" className="text-gray-4 text-label-form">
                Tipo de Aplicación
              </label>
              <select
                id="typeApp"
                name="typeApp"
                className="w-full bg-black-2 border border-gray-2/20 focus:border-primary/50 rounded-[2px] px-4 py-3 text-gray-5 focus:outline-none transition-colors text-sm cursor-pointer"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.typeApp}
                disabled={isSubmitting}
              >
                <option value="" className="bg-black-3 text-gray-4">Seleccionar...</option>
                <option value="Plataforma Web" className="bg-black-3 text-gray-5">Plataforma Web</option>
                <option value="Aplicación Móvil" className="bg-black-3 text-gray-5">Aplicación Móvil</option>
                <option value="API Rest" className="bg-black-3 text-gray-5">API Rest</option>
                <option value="Librería" className="bg-black-3 text-gray-5">Librería</option>
                <option value="Otros" className="bg-black-3 text-gray-5">Otros</option>
              </select>
              {formik.touched.typeApp && formik.errors.typeApp && (
                <span className="text-[#eb5757] text-xs px-1">{formik.errors.typeApp}</span>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="description" className="text-gray-4 text-label-form">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full bg-black-2 border border-gray-2/20 focus:border-primary/50 rounded-[2px] px-4 py-3 text-gray-5 focus:outline-none transition-colors text-sm resize-none"
              placeholder="Marco estructural integrado para paneles empresariales..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              disabled={isSubmitting}
            />
            {formik.touched.description && formik.errors.description && (
              <span className="text-[#eb5757] text-xs px-1">{formik.errors.description}</span>
            )}
          </div>
        </div>

        {/* Grid para Card 2 (Visuales) y Card 3 (Enlaces) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">

          {/* Card 2: Recursos Visuales */}
          <div className="bg-black-3 p-6 md:p-8 rounded-lg border border-gray-2/10 flex flex-col gap-6 shadow-md">
            <div className="flex items-center gap-2">
              <ImageIcon className="text-[#00ff99] size-[18px]" />
              <h3 className="text-[#00ff99] text-heading-card">
                Recursos Visuales
              </h3>
            </div>

            {/* Selector de Portada (Cover) */}
            <div className="flex flex-col gap-3">
              <span className="text-gray-4 text-label-form">
                Imagen de Portada (Cover)
              </span>
              <input
                id="coverInput"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
                disabled={isSubmitting}
              />
              <label
                htmlFor="coverInput"
                className="flex items-center justify-center border border-dashed border-gray-2/20 hover:border-primary/50 rounded-lg p-4 bg-black-2 text-gray-4 text-xs font-semibold cursor-pointer hover:bg-black-2/50 transition-all select-none"
              >
                <span>SELECCIONAR NUEVA PORTADA</span>
              </label>

              {coverPreview && (
                <div className="bg-black-2 p-2 rounded border border-gray-2/20 relative aspect-video flex items-center justify-center overflow-hidden">
                  <img
                    alt="Portada preview"
                    className="object-cover size-full rounded"
                    src={coverPreview}
                  />
                </div>
              )}
            </div>

            {/* Selector de Galería Múltiple */}
            <div className="flex flex-col gap-3">
              <span className="text-gray-4 text-label-form">
                Imágenes de la Galería
              </span>
              <input
                id="galleryInput"
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryChange}
                className="hidden"
                disabled={isSubmitting}
              />
              <label
                htmlFor="galleryInput"
                className="flex items-center justify-center border border-dashed border-gray-2/20 hover:border-primary/50 rounded-lg p-4 bg-black-2 text-gray-4 text-xs font-semibold cursor-pointer hover:bg-black-2/50 transition-all select-none"
              >
                <span>AÑADIR IMÁGENES A LA GALERÍA</span>
              </label>

              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                  {galleryPreviews.map((preview, idx) => (
                    <div
                      key={idx}
                      className="bg-black-2 p-1 rounded border border-gray-2/20 relative aspect-square flex items-center justify-center overflow-hidden group"
                    >
                      <img
                        alt={`Galería preview ${idx}`}
                        className="object-cover size-full rounded"
                        src={preview}
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute inset-0 bg-red-600/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                        title="Eliminar de la galería"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Enlaces de Despliegue */}
          <div className="bg-black-3 p-6 md:p-8 rounded-lg border border-gray-2/10 flex flex-col gap-6 shadow-md">
            <div className="flex items-center gap-2">
              <Globe className="text-[#00ff99] size-[18px]" />
              <h3 className="text-[#00ff99] text-heading-card">
                Enlaces de Despliegue
              </h3>
            </div>

            {/* URL Demostración */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2">
                <Globe className="size-4 text-gray-4" />
                <label htmlFor="linkDemo" className="text-gray-4 text-label-form">
                  URL de Demostración
                </label>
              </div>
              <input
                id="linkDemo"
                name="linkDemo"
                type="text"
                className="w-full bg-black-2 border border-gray-2/20 focus:border-primary/50 rounded-[2px] px-4 py-3 text-gray-5 focus:outline-none transition-colors text-sm"
                placeholder="https://ejemplo.demo.io"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.linkDemo}
                disabled={isSubmitting}
              />
              {formik.touched.linkDemo && formik.errors.linkDemo && (
                <span className="text-[#eb5757] text-xs px-1">{formik.errors.linkDemo}</span>
              )}
            </div>

            {/* URL Repositorio */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2">
                <Github className="size-4 text-gray-4" />
                <label htmlFor="linkRepo" className="text-gray-4 text-label-form">
                  URL del Repositorio
                </label>
              </div>
              <input
                id="linkRepo"
                name="linkRepo"
                type="text"
                className="w-full bg-black-2 border border-gray-2/20 focus:border-primary/50 rounded-[2px] px-4 py-3 text-gray-5 focus:outline-none transition-colors text-sm"
                placeholder="https://github.com/usuario/repo"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.linkRepo}
                disabled={isSubmitting}
              />
              {formik.touched.linkRepo && formik.errors.linkRepo && (
                <span className="text-[#eb5757] text-xs px-1">{formik.errors.linkRepo}</span>
              )}
            </div>

            {/* URL Figma */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2">
                <Palette className="size-4 text-gray-4" />
                <label htmlFor="linkFigma" className="text-gray-4 text-label-form">
                  URL de Figma (Opcional)
                </label>
              </div>
              <input
                id="linkFigma"
                name="linkFigma"
                type="text"
                className="w-full bg-black-2 border border-gray-2/20 focus:border-primary/50 rounded-[2px] px-4 py-3 text-gray-5 focus:outline-none transition-colors text-sm"
                placeholder="https://figma.com/file/..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.linkFigma}
                disabled={isSubmitting}
              />
              {formik.touched.linkFigma && formik.errors.linkFigma && (
                <span className="text-[#eb5757] text-xs px-1">{formik.errors.linkFigma}</span>
              )}
            </div>
          </div>
        </div>

        {/* Mensaje de error general si ocurre al enviar */}
        {errorMsg && (
          <div className="w-full p-4 bg-danger/10 border border-danger/20 rounded-[2px] text-xs text-danger text-center font-mono">
            {errorMsg}
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex items-center justify-end gap-6 pt-6">
          <Link
            href="/admin/projects"
            className="text-[#eb5757] hover:text-[#eb5757]/80 text-sm font-semibold tracking-[1.4px] uppercase select-none transition-colors"
          >
            CANCELAR
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#00ff99] hover:bg-[#00ff99]/90 text-[#151515] font-extrabold px-10 py-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(0,255,153,0.3)] transition-all select-none cursor-pointer disabled:opacity-50"
          >
            <Save className="size-[18px]" />
            <span className="text-sm tracking-[1.4px] uppercase">
              {isSubmitting ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

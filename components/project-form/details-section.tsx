import { useFormikContext } from "formik";

interface FormValues {
  name: string;
  technologies: string;
  typeApp: string;
  description: string;
}

interface DetailsSectionProps {
  isSubmitting: boolean;
}

/**
 * Sección de detalles principales del proyecto (Nombre, Tecnologías, Tipo, Descripción).
 * Consume el contexto de Formik. (SRP)
 */
export function DetailsSection({ isSubmitting }: DetailsSectionProps) {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext<FormValues>();

  return (
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
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            disabled={isSubmitting}
          />
          {touched.name && errors.name && (
            <span className="text-[#eb5757] text-xs px-1">{errors.name}</span>
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
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.technologies}
            disabled={isSubmitting}
          />
          {touched.technologies && errors.technologies && (
            <span className="text-[#eb5757] text-xs px-1">{errors.technologies}</span>
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
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.typeApp}
            disabled={isSubmitting}
          >
            <option value="" className="bg-black-3 text-gray-4">Seleccionar...</option>
            <option value="Plataforma Web" className="bg-black-3 text-gray-5">Plataforma Web</option>
            <option value="Aplicación Móvil" className="bg-black-3 text-gray-5">Aplicación Móvil</option>
            <option value="API Rest" className="bg-black-3 text-gray-5">API Rest</option>
            <option value="Librería" className="bg-black-3 text-gray-5">Librería</option>
            <option value="Otros" className="bg-black-3 text-gray-5">Otros</option>
          </select>
          {touched.typeApp && errors.typeApp && (
            <span className="text-[#eb5757] text-xs px-1">{errors.typeApp}</span>
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
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.description}
          disabled={isSubmitting}
        />
        {touched.description && errors.description && (
          <span className="text-[#eb5757] text-xs px-1">{errors.description}</span>
        )}
      </div>
    </div>
  );
}

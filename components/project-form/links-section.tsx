import { useFormikContext } from "formik";
import { Globe, Github, Palette } from "lucide-react";

interface FormValues {
  linkDemo: string;
  linkRepo: string;
  linkFigma: string;
}

interface LinksSectionProps {
  isSubmitting: boolean;
}

/**
 * Sección de enlaces de despliegue del proyecto (Demostración, Repositorio, Figma).
 * Consume el contexto de Formik. (SRP)
 */
export function LinksSection({ isSubmitting }: LinksSectionProps) {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext<FormValues>();

  return (
    <div className="bg-black-3 p-6 md:p-8 rounded-lg border border-gray-2/10 flex flex-col gap-6 shadow-md">
      <div className="flex items-center gap-2">
        <Globe className="text-[#00ff99] size-[18px]" />
        <h3 className="text-[#00ff99] text-heading-card">Enlaces de Despliegue</h3>
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
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.linkDemo}
          disabled={isSubmitting}
        />
        {touched.linkDemo && errors.linkDemo && (
          <span className="text-[#eb5757] text-xs px-1">{errors.linkDemo}</span>
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
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.linkRepo}
          disabled={isSubmitting}
        />
        {touched.linkRepo && errors.linkRepo && (
          <span className="text-[#eb5757] text-xs px-1">{errors.linkRepo}</span>
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
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.linkFigma}
          disabled={isSubmitting}
        />
        {touched.linkFigma && errors.linkFigma && (
          <span className="text-[#eb5757] text-xs px-1">{errors.linkFigma}</span>
        )}
      </div>
    </div>
  );
}

import { Image as ImageIcon, Trash2 } from "lucide-react";

interface VisualsSectionProps {
  isSubmitting: boolean;
  coverPreview: string | null;
  galleryPreviews: string[];
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveGalleryImage: (index: number) => void;
}

/**
 * Sección de visuales del proyecto (Portada, Galería e interactividad de carga).
 * Componente puro que recibe callbacks y estados como props. (SRP)
 */
export function VisualsSection({
  isSubmitting,
  coverPreview,
  galleryPreviews,
  onCoverChange,
  onGalleryChange,
  onRemoveGalleryImage,
}: VisualsSectionProps) {
  return (
    <div className="bg-black-3 p-6 md:p-8 rounded-lg border border-gray-2/10 flex flex-col gap-6 shadow-md">
      <div className="flex items-center gap-2">
        <ImageIcon className="text-[#00ff99] size-[18px]" />
        <h3 className="text-[#00ff99] text-heading-card">Recursos Visuales</h3>
      </div>

      {/* Selector de Portada (Cover) */}
      <div className="flex flex-col gap-3">
        <span className="text-gray-4 text-label-form">Imagen de Portada (Cover)</span>
        <input
          id="coverInput"
          type="file"
          accept="image/*"
          onChange={onCoverChange}
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
        <span className="text-gray-4 text-label-form">Imágenes de la Galería</span>
        <input
          id="galleryInput"
          type="file"
          multiple
          accept="image/*"
          onChange={onGalleryChange}
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
                  onClick={() => onRemoveGalleryImage(idx)}
                  className="absolute inset-0 bg-red-600/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                  title="Eliminar de la galería"
                  disabled={isSubmitting}
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

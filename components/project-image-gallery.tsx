"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";

interface ProjectImageGalleryProps {
  name: string;
  coverImage: string;
  galleryImages?: string[];
}

export function ProjectImageGallery({ name, coverImage, galleryImages = [] }: ProjectImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Si no se proporcionaron imágenes en la galería, usamos la de portada como única imagen
  const images = galleryImages && galleryImages.length > 0 ? galleryImages : [coverImage];

  const handleOpen = () => {
    setIsOpen(true);
    setCurrentIndex(0);
  };

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // Manejo de eventos de teclado y scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Bloquear scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen, handleNext, handlePrev]);

  return (
    <>
      {/* Contenedor de la Imagen de Portada con Hover */}
      <div
        onClick={handleOpen}
        className="w-full aspect-video relative overflow-hidden rounded-t-4xl group cursor-pointer"
      >
        <Image
          src={coverImage}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay de Hover (Indicador Visual) */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="bg-primary/20 backdrop-blur-md border border-primary/30 p-4 rounded-full text-primary scale-75 group-hover:scale-100 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,153,0.35)]">
            <Icon icon="bi:images" className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Lightbox / Modal de la Galería */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-6 transition-opacity duration-300 ease-out"
          onClick={() => setIsOpen(false)}
        >
          {/* Botón de Cerrar */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-50 p-2.5 bg-black-3/80 border border-gray-2 text-gray-5 hover:text-primary rounded-full transition-all duration-300 hover:scale-110 hover:border-primary/50 cursor-pointer shadow-lg"
            aria-label="Cerrar galería"
          >
            <Icon icon="bi:x-lg" className="w-5 h-5" />
          </button>

          {/* Información del Proyecto (Esquina Superior Izquierda) */}
          <div className="absolute top-4 left-4 z-40 text-gray-5 select-none hidden md:block">
            <h4 className="font-bold text-lg text-primary uppercase tracking-wide">{name}</h4>
            <p className="text-xs text-gray-4">Galería de imágenes del proyecto</p>
          </div>

          {/* Visualizador Principal de Imagen */}
          <div className="flex-1 flex items-center justify-center relative w-full h-[60vh] md:h-[70vh] mt-12 md:mt-0 select-none">
            {/* Controles de Navegación Lateral */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-2 md:left-6 z-10 p-3 bg-black-3/60 border border-gray-2/50 text-gray-5 hover:text-primary rounded-full transition-all duration-300 hover:bg-black-3 hover:scale-110 cursor-pointer shadow-lg"
                  aria-label="Imagen anterior"
                >
                  <Icon icon="bi:chevron-left" className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-2 md:right-6 z-10 p-3 bg-black-3/60 border border-gray-2/50 text-gray-5 hover:text-primary rounded-full transition-all duration-300 hover:bg-black-3 hover:scale-110 cursor-pointer shadow-lg"
                  aria-label="Siguiente imagen"
                >
                  <Icon icon="bi:chevron-right" className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Imagen Activa */}
            <div
              className="relative w-full max-w-4xl h-full max-h-[50vh] md:max-h-[65vh] rounded-2xl overflow-hidden border border-black-3 shadow-2xl transition-transform duration-300 ease-out"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[currentIndex]}
                alt={`Imagen ${currentIndex + 1} de ${name}`}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          </div>

          {/* Sección Inferior: Contador y Miniaturas */}
          <div
            className="w-full flex flex-col items-center gap-3 select-none mt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-gray-4 text-xs md:text-sm font-semibold bg-black-3/80 px-4 py-1.5 rounded-full border border-gray-2/40">
              <span className="text-primary font-bold">{currentIndex + 1}</span> de <span className="text-gray-5">{images.length}</span>
            </div>

            {/* Miniaturas (Thumbnails) */}
            {images.length > 1 && (
              <div className="flex gap-2 md:gap-3 overflow-x-auto py-2 max-w-full justify-start md:justify-center scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-16 h-10 md:w-20 md:h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 shrink-0 cursor-pointer ${idx === currentIndex
                        ? "border-primary scale-105 shadow-[0_0_10px_rgba(0,255,153,0.4)]"
                        : "border-black-3 opacity-50 hover:opacity-100 hover:scale-102 hover:border-gray-2"
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`Miniatura ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

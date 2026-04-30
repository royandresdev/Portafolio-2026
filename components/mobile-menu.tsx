"use client";

import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  links: { id: string; label: string }[];
}

export function MobileMenu({ isOpen, onClose, activeSection, links }: MobileMenuProps) {
  // Bloquear scroll y manejar tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Container */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación móvil"
        aria-hidden={!isOpen}
        className={cn(
          "fixed top-0 left-0 right-0 h-auto bg-black-3/95 backdrop-blur-md border-b border-gray-1 z-50 transition-all duration-500 ease-in-out lg:hidden flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.5)]",
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}
      >
        {/* Header - Close Button */}
        <div className="flex justify-end p-6 pb-4">
          <button
            onClick={onClose}
            className="text-white hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary outline-offset-4"
            aria-label="Cerrar menú"
          >
            <Icon icon="ic:round-close" className="size-8" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
          <ul className="flex flex-col items-center gap-10">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={onClose}
                  aria-current={activeSection === link.id ? "location" : undefined}
                  className={cn(
                    "font-bold text-base uppercase transition-colors tracking-[0.05em] focus-visible:text-primary outline-none",
                    activeSection === link.id
                      ? "text-primary"
                      : "text-gray-5 hover:text-primary"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer - Social Media */}
        <div className="flex justify-center gap-6 p-10 pt-8">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/royhuamanavila"
            className="text-white hover:text-primary transition-all hover:scale-110 focus-visible:text-primary outline-none"
            aria-label="Ir a LinkedIn"
          >
            <Icon icon="mdi:linkedin" className="size-8" />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/royandresdev"
            className="text-white hover:text-primary transition-all hover:scale-110 focus-visible:text-primary outline-none"
            aria-label="Ir a GitHub"
          >
            <Icon icon="mdi:github" className="size-8" />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.youtube.com/@royandresdev"
            className="text-white hover:text-primary transition-all hover:scale-110 focus-visible:text-primary outline-none"
            aria-label="Ir a YouTube"
          >
            <Icon icon="mdi:youtube" className="size-8" />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.instagram.com/royandresdev_/"
            className="text-white hover:text-primary transition-all hover:scale-110 focus-visible:text-primary outline-none"
            aria-label="Ir a Instagram"
          >
            <Icon icon="mdi:instagram" className="size-8" />
          </a>
        </div>
      </div>
    </>
  );
}

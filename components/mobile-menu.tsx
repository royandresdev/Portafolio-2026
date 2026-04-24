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
  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 h-auto bg-black-3/95 backdrop-blur-[12px] border-b border-gray-1 z-50 transition-all duration-500 ease-in-out lg:hidden flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.5)]",
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}
      >
        {/* Header - Close Button */}
        <div className="flex justify-end p-6 pb-4">
          <button
            onClick={onClose}
            className="text-white hover:text-primary transition-colors"
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
                  className={cn(
                    "font-bold text-base uppercase transition-colors tracking-[0.05em]",
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
          <a href="https://www.linkedin.com/in/royhuamanavila" className="text-white hover:text-primary transition-all hover:scale-110">
            <Icon icon="mdi:linkedin" className="size-8" />
          </a>
          <a href="https://github.com/royandresdev" className="text-white hover:text-primary transition-all hover:scale-110">
            <Icon icon="mdi:github" className="size-8" />
          </a>
          <a href="https://www.youtube.com/@royandresdev" className="text-white hover:text-primary transition-all hover:scale-110">
            <Icon icon="mdi:youtube" className="size-8" />
          </a>
          <a href="https://www.instagram.com/royandresdev_/" className="text-white hover:text-primary transition-all hover:scale-110">
            <Icon icon="mdi:instagram" className="size-8" />
          </a>
        </div>
      </div>
    </>
  );
}

"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

import { MobileMenu } from "./mobile-menu";

const NAV_LINKS = [
  { id: "about", label: "ACERCA DE MI" },
  { id: "projects", label: "PROYECTOS" },
  { id: "skills", label: "HABILIDADES" },
  { id: "contact", label: "CONTACTO" },
];

export function Header() {
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const setupObserver = useCallback((observer: IntersectionObserver) => {
    NAV_LINKS.forEach((link) => {
      const section = document.getElementById(link.id);
      if (section) {
        observer.observe(section);
      }
    });
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    setupObserver(observer);

    // MutationObserver to detect when Suspense components (like Projects) are loaded
    const mutationObserver = new MutationObserver(() => {
      setupObserver(observer);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [setupObserver]);

  return (
    <div className="w-full bg-[#0000001a] backdrop-blur-[2px] fixed top-0 z-50">
      <header className="relative flex justify-end lg:justify-center items-center h-18 container mx-auto px-6 max-w-[1280px]">
        <div className="absolute left-6">
          <Image
            src="/Logo.svg"
            alt="Logo"
            className="h-8 lg:h-12 w-auto"
            width={45}
            height={48}
            priority
            fetchPriority="high"
          />
        </div>
        <nav className="hidden lg:block">
          <ul className="flex gap-3 text-gray-5 font-bold">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={activeSection === link.id ? "location" : undefined}
                  className={`transition-colors hover:text-primary ${activeSection === link.id ? "text-primary" : ""
                    }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          className="lg:hidden p-2 -mr-2 focus-visible:outline-2 focus-visible:outline-primary outline-offset-4 rounded-md"
          aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen(true)}
        >
          <Icon className="size-8 text-primary" icon="material-symbols:menu-rounded" />
        </button>
      </header>

      {/* Menú Móvil */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeSection={activeSection}
        links={NAV_LINKS}
      />
    </div>
  );
}

export default Header;

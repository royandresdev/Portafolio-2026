"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { id: "about", label: "ACERCA DE MI" },
  { id: "projects", label: "PROYECTOS" },
  { id: "skills", label: "HABILIDADES" },
  { id: "contact", label: "CONTACTO" },
];

export function Header() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px", // Trigger when section is in the middle-top of viewport
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

    // Observe all sections mentioned in NAV_LINKS
    NAV_LINKS.forEach((link) => {
      const section = document.getElementById(link.id);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full bg-[#0000001a] backdrop-blur-[2px] fixed top-0 z-50">
      <header className="relative flex justify-end lg:justify-center items-center h-18 container mx-auto px-6 max-w-[1280px]">
        <div className="absolute left-6">
          <Image className="h-8 w-auto lg:h-12" src="/logo.svg" alt="Logo" height={48} width={43} loading="eager" />
        </div>
        <nav className="hidden lg:block">
          <ul className="flex gap-3 text-gray-5 font-bold">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`transition-colors hover:text-primary ${
                    activeSection === link.id ? "text-primary" : ""
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button className="lg:hidden">
          <Icon className="size-8 text-primary" icon="material-symbols:menu-rounded" />
        </button>
      </header>
    </div>
  );
}

export default Header;

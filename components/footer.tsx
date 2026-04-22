import Image from "next/image";
import { AnimateOnScroll } from "./animate-on-scroll";

export default function Footer() {
  return (
    <footer className="bg-black-2 py-16">
      <AnimateOnScroll className="container max-w-[1280px] px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Logo and Tagline Section */}
          <div className="flex items-center gap-6 max-w-md">
            {/* Logo Placeholder */}
            <Image
              src="/Logo.svg"
              alt="Logo"
              className="h-10 lg:h-12 w-auto"
              width={45}
              height={48}
            />
            <p className="text-white text-sm leading-relaxed max-w-[300px]">
              Simplificando tu salto al mundo digital
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Servicios */}
            <div className="flex flex-col gap-4">
              <h3 className="text-white font-bold text-xs tracking-widest uppercase">
                Servicios
              </h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <a href="#" className="text-gray-4 hover:text-primary transition-colors text-sm">
                    Diseño Web
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-4 hover:text-primary transition-colors text-sm">
                    SEO
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-4 hover:text-primary transition-colors text-sm">
                    Optimización Web
                  </a>
                </li>
              </ul>
            </div>

            {/* Redes Sociales */}
            <div className="flex flex-col gap-4">
              <h3 className="text-white font-bold text-xs tracking-widest uppercase">
                Redes Sociales
              </h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-4 hover:text-primary transition-colors text-sm"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-4 hover:text-primary transition-colors text-sm"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-2 pt-8 flex justify-between items-center">
          <p className="text-gray-4 text-xs">
            © 2026 RoyAndresDev
          </p>
        </div>
      </AnimateOnScroll>
    </footer>
  );
}


export default function Footer() {
  return (
    <footer className="bg-black-2 py-16 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Logo and Tagline Section */}
          <div className="flex flex-col gap-6 max-w-md">
            {/* Logo Placeholder */}
            <div className="h-12 w-48 flex items-center">
              {/* Logo will be placed here */}
              <div className="text-gray-4 text-sm border border-dashed border-gray-2 p-2 rounded">
                Logo Placeholder
              </div>
            </div>
            <p className="text-white text-sm leading-relaxed max-w-[300px]">
              Simplificando tu salto al mundo digital
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8">
            {/* Servicios */}
            <div className="flex flex-col gap-4">
              <h5 className="text-white font-bold text-xs tracking-widest uppercase">
                Servicios
              </h5>
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
              <h5 className="text-white font-bold text-xs tracking-widest uppercase">
                Redes Sociales
              </h5>
              <ul className="flex flex-col gap-3">
                <li>
                  <a href="#" className="text-gray-4 hover:text-primary transition-colors text-sm">
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-4 hover:text-primary transition-colors text-sm">
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
      </div>
    </footer>
  );
}

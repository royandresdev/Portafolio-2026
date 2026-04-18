import { Icon } from "@iconify/react";
import Image from "next/image";

export function Header() {
  return (
    <div className="w-full bg-[#0000001a] backdrop-blur-[2px] fixed top-0 z-50">
      <header className="relative flex justify-end lg:justify-center items-center h-18 container mx-auto px-6 max-w-[1280px]">
        <div className="absolute left-6">
          <Image className="h-8 w-auto lg:h-12" src="/logo.svg" alt="Logo" height={48} width={43} loading="eager" />
        </div>
        <nav className="hidden lg:block">
          <ul className="flex gap-3 text-gray-5 font-bold">
            <li>
              <a href="#" className="text-primary">ACERCA DE MI</a>
            </li>
            <li>
              <a href="#">PROYECTOS</a>
            </li>
            <li>
              <a href="#">HABILIDADES</a>
            </li>
            <li>
              <a href="#">CONTACTO</a>
            </li>
          </ul>
        </nav>
        <button className="lg:hidden">
          <Icon className="size-8 text-primary" icon="material-symbols:menu-rounded" />
        </button>
      </header>
    </div>
  )
}

export default Header

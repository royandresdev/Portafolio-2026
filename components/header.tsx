import Image from "next/image";

export function Header() {
  return (
    <div className="w-full bg-[#0000001a] backdrop-blur-[2px] fixed top-0 z-50">
      <header className="relative flex justify-center items-center h-18 container mx-auto px-6">
        <div className="absolute left-0">
          <Image src="/logo.svg" alt="Logo" height={48} width={43} loading="eager" />
        </div>
        <nav>
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
      </header>
    </div>
  )
}

export default Header

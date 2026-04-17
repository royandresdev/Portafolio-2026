export function Header() {
  return (
    <div className="w-full bg-black-3">
      <header className="relative flex justify-center items-center h-18 container mx-auto px-6">
        <div className="absolute left-0">
          <p>Logo</p>
        </div>
        <nav>
          <ul className="flex gap-3 text-gray-5 font-medium">
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

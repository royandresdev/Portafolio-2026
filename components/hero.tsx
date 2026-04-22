import { Icon } from "@iconify/react";
import Image from "next/image";

export function Hero() {
  return (
    <section id="about" className="h-fit lg:h-screen min-h-[700px] py-24 flex flex-col lg:flex-row items-center px-6 container max-w-[1280px] mx-auto justify-center gap-6">
      {/* Avatar: desliza desde la izquierda */}
      <Image
        className="block animate-fade-right"
        src="/Avatar-Portafolio.png"
        alt="Avatar"
        width={500}
        height={500}
        priority
        sizes="(max-width: 768px) 100vw, 500px"
      />

      <div className="space-y-6 max-w-[600px]">
        {/* Caption: fade up sin delay */}
        <span className="caption animate-fade-up">-MI NOMBRE ES</span>

        {/* H1: fade up con delay 100ms */}
        <h1 className="text-2xl lg:text-5xl/snug font-bold animate-fade-up delay-100">
          <span className="text-primary">ROY HUAMAN</span> <br />
          <span className="text-gray-5">FULLSTACK DEVELOPER</span>
        </h1>

        {/* Párrafo: fade up con delay 200ms */}
        <p className="text-gray-4 font-medium lg:text-lg animate-fade-up delay-200">
          ¡Bienvenido! Soy un entusiasta de la programación. Desde siempre me ha fascinado entender cómo funciona el software. Al codificar, siento que tengo la libertad de explotar al máximo mi creatividad, creando código sólido y profesional.
        </p>

        {/* Iconos sociales: fade up con delay 300ms + efectos hover + float */}
        <div className="flex gap-4 animate-fade-up delay-300">
          <a
            href="https://github.com/royandresdev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-all duration-300 hover:scale-120 hover:text-primary text-gray-4 animate-float"
            aria-label="GitHub"
          >
            <Icon icon="bi:github" fontSize={32} />
          </a>
          <a
            href="https://www.linkedin.com/in/royhuamanavila"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-all duration-300 hover:scale-120 hover:text-primary text-gray-4 animate-float [animation-delay:1.5s]"
            aria-label="LinkedIn"
          >
            <Icon icon="mdi:linkedin" fontSize={32} />
          </a>
        </div>
      </div>
    </section>
  );
}

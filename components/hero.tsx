import Image from "next/image";

export function Hero() {
  return (
    <section className="h-screen min-h-[700px] flex items-center px-6 container mx-auto justify-center gap-6">
      <Image src="/avatar-profile.png" alt="Avatar" width={500} height={500} loading="eager" />
      <div className="space-y-6 max-w-[600px]">
        <span className="label-heading">-MI NOMBRE ES</span>
        <h1 className="text-5xl/14 font-bold">
          <span className="text-primary">ROY HUAMAN</span> <br />
          <span className="text-gray-5">FULLSTACK DEVELOPER</span>
        </h1>
        <p className="text-gray-4 font-medium text-lg">
          ¡Bienvenido! Soy un entusiasta de la programación. Desde siempre me ha fascinado entender cómo funciona el software. Al codificar, siento que tengo la libertad de explotar al máximo mi creatividad, creando código sólido y profesional.
        </p>
      </div>
    </section>
  );
}

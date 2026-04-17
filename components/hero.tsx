export function Hero() {
  return (
    <section className="h-screen min-h-[700px] flex items-center px-6 container mx-auto justify-center gap-6">
      <div className="bg-radial from-[#5BFFC0] to-[#0ACF83] size-[500px] rounded-full shadow">

      </div>
      <div className="space-y-6 max-w-[600px]">
        <span className="label-heading">-MI NOMBRE ES</span>
        <h1 className="text-5xl/14 font-bold">
          <span className="text-primary">ROY HUAMAN</span> <br />
          <span>FULLSTACK DEVELOPER</span>
        </h1>
        <p className="text-gray-4 font-medium text-lg">
          ¡Bienvenido! Soy un entusiasta de la programación. Desde siempre me ha fascinado entender cómo funciona el software. Al codificar, siento que tengo la libertad de explotar al máximo mi creatividad, creando código sólido y profesional.
        </p>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="container mx-auto px-6 py-16 grid grid-cols-2">
      <form>
        {/* Formulario con Formik */}
      </form>
      <div className="space-y-8">
        <h2>CONTACTO</h2>
        <p className="text-gray-5">Gracias por visitar mi portafolio web. Espero que te haya gustado lo que has visto. Aquí puedes encontrar mis datos de contacto.</p>
        {/* Contact Item */}
        <div>
          {/* Icon */}
          <div>
            <p className="text-gray-5 font-bold">Dirección</p>
            <p className="text-primary">Lima, Perú</p>
          </div>
        </div>
        {/* Contact Item */}
        <div>
          {/* Icon */}
          <div>
            <p className="text-gray-5 font-bold">Celular</p>
            <p className="text-primary">993 927 044</p>
          </div>
        </div>
        {/* Contact Item */}
        <div>
          {/* Icon */}
          <div>
            <p className="text-gray-5 font-bold">Correo Electrónico</p>
            <p className="text-primary">contact@royandresdev.com</p>
          </div>
        </div>
      </div>
    </section>
  )
}

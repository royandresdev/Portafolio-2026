export function Skills() {
  return (
    <section className="container mx-auto px-6">
      <span className="label-heading mb-4">- MIS HABILIDADES</span>
      <h2 className="mb-4">EDUCACIÓN Y HABILIDADES</h2>
      <p className="text-gray-4 mb-16">
        A lo largo de mi carrera he tenido la oportunidad de formarme en
        diferentes áreas, lo que me ha permitido adquirir conocimientos y
        habilidades en diversas tecnologías.
      </p>
      <div className="grid grid-cols-2">
        {/* Formación Académica */}
        <div className="space-y-8">
          <h3 className="text-[32px] text-primary font-medium mb-8">Formación Académica</h3>
          {/* Formación Académica Item*/}
          <div>
            {/* Icono de la institución */}
            <div>
              <h4 className="text-gray-5 font-bold text-xl">Ingeniería de Software</h4>
              <p className="text-gray-4">Instituto San Ignacio de Loyola</p>
              <p className="text-gray-4">2021 - Pausado</p>
            </div>
          </div>
          {/* Formación Académica Item*/}
          <div>
            {/* Icono de la institución */}
            <div>
              <h4 className="text-gray-5 font-bold text-xl">Java</h4>
              <p className="text-gray-4">Cibertec</p>
              <p className="text-gray-4">2020 - 2021</p>
            </div>
          </div>
        </div>

        {/* Habilidades Técnicas */}
        <div>
          <h3 className="text-[32px] text-primary font-medium mb-8">Habilidades Técnicas</h3>
          <SkillsContainer />
        </div>
      </div>
    </section>
  )
}

function SkillsContainer() {
  return (
    <div>
      {/* Iconos de tecnologías */}
    </div>
  )
}

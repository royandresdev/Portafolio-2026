import { Icon } from "@iconify/react";

const techs = [
  { name: "React", icon: "logos:react" },
  { name: "Tailwind", icon: "logos:tailwindcss-icon" },
  { name: "Redux", icon: "logos:redux" },
  { name: "Javascript", icon: "logos:javascript" },
  { name: "HTML", icon: "vscode-icons:file-type-html" },
  { name: "CSS", icon: "devicon:css" },
];

export function Skills() {
  return (
    <section className="container mx-auto max-w-[1280px] px-6">
      <span className="label-heading mb-4">- MIS HABILIDADES</span>
      <h2 className="mb-4">EDUCACIÓN Y HABILIDADES</h2>
      <p className="text-gray-4 mb-16">
        A lo largo de mi carrera he tenido la oportunidad de formarme en
        diferentes áreas, lo que me ha permitido adquirir conocimientos y
        habilidades en diversas tecnologías.
      </p>
      <div className="grid grid-cols-2 gap-18">
        {/* Formación Académica */}
        <div className="space-y-8">
          <h3 className="text-[32px] text-primary font-medium mb-8">Formación Académica</h3>
          {/* Formación Académica Item*/}
          <div className="flex items-center gap-4">
            <Icon icon="basil:university-solid" className="text-primary text-[32px]" />
            <div>
              <h4 className="text-gray-5 font-bold text-xl">Ingeniería de Software</h4>
              <p className="text-gray-4">Instituto San Ignacio de Loyola</p>
              <p className="text-gray-4">2021 - Pausado</p>
            </div>
          </div>
          {/* Formación Académica Item*/}
          <div className="flex items-center gap-4">
            <Icon icon="fluent:certificate-16-filled" className="text-primary text-[32px]" />
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
          <CarouselSkills />
        </div>
      </div>
    </section>
  )
}

function CarouselSkills() {
  return (
    <div className="bg-black-3 border px-6 w-fit border-gray-2 rounded-[32px] py-6 flex flex-wrap justify-center gap-6 items-center custom-shadow">
      {techs.map((tech) => (
        <div key={tech.name} className="flex flex-col items-center gap-3 transition-transform hover:scale-110">
          <div className="size-16 flex items-center justify-center">
            <Icon icon={tech.icon} className="text-[72px]" />
          </div>
          <p className="text-gray-5 font-medium text-base">{tech.name}</p>
        </div>
      ))}
    </div>
  )
}

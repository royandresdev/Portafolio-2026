import { Icon } from "@iconify/react";
import { AnimateOnScroll } from "./animate-on-scroll";

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
      {/* Header */}
      <AnimateOnScroll>
        <span className="caption mb-4">- MIS HABILIDADES</span>
      </AnimateOnScroll>
      <AnimateOnScroll delay={100}>
        <h2 className="mb-4">EDUCACIÓN Y HABILIDADES</h2>
      </AnimateOnScroll>
      <AnimateOnScroll delay={200}>
        <p className="text-gray-4 mb-16">
          A lo largo de mi carrera he tenido la oportunidad de formarme en
          diferentes áreas, lo que me ha permitido adquirir conocimientos y
          habilidades en diversas tecnologías.
        </p>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-18">
        {/* Formación Académica */}
        <div className="space-y-8">
          <AnimateOnScroll animation="fade-right" delay={100}>
            <h3 className="text-xl lg:text-[32px] text-primary font-medium mb-8">Formación Académica</h3>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-right" delay={200}>
            <div className="flex items-center gap-4">
              <Icon icon="basil:university-solid" className="text-primary text-[32px]" />
              <div>
                <h4 className="text-gray-5 font-bold text-lg lg:text-xl">Ingeniería de Software</h4>
                <p className="text-gray-4">Instituto San Ignacio de Loyola</p>
                <p className="text-gray-4">2021 - Pausado</p>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-right" delay={300}>
            <div className="flex items-center gap-4">
              <Icon icon="fluent:certificate-16-filled" className="text-primary text-[32px]" />
              <div>
                <h4 className="text-gray-5 font-bold text-lg lg:text-xl">Java</h4>
                <p className="text-gray-4">Cibertec</p>
                <p className="text-gray-4">2020 - 2021</p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Habilidades Técnicas */}
        <div>
          <AnimateOnScroll delay={200}>
            <h3 className="text-xl lg:text-[32px] text-primary font-medium mb-8">Habilidades Técnicas</h3>
          </AnimateOnScroll>
          <AnimateOnScroll delay={300}>
            <CarouselSkills />
          </AnimateOnScroll>
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

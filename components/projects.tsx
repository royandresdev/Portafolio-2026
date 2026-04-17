import { ProjectCard } from "./project-card"

const mockupProjects = [
  {
    id: "1",
    created_at: new Date(),
    name: "Project 1",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    image: "https://www.google.com/imgres?q=aplicacion%20web&imgurl=https%3A%2F%2Fwww.ingeniovirtual.com%2Fwp-content%2Fuploads%2Fque-es-una-aplicacion-web.jpg&imgrefurl=https%3A%2F%2Fwww.ingeniovirtual.com%2Fque-es-una-aplicacion-web-y-cuales-son-sus-ventajas%2F&docid=3-UagfJPfa5LhM&tbnid=sA5qw2Ixd8jONM&vet=12ahUKEwix8o2c6POTAxXXqJUCHa89L08QnPAOegQIJRAB..i&w=800&h=500&hcb=2&ved=2ahUKEwix8o2c6POTAxXXqJUCHa89L08QnPAOegQIJRAB",
    technologies: ["React", "Tailwind", "TypeScript"],
    linkDemo: "https://example.com",
    linkRepo: "https://example.com",
    linkFigma: "https://example.com",
  },
  {
    id: "2",
    created_at: new Date(),
    name: "Project 2",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    image: "https://www.google.com/imgres?q=aplicacion%20web&imgurl=https%3A%2F%2Fevotic.es%2Fwp-content%2Fuploads%2F2021%2F05%2FAplicacion-Web.png&imgrefurl=https%3A%2F%2Fevotic.es%2Fsoftware-a-medida%2Fventajas-y-posibilidades-de-las-web-apps-frente-a-los-software-de-tipo-cliente-servidor%2F&docid=W90Tu5PWkgpIuM&tbnid=Z3-7L12CvYk9WM&vet=12ahUKEwix8o2c6POTAxXXqJUCHa89L08QnPAOegQIHRAB..i&w=940&h=475&hcb=2&ved=2ahUKEwix8o2c6POTAxXXqJUCHa89L08QnPAOegQIHRAB",
    technologies: ["React", "Tailwind", "TypeScript"],
    linkDemo: "https://example.com",
    linkRepo: "https://example.com",
    linkFigma: "https://example.com",
  },
  {
    id: "3",
    created_at: new Date(),
    name: "Project 3",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    image: "https://www.google.com/imgres?q=aplicacion%20web&imgurl=https%3A%2F%2Fwww.zervizgroup.com%2Fwp-content%2Fuploads%2F2021%2F09%2Fomni-channel-technology-of-online-retail-business-1-scaled-1.jpg&imgrefurl=https%3A%2F%2Fwww.zervizgroup.com%2Fcaracteristicas-del-desarrollo-de-aplicaciones-web%2F&docid=yp2A7nN8s66LoM&tbnid=DPRMRMEWH_efUM&vet=12ahUKEwix8o2c6POTAxXXqJUCHa89L08QnPAOegQIIhAB..i&w=2560&h=1626&hcb=2&ved=2ahUKEwix8o2c6POTAxXXqJUCHa89L08QnPAOegQIIhAB",
    technologies: ["React", "Tailwind", "TypeScript"],
    linkDemo: "https://example.com",
    linkRepo: "https://example.com",
    linkFigma: "https://example.com",
  },
]

export function Projects() {
  return (
    <section className="container mx-auto">
      <span className="label-heading mb-3">-MIS PROYECTOS</span>
      <h2 className="text-5xl font-bold text-primary mb-3">PROYECTOS RECIENTES</h2>
      <p className="text-gray-4">En esta sección puedes ver algunos de los proyectos que he realizado o en los que estoy trabajando actualmente.</p>
      <div className="grid grid-cols-3 gap-8 py-8">
        {
          mockupProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))
        }
      </div>
    </section>
  )
}

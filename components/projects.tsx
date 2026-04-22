import { createClient } from "@/lib/supabase/server"
import { ProjectCard } from "./project-card"
import { AnimateOnScroll } from "./animate-on-scroll"

export async function Projects() {
  // Retraso artificial para probar el skeleton
  console.log("Iniciando carga de proyectos (3s delay)...")
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const supabase = await createClient()
  const { data: projects, error } = await supabase.from('Projects').select('*')

  if (error) {
    console.error('Error fetching projects:', error)
  }

  console.log('Proyectos desde Supabase:', projects)

  return (
    <section id="projects" className="container mx-auto max-w-[1280px] px-6">
      <AnimateOnScroll>
        <span className="caption mb-3">-MIS PROYECTOS</span>
      </AnimateOnScroll>
      <AnimateOnScroll delay={100}>
        <h2 className="font-bold text-primary mb-3">PROYECTOS RECIENTES</h2>
      </AnimateOnScroll>
      <AnimateOnScroll delay={200}>
        <p className="text-gray-4">En esta sección puedes ver algunos de los proyectos que he realizado o en los que estoy trabajando actualmente.</p>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
        {
          projects && projects.length > 0 ? (
            projects.map((project, index) => (
              <AnimateOnScroll key={project.id} delay={index * 100} className="h-full">
                <ProjectCard {...project} />
              </AnimateOnScroll>
            ))
          ) : (
            <p className="text-gray-4 col-span-full text-center py-10">No se encontraron proyectos.</p>
          )
        }
      </div>
    </section>
  )
}


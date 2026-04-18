import { createClient } from "@/lib/supabase/server"
import { ProjectCard } from "./project-card"

export async function Projects() {
  const supabase = await createClient()
  const { data: projects, error } = await supabase.from('Projects').select('*')

  if (error) {
    console.error('Error fetching projects:', error)
  }

  // Descomentar esto para ver la data real en la terminal una vez conectado
  console.log('Proyectos desde Supabase:', projects)

  return (
    <section className="container mx-auto max-w-[1280px] px-6">
      <span className="caption mb-3">-MIS PROYECTOS</span>
      <h2 className="font-bold text-primary mb-3">PROYECTOS RECIENTES</h2>
      <p className="text-gray-4">En esta sección puedes ver algunos de los proyectos que he realizado o en los que estoy trabajando actualmente.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
        {
          projects && projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))
          ) : (
            <p className="text-gray-4 col-span-full text-center py-10">No se encontraron proyectos.</p>
          )
        }
      </div>
    </section>
  )
}

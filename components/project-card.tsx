interface ProjectCardProps {
  id: string;
  created_at: Date;
  name: string;
  description: string;
  image: string;
  technologies: string[];
  linkDemo: string;
  linkRepo: string;
  linkFigma?: string;
}

export function ProjectCard({ name, description, image, technologies, linkDemo, linkRepo, linkFigma }: ProjectCardProps) {
  return (
    <article className="w-full bg-black-3 rounded-[32px] pb-6 shadow-lg">
      <div className="w-full aspect-video">
        {/* <Image src={image} alt={name} width={500} height={200} /> */}
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-gray-5 uppercase font-bold text-2xl">{name}</h3>
        <p className="text-primary font-semibold">Pagina Industrial</p>
        <Tags technologies={technologies} />
        <p className="text-gray-4">{description}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 px-6">
        <button className="py-3 bg-gray-1 border border-gray-2 rounded-md text-gray-5 text-sm font-bold shadow">En vivo</button>
        <button className="py-3 bg-gray-1 border border-gray-2 rounded-md text-gray-5 text-sm font-bold shadow">Repositorio</button>
      </div>
    </article>
  )
}

function Tags({ technologies }: { technologies: string[] }) {
  return (
    <div className="space-x-2">
      {technologies.map((tech) => (
        <span key={tech} className="text-gray-4 px-2 py-1 rounded border border-gray-2 text-[12px]">{tech}</span>
      ))}
    </div>
  )
}

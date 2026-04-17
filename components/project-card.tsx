import Image from "next/image";

interface ProjectCardProps {
  id: number | string;
  created_at: string | Date;
  name: string;
  description: string;
  image: string;
  technologies: string[];
  linkDemo: string;
  linkRepo: string;
  linkFigma?: string;
}

export function ProjectCard({ name, description, image, technologies, linkDemo, linkRepo }: ProjectCardProps) {
  return (
    <article className="w-full h-full bg-black-3 rounded-[32px] pb-6 shadow-lg flex flex-col">
      <div className="w-full aspect-video relative overflow-hidden rounded-t-[32px]">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-gray-5 uppercase font-bold text-2xl">{name}</h3>
        <p className="text-primary font-semibold">Pagina Industrial</p>
        <Tags technologies={technologies} />
        <p className="text-gray-4">{description}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 px-6 mt-auto">
        <a
          href={linkDemo}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 bg-gray-1 border border-gray-2 rounded-md text-gray-5 text-sm font-bold shadow text-center hover:bg-gray-2 transition-colors"
        >
          En vivo
        </a>
        <a
          href={linkRepo}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 bg-gray-1 border border-gray-2 rounded-md text-gray-5 text-sm font-bold shadow text-center hover:bg-gray-2 transition-colors"
        >
          Repositorio
        </a>
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

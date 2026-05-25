import { Icon } from "@iconify/react";
import { ProjectImageGallery } from "./project-image-gallery";

interface ProjectCardProps {
  id: number | string;
  created_at: string | Date;
  name: string;
  description: string;
  image: string;
  gallery_images?: string[];
  technologies: string[];
  linkDemo: string;
  linkRepo: string;
  linkFigma?: string;
  typeApp: string;
}

export function ProjectCard({ name, description, image, gallery_images, technologies, linkDemo, linkRepo, typeApp }: ProjectCardProps) {
  return (
    <article className="w-full h-full bg-black-3 rounded-4xl pb-6 custom-shadow flex flex-col border border-black-3">
      <ProjectImageGallery name={name} coverImage={image} galleryImages={gallery_images} />
      <div className="p-6 space-y-4">
        <h3 className="text-gray-5 uppercase font-bold text-xl lg:text-2xl">{name}</h3>
        <p className="text-primary font-semibold">{typeApp}</p>
        <Tags technologies={technologies} />
        <p className="text-gray-4">{description}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 px-6 mt-auto">
        <a
          href={linkDemo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ver versión en vivo del proyecto ${name}`}
          className="py-3 bg-gray-1 border border-gray-2 rounded-md text-gray-5 text-sm font-bold custom-shadow text-center hover:bg-gray-2 transition-colors flex items-center justify-center gap-2"
        >
          <Icon icon="bi:easel-fill" fontSize={16} /> En vivo
        </a>
        <a
          href={linkRepo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ver repositorio de código del proyecto ${name}`}
          className="py-3 bg-gray-1 border border-gray-2 rounded-md text-gray-5 text-sm font-bold custom-shadow text-center hover:bg-gray-2 transition-colors flex items-center justify-center gap-2"
        >
          <Icon icon="bi:github" fontSize={16} /> Repositorio
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

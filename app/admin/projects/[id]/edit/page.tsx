import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/project-form";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Obtener detalles del proyecto actual
  const { data: project, error } = await supabase
    .from("Projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    notFound();
  }

  // Mapear los datos de BD al tipado del formulario
  const projectData = {
    id: project.id,
    name: project.name,
    description: project.description,
    image: project.image,
    gallery_images: project.gallery_images || [],
    technologies: project.technologies || [],
    linkDemo: project.linkDemo,
    linkRepo: project.linkRepo,
    linkFigma: project.linkFigma || "",
    typeApp: project.typeApp,
  };

  return (
    <main className="w-full max-w-[1280px] mx-auto px-6 py-12 md:py-16 md:px-12">
      <ProjectForm project={projectData} />
    </main>
  );
}

import { Suspense } from "react";
import { Contact } from "@/components/contact";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";

export default function Home() {
  return (
    <main className="background font-dm-sans">
      <Header />
      <Hero />
      <Suspense fallback={<p className="text-center py-10 text-gray-4">Cargando proyectos...</p>}>
        <Projects />
      </Suspense>
      <Skills />
      <Contact />
      <Footer />
    </main>
  );
}

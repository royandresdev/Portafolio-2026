import { Suspense } from "react";
import { Contact } from "@/components/contact";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { ProjectsSkeleton } from "@/components/projects-skeleton";
import { Skills } from "@/components/skills";

export default function Home() {
  return (
    <main className="background font-dm-sans space-y-24">
      <Header />
      <Hero />
      <Suspense fallback={<ProjectsSkeleton />}>
        <Projects />
      </Suspense>
      <Skills />
      <Contact />
      <Footer />
    </main>
  );
}

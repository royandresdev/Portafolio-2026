import Header from "@/components/header";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";

export default function Home() {
  return (
    <main className="background font-dm-sans">
      <Header />
      <Hero />
      <Projects />
    </main>
  );
}

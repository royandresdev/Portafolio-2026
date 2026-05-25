import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { LoginHeader } from "@/components/login-header";

// Metadatos para evitar que buscadores (como Google o Bing) indexen esta página
export const metadata: Metadata = {
  title: "Acceso de Administrador | RoyAndresDev",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function Page() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center py-16 px-4 background font-dm-sans">
      <div className="w-full max-w-[400px] flex flex-col gap-12 items-center">
        
        {/* Brand Identity Section */}
        <LoginHeader 
          title="RoyAndresDev" 
          subtitle="Panel de configuración del portafolio" 
        />

        {/* LoginForm Card */}
        <LoginForm className="w-full" />
        
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Briefcase, ArrowLeft, LogOut, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const isProjectsActive = pathname === "/admin/projects";

  // Contenido interno del sidebar (se reutiliza en Desktop y Mobile Drawer)
  const sidebarContent = (
    <div className="flex flex-col h-full bg-black-3 text-white">
      {/* Cabecera / Identidad */}
      <div className="px-2 pb-10 flex items-center gap-3">
        {/* Contenedor del Logo (Estilo Figma) */}
        <div className="bg-gray-1 flex items-center justify-center rounded-[4px] size-10 shrink-0 shadow-md">
          <Image
            src="/Logo.svg"
            alt="Logo"
            width={24}
            height={24}
            className="h-6 w-auto"
            priority
          />
        </div>
        {/* Textos del Encabezado */}
        <div className="flex flex-col">
          <span className="font-bold text-primary text-[18px] leading-snug">
            Administrador
          </span>
          <span className="text-gray-4 text-[10px] tracking-[1px] uppercase font-mono leading-none">
            panel de configuración
          </span>
        </div>
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 flex flex-col gap-2">
        <Link
          href="/admin/projects"
          onClick={() => setIsOpen(false)}
          className={`flex items-center gap-4 px-4 py-3 rounded-[4px] transition-all duration-200 ${
            isProjectsActive
              ? "bg-primary/10 border-r-4 border-primary text-primary font-semibold"
              : "text-gray-4 hover:text-primary hover:bg-black-2/30"
          }`}
        >
          <Briefcase className={`size-[18px] ${isProjectsActive ? "text-primary" : "text-gray-4"}`} />
          <span className="text-sm">Proyectos</span>
        </Link>
      </nav>

      {/* Pie de Página / Acciones */}
      <div className="border-t border-gray-2/10 pt-6 flex flex-col gap-2">
        {/* Volver al sitio */}
        <Link
          href="/"
          className="flex items-center gap-4 px-4 py-3 rounded-[4px] text-gray-4 hover:text-primary transition-all duration-200 text-sm"
        >
          <ArrowLeft className="size-[18px] text-gray-4" />
          <span>Volver al sitio</span>
        </Link>

        {/* Cerrar sesión */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-4 px-4 py-3 rounded-[4px] text-gray-4 hover:text-[#eb5757] transition-all duration-200 text-sm w-full text-left cursor-pointer"
        >
          <LogOut className="size-[18px] text-gray-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR (Fijo a la izquierda) ── */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-black-3 border-r border-gray-2/10 py-8 px-4 justify-between shrink-0">
        {sidebarContent}
      </aside>

      {/* ── MOBILE HEADER (Barra superior para pantallas pequeñas) ── */}
      <div className="md:hidden w-full h-16 bg-black-3 border-b border-gray-2/10 px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-gray-1 flex items-center justify-center rounded-[4px] size-8 shadow-sm">
            <Image
              src="/Logo.svg"
              alt="Logo"
              width={18}
              height={18}
              className="h-5 w-auto"
            />
          </div>
          <span className="font-bold text-primary text-base">Admin Panel</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 -mr-2 text-primary focus:outline-none"
          aria-label="Abrir panel de navegación"
        >
          <Menu className="size-6" />
        </button>
      </div>

      {/* ── MOBILE SIDEBAR DRAWER (Panel deslizable) ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop / Fondo oscurecido */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel Deslizable */}
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-black-3 border-r border-gray-2/10 py-8 px-4 transition-transform duration-300 transform translate-x-0 z-50">
            {/* Botón Cerrar Drawer */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-4 hover:text-primary transition-colors focus:outline-none"
              aria-label="Cerrar panel de navegación"
            >
              <X className="size-5" />
            </button>

            {/* Contenido */}
            <div className="h-full mt-4">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

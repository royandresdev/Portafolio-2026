import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Suspense } from "react";

async function AuthBarrier({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen background w-full text-white flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 min-h-screen md:h-screen md:overflow-y-auto">
        <Suspense fallback={<div className="p-8 text-gray-4 text-sm font-mono">Verificando sesión...</div>}>
          <AuthBarrier>{children}</AuthBarrier>
        </Suspense>
      </div>
    </div>
  );
}

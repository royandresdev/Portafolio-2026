import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center py-16 px-4 background font-dm-sans">
      <div className="w-full max-w-[400px] flex flex-col gap-12 items-center">

        {/* Brand Identity Section */}
        <div className="flex flex-col gap-3 items-center w-full select-none">
          <h1 className="text-primary font-extrabold text-2xl tracking-[2px] uppercase">
            RoyAndresDev
          </h1>
          <div className="flex gap-3 items-center justify-center w-full">
            <div className="bg-primary/30 h-px w-8" />
            <span className="text-gray-4 text-[9px] font-bold tracking-[3px] uppercase text-center">
              Panel de configuración del portafolio
            </span>
            <div className="bg-primary/30 h-px w-8" />
          </div>
        </div>

        {/* LoginForm Card */}
        <LoginForm className="w-full" />

      </div>
    </main>
  );
}

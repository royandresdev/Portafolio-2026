interface LoginHeaderProps {
  title: string;
  subtitle: string;
}

export function LoginHeader({ title, subtitle }: LoginHeaderProps) {
  return (
    <div className="flex flex-col gap-3 items-center w-full select-none">
      <h1 className="text-primary font-extrabold text-2xl tracking-[2px] uppercase">
        {title}
      </h1>
      <div className="flex gap-3 items-center justify-center w-full">
        <div className="bg-primary/30 h-px w-8" />
        <span className="text-gray-4 text-[9px] font-bold tracking-[3px] uppercase text-center">
          {subtitle}
        </span>
        <div className="bg-primary/30 h-px w-8" />
      </div>
    </div>
  );
}

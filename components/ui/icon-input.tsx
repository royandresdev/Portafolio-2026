import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  iconName: string;
  error?: string;
  touched?: boolean;
}

export function IconInput({
  label,
  iconName,
  error,
  touched,
  id,
  className,
  ...props
}: IconInputProps) {
  const hasError = touched && error;
  
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={id} className="text-[#b9cbbd] text-[11px] font-bold tracking-[1.1px] uppercase px-1">
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          className={cn(
            "w-full bg-black-2 border rounded-[2px] py-4 pl-12 pr-4 text-sm text-gray-5 placeholder-gray-4/20 focus:outline-none transition-all duration-300",
            hasError
              ? "border-danger/50 focus:border-danger focus:shadow-[0_0_10px_rgba(235,87,87,0.15)]"
              : "border-gray-2/30 focus:border-primary/50 focus:shadow-[0_0_10px_rgba(0,255,153,0.15)]",
            className
          )}
          {...props}
        />
        <Icon
          icon={iconName}
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 text-gray-4/40 pointer-events-none transition-colors",
            iconName === "bi:lock-fill" ? "w-4 h-4" : "w-5 h-5",
            hasError && "text-danger/40"
          )}
        />
      </div>
      {hasError && (
        <span className="text-xs text-danger px-1 mt-0.5">{error}</span>
      )}
    </div>
  );
}

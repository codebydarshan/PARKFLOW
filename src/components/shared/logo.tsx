import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  href?: string;
}

export function Logo({
  className,
  showWordmark = true,
  href = "/",
}: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-90",
        className
      )}
      aria-label="ParkFlow home"
    >
      <span className="relative flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/25">
        <svg
          viewBox="0 0 24 24"
          className="size-4.5"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 16.5V8.8c0-.7.4-1.3 1-1.6l5.2-2.8c.5-.3 1.1-.3 1.6 0l5.2 2.8c.6.3 1 .9 1 1.6v7.7c0 .7-.4 1.3-1 1.6l-5.2 2.8c-.5.3-1.1.3-1.6 0L6 18.1c-.6-.3-1-.9-1-1.6Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M9 12.5h6M12 9.5v6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {showWordmark ? (
        <span className="text-[15px] font-semibold tracking-tight">
          ParkFlow
        </span>
      ) : null}
    </Link>
  );
}

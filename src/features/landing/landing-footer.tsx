"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const footerLinks = [
  { href: "#problem", label: "Problem" },
  { href: "#solution", label: "Solution" },
  { href: "#features", label: "Features" },
  { href: "/dashboard", label: "Live Demo" },
  { href: "/login", label: "Sign in" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Eliminate visitor parking confusion with QR passes and intelligent
              slot allocation.
            </p>
          </div>
          <nav
            className="flex flex-wrap gap-x-5 gap-y-2"
            aria-label="Footer"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 ParkFlow. All rights reserved.</span>
          <span>MVP · demo only · mock data</span>
        </div>
      </div>
    </footer>
  );
}

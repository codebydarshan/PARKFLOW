"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { glass } from "@/lib/glass";
import { cn } from "@/lib/utils";

const demoRoles = [
  { label: "Resident", href: "/resident", email: "darshan@riverside.demo" },
  { label: "Security", href: "/security", email: "marcus.webb@riverside.demo" },
  { label: "Admin", href: "/admin", email: "priya.nair@riverside.demo" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("darshan@riverside.demo");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const matched = demoRoles.find(
      (role) => role.email.toLowerCase() === email.trim().toLowerCase()
    );

    window.setTimeout(() => {
      router.push(matched?.href ?? "/dashboard");
    }, 500);
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.55_0.16_255_/_0.14),_transparent_50%)]"
        aria-hidden="true"
      />

      <header className="relative z-10 flex items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className={cn("rounded-2xl p-6 sm:p-8", glass.panelStrong)}>
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to ParkFlow
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Demo authentication only—no backend. Pick a role or continue with
              any email.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@community.demo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  defaultValue="demo-password"
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Quick enter
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {demoRoles.map((role) => (
                  <Link
                    key={role.label}
                    href={role.href}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "justify-center"
                    )}
                  >
                    {role.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Prefer the overview?{" "}
            <Link href="/dashboard" className="text-primary hover:underline">
              Open dashboard
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}

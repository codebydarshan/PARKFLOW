"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatRelativeTime } from "@/lib/format";
import { glass } from "@/lib/glass";
import { cn } from "@/lib/utils";
import type { TwinActivityItem, TwinActivityType } from "@/types";

interface TwinActivityFeedProps {
  items: TwinActivityItem[];
}

const typeTone: Record<TwinActivityType, string> = {
  occupied: "bg-primary",
  released: "bg-success",
  entered: "bg-primary",
  exited: "bg-success",
  reserved: "bg-warning",
  expired: "bg-warning",
};

export function TwinActivityFeed({ items }: TwinActivityFeedProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "smooth" });
  }, [items[0]?.id]);

  return (
    <section className={cn("rounded-2xl p-4 sm:p-5", glass.panel)}>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">
            Live Activity
          </h2>
          <p className="text-xs text-muted-foreground">
            Newest first · auto-updating twin stream
          </p>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item) => (
            <motion.article
              key={item.id}
              layout
              initial={{ opacity: 0, x: -16, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28 }}
              className="min-w-[15rem] shrink-0 rounded-xl border border-border/40 bg-background/40 px-3.5 py-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    typeTone[item.type]
                  )}
                />
                <p className="truncate text-sm font-medium">{item.title}</p>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {item.description}
              </p>
              <p className="mt-2 text-[10px] text-muted-foreground">
                {formatRelativeTime(item.timestamp)}
              </p>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

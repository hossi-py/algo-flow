import type { ReactNode } from "react";
import { Nodi } from "@/components/mascot/nodi";
import { cn } from "@/lib/utils";
import type { MascotMood } from "@/types";

interface EmptyStateProps {
  mood?: MascotMood;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ mood = "sleepy", title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 px-6 py-10 text-center", className)}>
      <Nodi mood={mood} size={112} decorative />
      <p className="text-h3 text-foreground">{title}</p>
      {description && <p className="max-w-sm text-small text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

interface SoftCardProps extends React.ComponentProps<"div"> {
  /** 링크/버튼처럼 눌리는 카드 */
  interactive?: boolean;
  asChild?: boolean;
}

export function SoftCard({ className, interactive = false, asChild = false, ...props }: SoftCardProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="soft-card"
      className={cn(
        "block rounded-lg border border-border/70 bg-card p-5 text-card-foreground shadow-soft sm:p-6",
        interactive &&
          "transition-[transform,box-shadow] duration-200 outline-none hover:-translate-y-0.5 hover:shadow-float focus-visible:ring-4 focus-visible:ring-ring/40 active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
      {...props}
    />
  );
}

export function SectionTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-h3 text-foreground", className)} {...props} />;
}

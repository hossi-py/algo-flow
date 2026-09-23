import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

/**
 * 말랑하게 눌리는 버튼. 파스텔 면 + 짙은 글자 + 아래 3px "입술" 그림자.
 * 누르면 2px 내려가며 그림자가 줄어든다.
 */
export const popButtonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 font-semibold whitespace-nowrap select-none",
    "outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
    "transition-[transform,box-shadow,background-color,color] duration-150 ease-out",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.15em]",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-primary text-primary-foreground shadow-pop",
          "hover:-translate-y-px hover:shadow-[0_4px_0_0_var(--primary-edge)]",
          "active:translate-y-[2px] active:shadow-[0_1px_0_0_var(--primary-edge)]",
        ],
        secondary: [
          "bg-secondary text-secondary-foreground shadow-pop-secondary",
          "hover:-translate-y-px hover:shadow-[0_4px_0_0_var(--secondary-edge)]",
          "active:translate-y-[2px] active:shadow-[0_1px_0_0_var(--secondary-edge)]",
        ],
        soft: [
          "bg-primary-soft text-primary-soft-foreground",
          "hover:bg-[color-mix(in_oklab,var(--primary-soft),var(--primary)_35%)] active:translate-y-px",
        ],
        outline: ["border border-border bg-card text-foreground shadow-soft", "hover:bg-muted active:translate-y-px"],
        ghost: ["text-foreground hover:bg-muted active:translate-y-px"],
      },
      size: {
        sm: "h-9 rounded-sm px-3.5 text-small",
        md: "h-11 rounded-md px-5 text-body",
        lg: "h-13 rounded-md px-6 text-h3",
        icon: "size-11 rounded-full",
        "icon-sm": "size-9 rounded-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface PopButtonProps extends React.ComponentProps<"button">, VariantProps<typeof popButtonVariants> {
  asChild?: boolean;
}

export function PopButton({ className, variant, size, asChild = false, ...props }: PopButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp data-slot="pop-button" className={cn(popButtonVariants({ variant, size }), className)} {...props} />;
}

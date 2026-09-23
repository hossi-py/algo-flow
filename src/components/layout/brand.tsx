import Link from "next/link";
import { Nodi } from "@/components/mascot/nodi";
import { cn } from "@/lib/utils";

export function Brand({
  compact = false,
  wordmarkClassName,
  className,
}: {
  compact?: boolean;
  /** 좁은 화면에서 글자를 숨길 때 사용 */
  wordmarkClassName?: string;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 rounded-md outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
        className,
      )}
      aria-label="algo-flow 홈"
    >
      <Nodi size={40} decorative />
      {!compact && (
        <span
          className={cn("text-h3 font-extrabold tracking-tight whitespace-nowrap text-foreground", wordmarkClassName)}
        >
          algo<span className="text-primary-strong">-flow</span>
        </span>
      )}
    </Link>
  );
}

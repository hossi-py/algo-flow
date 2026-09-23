"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMounted } from "@/hooks/use-mounted";
import { PopButton } from "./pop-button";

const OPTIONS = [
  { value: "light", label: "라이트", icon: Sun },
  { value: "dark", label: "다크", icon: Moon },
  { value: "system", label: "시스템 설정", icon: Monitor },
] as const;

export function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const CurrentIcon = mounted && resolvedTheme === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PopButton
          variant="ghost"
          size={withLabel ? "sm" : "icon-sm"}
          aria-label="화면 테마 바꾸기"
          className={withLabel ? "w-full justify-start" : undefined}
        >
          <CurrentIcon />
          {withLabel && <span>테마</span>}
        </PopButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40 rounded-md">
        <DropdownMenuLabel className="text-caption text-muted-foreground">화면 테마</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={mounted ? (theme ?? "light") : "light"} onValueChange={setTheme}>
          {OPTIONS.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value} className="gap-2 rounded-sm text-small">
              <Icon className="size-4" aria-hidden />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { House, Map as MapIcon, Sparkles, Trophy, UserRound, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** 현재 경로가 이 메뉴에 속하는지 */
  match: (pathname: string) => boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "홈", icon: House, match: (p) => p === "/" },
  {
    href: "/roadmap",
    label: "로드맵",
    icon: MapIcon,
    match: (p) => p.startsWith("/roadmap") || p.startsWith("/topics"),
  },
  { href: "/ai-lab", label: "AI 랩", icon: Sparkles, match: (p) => p.startsWith("/ai-lab") },
  { href: "/ranking", label: "랭킹", icon: Trophy, match: (p) => p.startsWith("/ranking") },
  { href: "/me", label: "마이", icon: UserRound, match: (p) => p.startsWith("/me") },
];

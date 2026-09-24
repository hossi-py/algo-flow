import type { ReactNode } from "react";
import { SyncNotice } from "@/components/auth/user-menu";
import { BottomTabBar } from "./bottom-tab-bar";
import { DevToolbar } from "./dev-toolbar";
import { SideNav } from "./side-nav";
import { TopBar } from "./top-bar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh md:flex">
      <SideNav className="hidden md:flex" />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 pt-4 pb-32 sm:px-6 md:pb-16 lg:px-8">
          <SyncNotice />
          {children}
        </main>
      </div>
      <BottomTabBar className="md:hidden" />
      {process.env.NODE_ENV === "development" && <DevToolbar />}
    </div>
  );
}

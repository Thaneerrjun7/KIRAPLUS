import type { ReactNode } from "react";
import { AppNav } from "@/components/AppNav";
import { SyntheticDataNotice } from "@/components/SyntheticDataNotice";

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppNav />
      {/* pb-20 clears the fixed mobile bottom nav (AppNav) so it never covers page content or
          the synthetic-data footer; not needed on desktop, where AppNav is a normal top bar. */}
      <div className="pb-20 md:pb-0">
        {children}
        <SyntheticDataNotice />
      </div>
    </>
  );
}

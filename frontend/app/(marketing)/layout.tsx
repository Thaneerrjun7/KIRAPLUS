import type { ReactNode } from "react";
import { MarketingNav } from "@/components/MarketingNav";
import { SyntheticDataNotice } from "@/components/SyntheticDataNotice";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingNav />
      {children}
      <SyntheticDataNotice />
    </>
  );
}

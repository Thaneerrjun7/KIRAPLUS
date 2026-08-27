import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import { Nav } from "@/components/Nav";
import { SyntheticDataNotice } from "@/components/SyntheticDataNotice";

// Brand system typography, see frontend/docs/design.md ("Brand system"):
// display headings, serif body copy, mono for every ringgit figure.
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = Source_Serif_4({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "KIRA+",
  description: "Kira Dulu. Baru Commit.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-paper font-body text-navy">
        <Nav />
        {children}
        <SyntheticDataNotice />
      </body>
    </html>
  );
}

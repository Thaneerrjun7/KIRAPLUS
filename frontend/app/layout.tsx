import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { SplashScreen } from "@/components/SplashScreen";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "KIRA+",
  description: "Kira Dulu. Baru Commit.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-surface font-body text-navy">
        <SplashScreen>{children}</SplashScreen>
      </body>
    </html>
  );
}

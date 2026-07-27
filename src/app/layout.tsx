import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Maruf — Surveillance Camera Installation",
    template: "%s — Maruf",
  },
  description:
    "Maruf designs and installs professional surveillance and CCTV systems for homes and businesses — with 24/7 monitoring, expert installation, and ongoing support.",
  keywords: [
    "CCTV installation",
    "surveillance cameras",
    "security cameras",
    "home security",
    "business security",
    "24/7 monitoring",
  ],
};

import { LayoutShell } from "@/components/layout-shell";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = (await cookies()).get("theme")?.value === "light" ? "light" : "dark";

  return (
    <html
      lang="en"
      data-theme={theme}
      className={`${manrope.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}

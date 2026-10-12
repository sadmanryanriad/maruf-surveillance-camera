import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import { LayoutShell } from "@/components/layout-shell";
import "./globals.css";

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
    default: "Maruf — Family Home Security & CCTV Installation | Worthing & West Sussex",
    template: "%s — Maruf",
  },
  description:
    "Security you control and we support. Professional family home CCTV & WiFi smart surveillance installations across Worthing and West Sussex. High-definition optics, zero monthly fees, and friendly local service.",
  keywords: [
    "CCTV installation Worthing",
    "West Sussex security cameras",
    "home CCTV installation",
    "Reolink smart cameras",
    "garden pet security cameras",
    "residential CCTV Sussex",
    "smart video doorbell",
    "local CCTV installer",
  ],
};

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

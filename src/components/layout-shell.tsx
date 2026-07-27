"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FloatingWhatsAppButton } from "@/components/floating-whatsapp";
import { Toaster } from "sonner";

export function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminOrDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/admin");

  if (isAdminOrDashboard) {
    return (
      <>
        <Toaster position="top-right" richColors />
        {children}
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <FloatingWhatsAppButton />
      <SiteFooter />
    </>
  );
}

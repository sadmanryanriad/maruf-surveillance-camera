import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";

export function ApertureMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <Logo className={className} />
  );
}

export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2 text-foreground"
      aria-label={`${site.name} home`}
    >
      {/* Light theme logo (blue text) */}
      <Image
        src="/logo-light.svg"
        alt="Maruf Silhouette Security Solutions"
        width={240}
        height={67}
        priority
        className={`dark:hidden block object-contain ${className}`}
      />
      {/* Dark theme logo (white text) */}
      <Image
        src="/logo-dark.svg"
        alt="Maruf Silhouette Security Solutions"
        width={240}
        height={67}
        priority
        className={`hidden dark:block object-contain ${className}`}
      />
    </Link>
  );
}

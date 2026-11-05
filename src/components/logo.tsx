import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";

export function ApertureMark({ className = "h-12 sm:h-14 md:h-16 w-auto" }: { className?: string }) {
  return (
    <Logo className={className} />
  );
}

export function Logo({ className = "h-12 sm:h-14 md:h-16 w-auto" }: { className?: string }) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center text-foreground"
      aria-label={`${site.name} home`}
    >
      {/* Light theme logo (for light background) */}
      <Image
        src="/logo-light.svg"
        alt="Silhouette Security Solutions"
        width={320}
        height={90}
        priority
        className={`logo-light object-contain ${className}`}
      />
      {/* Dark theme logo (for dark background) */}
      <Image
        src="/logo-dark.svg"
        alt="Silhouette Security Solutions"
        width={320}
        height={90}
        priority
        className={`logo-dark object-contain ${className}`}
      />
    </Link>
  );
}

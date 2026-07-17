import type { Social } from "@/lib/site";

const paths: Record<Social["icon"], React.ReactNode> = {
  facebook: (
    <path
      d="M14 8h2V5h-2c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2l1-3h-3V8c0-.6.4-1 1-1Z"
      fill="currentColor"
    />
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.7" fill="none" />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.7" fill="none" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" />
    </>
  ),
  x: (
    <path
      d="M18 3h3l-7 8 8 10h-6l-5-6-5 6H2l8-9L2 3h6l4 5 6-5Z"
      fill="currentColor"
    />
  ),
  linkedin: (
    <path
      d="M5 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3.5 9.5h3V20h-3V9.5ZM9 9.5h2.9v1.4c.5-.8 1.6-1.7 3.4-1.7 3 0 3.7 1.9 3.7 4.6V20h-3v-5.3c0-1.3-.4-2.1-1.6-2.1-1 0-1.5.7-1.7 1.3-.1.2-.1.6-.1.9V20H9V9.5Z"
      fill="currentColor"
    />
  ),
};

export function SocialIcon({ icon }: { icon: Social["icon"] }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
      {paths[icon]}
    </svg>
  );
}

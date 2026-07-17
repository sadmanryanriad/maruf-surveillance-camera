type Props = { id: string; className?: string };

/** Line icons for each service, matched to the surveillance world. */
export function ServiceIcon({ id, className }: Props) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (id) {
    case "installation": // bullet camera
      return (
        <svg {...common}>
          <rect x="3" y="8" width="12" height="6" rx="3" />
          <circle cx="6.5" cy="11" r="1.3" />
          <path d="M15 11h3l3-2v6l-3-2h-3" />
          <path d="M8 14v3H6" />
        </svg>
      );
    case "monitoring": // eye / live view
      return (
        <svg {...common}>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
          <circle cx="12" cy="12" r="2.6" />
        </svg>
      );
    case "maintenance": // wrench
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8 7.2 20l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.3-.6-.6-2.3 2.4-2.6Z" />
        </svg>
      );
    case "smart": // network nodes
      return (
        <svg {...common}>
          <circle cx="12" cy="5" r="2" />
          <circle cx="5" cy="18" r="2" />
          <circle cx="19" cy="18" r="2" />
          <path d="M12 7v4M12 11l-5.5 5M12 11l5.5 5" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

import type { ComponentProps, ReactNode } from "react";

const fieldBase =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_28%,transparent)]";

function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted"
    >
      {children}
    </label>
  );
}

export function Field({
  label,
  id,
  className = "",
  ...props
}: { label: string } & ComponentProps<"input">) {
  return (
    <div className={className}>
      <Label htmlFor={id!}>{label}</Label>
      <input id={id} className={fieldBase} {...props} />
    </div>
  );
}

export function TextArea({
  label,
  id,
  className = "",
  ...props
}: { label: string } & ComponentProps<"textarea">) {
  return (
    <div className={className}>
      <Label htmlFor={id!}>{label}</Label>
      <textarea id={id} className={`${fieldBase} resize-y`} {...props} />
    </div>
  );
}

export function SelectField({
  label,
  id,
  className = "",
  children,
  ...props
}: { label: string } & ComponentProps<"select">) {
  return (
    <div className={className}>
      <Label htmlFor={id!}>{label}</Label>
      <select id={id} className={`${fieldBase} appearance-none`} {...props}>
        {children}
      </select>
    </div>
  );
}

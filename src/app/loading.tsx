export default function GlobalLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 px-4">
      {/* Simple, clean, ultra-optimized spinner */}
      <div className="h-9 w-9 rounded-full border-2 border-line border-t-primary animate-spin" />
      <span className="text-xs font-semibold text-muted">Loading…</span>
    </div>
  );
}

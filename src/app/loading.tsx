export default function GlobalLoading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-4 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/40 bg-surface-2 shadow-lg animate-pulse">
        <span className="font-display font-black text-primary text-xl">M</span>
      </div>
      <div className="h-2 w-32 rounded-full bg-surface-2 animate-pulse" />
      <span className="text-xs font-bold uppercase tracking-widest text-muted">
        Loading Maruf Systems…
      </span>
    </div>
  );
}

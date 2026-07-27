export default function GlobalLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 px-4">
      {/* High-end surveillance HUD aperture scanner */}
      <div className="relative flex items-center justify-center">
        {/* Outer expanding ping ring */}
        <div className="absolute h-16 w-16 rounded-full border border-primary/30 animate-ping" />
        
        {/* Outer dashed radar ring */}
        <div className="h-16 w-16 rounded-full border border-dashed border-line animate-[spin_8s_linear_infinite]" />

        {/* Inner spinning active aperture reticle */}
        <div className="absolute h-12 w-12 rounded-full border-2 border-transparent border-t-primary border-r-primary animate-spin" />

        {/* Center active lens dot */}
        <div className="absolute h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
      </div>

      {/* Surveillance HUD Text */}
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-muted">
          INITIALIZING CONSOLE…
        </span>
      </div>
    </div>
  );
}

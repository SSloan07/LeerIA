export function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute left-[-10rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute bottom-[-12rem] right-[10rem] h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-[-10rem] top-[8rem] h-[26rem] w-[26rem] rounded-full bg-violet-500/10 blur-3xl" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.055),transparent_32rem)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_18rem)]" />
    </div>
  );
}
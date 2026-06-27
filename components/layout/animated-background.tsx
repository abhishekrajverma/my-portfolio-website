export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-background" />
      <div className="animated-bg-orb animated-bg-orb-primary" />
      <div className="animated-bg-orb animated-bg-orb-secondary" />
      <div className="animated-bg-orb animated-bg-orb-accent" />
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}

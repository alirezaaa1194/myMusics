function SpinnerComp({ className, variant }: { className?: string; variant: "primary" | "dark" | "light" }) {
  return <div className={`${className} shrink-0 rounded-full border-2 animate-spin ${variant === "primary" ? "border-accent border-b-accent/10" : variant === "dark" ? "border-surface border-b-surface/10" : "border-white border-b-white/10"}`} />;
}

export default SpinnerComp;

"use client";

export function NavButton({ iconSrc, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 px-2 py-2 transition-colors rounded-sm ${
        active ? "text-primary border border-primary" : "text-muted-foreground"
      }`}
    >
      <img src={iconSrc} alt={label} className={`w-9 h-9 rounded-2xl`} />
    </button>
  );
}
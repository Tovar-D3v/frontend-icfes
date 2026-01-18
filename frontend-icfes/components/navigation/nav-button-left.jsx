"use client";

export function NavButtonLeft({ iconSrc, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-6 uppercase font-extrabold px-4 py-2 transition-colors rounded-sm cursor-pointer hover:bg-accent ${
        active ? "text-primary border border-primary bg-primary/10" : "text-foreground"
      }`}
    >
      <img src={iconSrc} alt={label} className="w-8 h-8 rounded-2xl" />
      <h1>{label}</h1>
    </button>
  );
}
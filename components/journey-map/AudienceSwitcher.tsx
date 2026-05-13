"use client"

import { AudienceType } from "@/data/journey-map-seed"

interface AudienceSwitcherProps {
  selected: AudienceType
  onChange: (audience: AudienceType) => void
}

const options: { value: AudienceType; label: string; available: boolean }[] = [
  { value: "owners", label: "Owners", available: true },
  { value: "gc", label: "GC", available: true },
  { value: "sc", label: "SC", available: true },
]

export function AudienceSwitcher({ selected, onChange }: AudienceSwitcherProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-muted/30 p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => opt.available && onChange(opt.value)}
          disabled={!opt.available}
          title={!opt.available ? "Coming soon" : undefined}
          className={`relative px-3 py-1 text-xs font-medium rounded-md transition-all duration-150 ${
            selected === opt.value && opt.available
              ? "bg-background text-foreground shadow-sm"
              : opt.available
              ? "text-muted-foreground hover:text-foreground"
              : "text-muted-foreground/40 cursor-not-allowed"
          }`}
        >
          {opt.label}
          {!opt.available && (
            <span className="ml-1 text-[9px] text-muted-foreground/40">soon</span>
          )}
        </button>
      ))}
    </div>
  )
}

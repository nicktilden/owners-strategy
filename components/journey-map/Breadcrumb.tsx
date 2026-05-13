"use client"

import { AudienceType, Phase, Stage } from "@/data/journey-map-seed"

type Level = 1 | 2 | 3 | 4

interface BreadcrumbProps {
  audience: AudienceType
  phase: Phase | null
  stage: Stage | null
  onSelectLevel: (level: Level) => void
}

const audienceLabel: Record<AudienceType, string> = {
  owners: "Owners",
  gc: "General Contractors",
  sc: "Subcontractors",
}

export function Breadcrumb({ audience, phase, stage, onSelectLevel }: BreadcrumbProps) {
  const segments: { label: string; level: Level }[] = [
    { label: audienceLabel[audience], level: 2 },
  ]

  if (phase) {
    segments.push({ label: phase.label, level: 2 })
  }

  if (stage) {
    segments.push({ label: stage.label, level: 3 })
  }

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      <button
        onClick={() => onSelectLevel(1)}
        className="text-muted-foreground hover:text-foreground transition-colors text-xs"
      >
        Journey Map
      </button>
      {segments.map((seg, i) => (
        <span key={seg.label} className="flex items-center gap-1.5">
          <span className="text-border">/</span>
          {i === segments.length - 1 ? (
            <span className="text-foreground text-xs font-medium">{seg.label}</span>
          ) : (
            <button
              onClick={() => onSelectLevel(seg.level)}
              className="text-muted-foreground hover:text-foreground transition-colors text-xs"
            >
              {seg.label}
            </button>
          )}
        </span>
      ))}
    </nav>
  )
}

"use client"

import { AudienceType } from "@/data/journey-map-seed"

interface AudienceLensProps {
  onSelect: (audience: AudienceType) => void
}

const cards: {
  audience: AudienceType
  label: string
  description: string
  available: boolean
  icon: string
}[] = [
  {
    audience: "owners",
    label: "Owners",
    description:
      "End-to-end journey from site investigation through project handover. Explore lifecycle phases, stages, and decision points.",
    available: true,
    icon: "🏗",
  },
  {
    audience: "gc",
    label: "General Contractors",
    description:
      "GC perspective across preconstruction, construction execution, and closeout — from bid pursuit through final payment.",
    available: true,
    icon: "🔧",
  },
  {
    audience: "sc",
    label: "Subcontractors",
    description:
      "Specialty trade journey from bid invitation through final payment and warranty activation.",
    available: true,
    icon: "⚙️",
  },
]

export function AudienceLens({ onSelect }: AudienceLensProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
        Select an audience
      </p>
      <div className="flex flex-col gap-4 max-w-3xl w-full">
        {cards.map((card) => {
          const inner = (
            <div
              className={`group relative rounded-lg border p-6 transition-colors h-full flex flex-col gap-3 ${
                card.available
                  ? "border-border/40 hover:border-border hover:bg-muted/40 cursor-pointer"
                  : "border-border/40 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{card.icon}</span>
                  <h2 className="text-base font-medium text-foreground">{card.label}</h2>
                </div>
                {!card.available && (
                  <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground border border-border/60 rounded px-1.5 py-0.5">
                    Soon
                  </span>
                )}
                {card.available && (
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    →
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </div>
          )

          if (!card.available) {
            return <div key={card.audience}>{inner}</div>
          }

          return (
            <button
              key={card.audience}
              onClick={() => onSelect(card.audience)}
              className="text-left"
            >
              {inner}
            </button>
          )
        })}
      </div>
    </div>
  )
}

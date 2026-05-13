"use client"

import { AudienceType, Phase, phases as allPhases, phaseColors } from "@/data/journey-map-seed"

interface LifecyclePhasesProps {
  audience: AudienceType
  onSelectStage: (phaseId: string, stageId: string) => void
}

// First stage of each phase — used for phase-level click navigation
const phaseDefaultStage: Record<string, string> = {
  plan:    "investigate",
  build:   "construction",
  operate: "closeout",
}


export function LifecyclePhases({ audience, onSelectStage }: LifecyclePhasesProps) {
  const relevantPhases = allPhases.filter((p) => p.audienceType === audience)

  return (
    <div className="w-full">
      <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-5">
        Select a phase &amp; stage
      </p>

      {/* Table-style column layout */}
      <div className="grid w-full" style={{ gridTemplateColumns: `repeat(${relevantPhases.length}, 1fr)` }}>

        {/* Phase header row */}
        {relevantPhases.map((phase, i) => {
          const color = phaseColors[phase.id] ?? "#64748B"
          const isLast = i === relevantPhases.length - 1
          const defaultStage = phaseDefaultStage[phase.id] ?? phase.stages[0]?.id
          return (
            <button
              key={phase.id}
              onClick={() => onSelectStage(phase.id, defaultStage)}
              className={`group px-6 py-4 flex items-center gap-2.5 border-t border-b border-l border-border/40 transition-colors text-left ${isLast ? "border-r" : ""}`}
              style={{
                borderTop: `2px solid ${color}`,
                background: `${color}12`,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = `${color}22`)}
              onMouseLeave={e => (e.currentTarget.style.background = `${color}12`)}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <h2 className="text-base font-semibold text-foreground group-hover:text-foreground transition-colors">
                {phase.label}
              </h2>
              <span className="text-xs text-muted-foreground">
                {phase.stages.length} {phase.stages.length === 1 ? "stage" : "stages"}
              </span>
              <span className="ml-auto text-muted-foreground group-hover:text-foreground transition-colors text-sm">→</span>
            </button>
          )
        })}

        {/* Stages row */}
        {relevantPhases.map((phase, i) => {
          const color = phaseColors[phase.id] ?? "#64748B"
          const isLast = i === relevantPhases.length - 1
          return (
            <div
              key={`stages-${phase.id}`}
              className={`px-5 py-5 border-b border-l border-border/40 ${isLast ? "border-r" : ""}`}
            >
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-3">
                Stages
              </p>
              <div className="flex flex-col gap-2">
                {phase.stages.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => onSelectStage(phase.id, stage.id)}
                    className="group flex flex-col gap-1 rounded-md border border-border/40 bg-muted/20 px-3 py-2.5 text-left transition-colors hover:border-border hover:bg-muted/50 cursor-pointer w-full"
                  >
                    <span
                      className="text-sm font-medium transition-colors group-hover:text-foreground"
                      style={{ color }}
                    >
                      {stage.label}
                    </span>
                    <span className="text-xs text-muted-foreground leading-snug">
                      {stage.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}

        {/* Stakeholders row */}
        {relevantPhases.map((phase, i) => {
          const isLast = i === relevantPhases.length - 1
          return (
            <div
              key={`stakeholders-${phase.id}`}
              className={`px-5 py-5 border-b border-l border-border/40 ${isLast ? "border-r" : ""}`}
            >
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-3">
                Stakeholders
              </p>
              <div className="flex flex-wrap gap-1.5">
                {phase.stakeholders.map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-muted/40 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )
        })}

        {/* Goals row */}
        {relevantPhases.map((phase, i) => {
          const color = phaseColors[phase.id] ?? "#64748B"
          const isLast = i === relevantPhases.length - 1
          return (
            <div
              key={`goals-${phase.id}`}
              className={`px-5 py-5 border-b border-l border-border/40 ${isLast ? "border-r rounded-b-lg" : ""}${i === 0 ? " rounded-bl-lg" : ""}`}
            >
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-3">
                Goals
              </p>
              <ul className="space-y-1.5">
                {phase.goals.map((g) => (
                  <li key={g} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="mt-0.5 shrink-0" style={{ color }}>›</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}

      </div>
    </div>
  )
}

"use client"

import { Phase, phaseColors } from "@/data/journey-map-seed"

interface StageNavProps {
  phases: Phase[]
  currentStageId: string
  onNavigate: (stageId: string) => void
}

type StageRef = {
  stageId: string
  stageLabel: string
  phaseId: string
  phaseLabel: string
  isFirstInPhase: boolean
}


export function StageNav({ phases, currentStageId, onNavigate }: StageNavProps) {
  // Flatten all stages in order, tracking phase boundary
  const allStages: StageRef[] = phases.flatMap((phase) =>
    phase.stages.map((stage, i) => ({
      stageId: stage.id,
      stageLabel: stage.label,
      phaseId: phase.id,
      phaseLabel: phase.label,
      isFirstInPhase: i === 0,
    }))
  )

  const currentIndex = allStages.findIndex((s) => s.stageId === currentStageId)
  const current = allStages[currentIndex]
  const prev = currentIndex > 0 ? allStages[currentIndex - 1] : null
  const next = currentIndex < allStages.length - 1 ? allStages[currentIndex + 1] : null

  // Phase-level jumps: first stage of previous/next phase
  const currentPhaseId = current?.phaseId
  const phaseIndex = phases.findIndex((p) => p.id === currentPhaseId)
  const prevPhase = phaseIndex > 0 ? phases[phaseIndex - 1] : null
  const nextPhase = phaseIndex < phases.length - 1 ? phases[phaseIndex + 1] : null
  const prevPhaseFirstStage = prevPhase?.stages[0] ?? null
  const nextPhaseFirstStage = nextPhase?.stages[0] ?? null

  const crossingToPrevPhase = prev && prev.phaseId !== currentPhaseId
  const crossingToNextPhase = next && next.phaseId !== currentPhaseId

  const currentColor = phaseColors[currentPhaseId ?? ""] ?? "#64748B"
  const prevColor = prev ? (phaseColors[prev.phaseId] ?? "#64748B") : "#64748B"
  const nextColor = next ? (phaseColors[next.phaseId] ?? "#64748B") : "#64748B"

  if (!current) return null

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: 0,
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Prev phase jump — only when prev phase exists and we're NOT already at its boundary */}
      {prevPhase && !crossingToPrevPhase && (
        <button
          onClick={() => prevPhaseFirstStage && onNavigate(prevPhaseFirstStage.id)}
          title={`Jump to ${prevPhase.label} phase`}
          style={{
            padding: "8px 10px",
            borderRight: "1px solid var(--color-border)",
            background: `${phaseColors[prevPhase.id] ?? "#64748B"}15`,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: phaseColors[prevPhase.id] ?? "#64748B",
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = `${phaseColors[prevPhase.id] ?? "#64748B"}28`}
          onMouseLeave={(e) => e.currentTarget.style.background = `${phaseColors[prevPhase.id] ?? "#64748B"}15`}
        >
          ‹‹ {prevPhase.label}
        </button>
      )}

      {/* Prev stage */}
      <button
        onClick={() => prev && onNavigate(prev.stageId)}
        disabled={!prev}
        title={prev ? `${prev.phaseLabel} · ${prev.stageLabel}` : undefined}
        style={{
          padding: "8px 14px",
          borderRight: "1px solid var(--color-border)",
          background: prev ? `${prevColor}10` : "transparent",
          cursor: prev ? "pointer" : "not-allowed",
          opacity: prev ? 1 : 0.3,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 1,
          minWidth: 110,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => { if (prev) e.currentTarget.style.background = `${prevColor}20` }}
        onMouseLeave={(e) => { if (prev) e.currentTarget.style.background = `${prevColor}10` }}
      >
        <span style={{ fontSize: 9, color: "var(--color-muted-foreground)", display: "flex", alignItems: "center", gap: 4 }}>
          ← {crossingToPrevPhase
            ? <span style={{ color: prevColor, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{prev?.phaseLabel}</span>
            : "prev"
          }
        </span>
        {prev && (
          <span style={{ fontSize: 11, color: "var(--color-foreground)", fontWeight: 500 }}>
            {prev.stageLabel}
          </span>
        )}
      </button>

      {/* Current stage */}
      <div
        style={{
          padding: "8px 18px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          minWidth: 140,
          borderTop: `2px solid ${currentColor}`,
          background: `${currentColor}12`,
        }}
      >
        <p style={{ fontSize: 9, color: currentColor, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
          {current.phaseLabel}
        </p>
        <p style={{ fontSize: 12, color: "var(--color-foreground)", fontWeight: 700 }}>
          {current.stageLabel}
        </p>
      </div>

      {/* Next stage */}
      <button
        onClick={() => next && onNavigate(next.stageId)}
        disabled={!next}
        title={next ? `${next.phaseLabel} · ${next.stageLabel}` : undefined}
        style={{
          padding: "8px 14px",
          borderLeft: "1px solid var(--color-border)",
          background: next ? `${nextColor}10` : "transparent",
          cursor: next ? "pointer" : "not-allowed",
          opacity: next ? 1 : 0.3,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 1,
          minWidth: 110,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => { if (next) e.currentTarget.style.background = `${nextColor}20` }}
        onMouseLeave={(e) => { if (next) e.currentTarget.style.background = `${nextColor}10` }}
      >
        <span style={{ fontSize: 9, color: "var(--color-muted-foreground)", display: "flex", alignItems: "center", gap: 4 }}>
          {crossingToNextPhase
            ? <span style={{ color: nextColor, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{next?.phaseLabel}</span>
            : "next"
          } →
        </span>
        {next && (
          <span style={{ fontSize: 11, color: "var(--color-foreground)", fontWeight: 500 }}>
            {next.stageLabel}
          </span>
        )}
      </button>

      {/* Next phase jump — only when next phase exists and we're NOT already at its boundary */}
      {nextPhase && !crossingToNextPhase && (
        <button
          onClick={() => nextPhaseFirstStage && onNavigate(nextPhaseFirstStage.id)}
          title={`Jump to ${nextPhase.label} phase`}
          style={{
            padding: "8px 10px",
            borderLeft: "1px solid var(--color-border)",
            background: `${phaseColors[nextPhase.id] ?? "#64748B"}15`,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: phaseColors[nextPhase.id] ?? "#64748B",
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = `${phaseColors[nextPhase.id] ?? "#64748B"}28`}
          onMouseLeave={(e) => e.currentTarget.style.background = `${phaseColors[nextPhase.id] ?? "#64748B"}15`}
        >
          {nextPhase.label} ››
        </button>
      )}
    </div>
  )
}

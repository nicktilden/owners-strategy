"use client"

import { Persona } from "@/data/journey-map-seed"

interface JourneyFiltersProps {
  personas: Persona[]
  highlightPersonaId: string | null
  onHighlight: (personaId: string | null) => void
  showDataLayer: boolean
  onToggleDataLayer: () => void
}

export function JourneyFilters({
  personas,
  highlightPersonaId,
  onHighlight,
  showDataLayer,
  onToggleDataLayer,
}: JourneyFiltersProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: 8,
        padding: 10,
        minWidth: 160,
      }}
    >
      <p
        style={{
          fontSize: 9,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--color-muted-foreground)",
          marginBottom: 2,
        }}
      >
        Highlight Persona
      </p>

      {/* All option */}
      <button
        onClick={() => onHighlight(null)}
        style={{
          textAlign: "left",
          fontSize: 11,
          padding: "3px 6px",
          borderRadius: 4,
          border: `1px solid ${highlightPersonaId === null ? "var(--color-border)" : "transparent"}`,
          background: highlightPersonaId === null ? "var(--color-muted)" : "transparent",
          color: "var(--color-foreground)",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        All personas
      </button>

      {personas.map((persona) => (
        <button
          key={persona.id}
          onClick={() =>
            onHighlight(highlightPersonaId === persona.id ? null : persona.id)
          }
          style={{
            textAlign: "left",
            fontSize: 11,
            padding: "3px 6px",
            borderRadius: 4,
            border: `1px solid ${highlightPersonaId === persona.id ? persona.color : "transparent"}`,
            background:
              highlightPersonaId === persona.id ? `${persona.color}18` : "transparent",
            color:
              highlightPersonaId === persona.id ? persona.color : "var(--color-muted-foreground)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.15s",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: persona.color,
              flexShrink: 0,
            }}
          />
          {persona.label}
        </button>
      ))}

      <div
        style={{
          height: 1,
          background: "var(--color-border)",
          margin: "4px 0",
        }}
      />

      <button
        onClick={onToggleDataLayer}
        style={{
          textAlign: "left",
          fontSize: 11,
          padding: "3px 6px",
          borderRadius: 4,
          border: `1px solid ${showDataLayer ? "var(--color-border)" : "transparent"}`,
          background: showDataLayer ? "var(--color-muted)" : "transparent",
          color: showDataLayer ? "var(--color-foreground)" : "var(--color-muted-foreground)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.15s",
        }}
      >
        <span style={{ fontSize: 10 }}>{showDataLayer ? "✓" : "○"}</span>
        Show data &amp; tools
      </button>
    </div>
  )
}

"use client"

import { Persona } from "@/data/journey-map-seed"

interface PersonaLabelColumnProps {
  personas: Persona[]
  laneHeight: number
  topOffset: number
  onSelectPersona: (persona: Persona) => void
}

export function PersonaLabelColumn({
  personas,
  laneHeight,
  topOffset,
  onSelectPersona,
}: PersonaLabelColumnProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: topOffset,
        left: 0,
        width: 140,
        zIndex: 10,
      }}
    >
      {personas.map((persona) => (
        <button
          key={persona.id}
          onClick={() => onSelectPersona(persona)}
          style={{
            height: laneHeight,
            width: "100%",
            display: "flex",
            alignItems: "center",
            paddingLeft: 12,
            borderRight: `2px solid ${persona.color}40`,
            backgroundColor: "var(--color-background)",
            cursor: "pointer",
            textAlign: "left",
            transition: "background-color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${persona.color}10`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-background)"
          }}
          title={`View ${persona.label} archetype`}
        >
          <div>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: persona.color,
                marginBottom: 4,
              }}
            />
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: persona.color,
                lineHeight: 1.2,
                maxWidth: 110,
              }}
            >
              {persona.label}
            </p>
            <p
              style={{
                fontSize: 9,
                color: "var(--color-muted-foreground)",
                marginTop: 3,
                lineHeight: 1.2,
                maxWidth: 110,
                opacity: 0.7,
              }}
            >
              tap for details
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}

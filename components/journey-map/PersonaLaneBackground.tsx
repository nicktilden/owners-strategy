"use client"

import { Panel } from "@xyflow/react"
import { Persona } from "@/data/journey-map-seed"

interface PersonaLaneBackgroundProps {
  personas: Persona[]
  laneHeight: number
  canvasWidth: number
}

export function PersonaLaneBackground({
  personas,
  laneHeight,
  canvasWidth,
}: PersonaLaneBackgroundProps) {
  return (
    <Panel position="top-left" style={{ margin: 0, pointerEvents: "none" }}>
      <div style={{ width: canvasWidth, position: "relative" }}>
        {personas.map((persona, i) => (
          <div
            key={persona.id}
            style={{
              position: "absolute",
              top: i * laneHeight,
              left: 0,
              width: "100%",
              height: laneHeight,
              backgroundColor: `${persona.color}0D`, // ~5% opacity
              borderBottom: `1px solid ${persona.color}1A`,
            }}
          />
        ))}
      </div>
    </Panel>
  )
}

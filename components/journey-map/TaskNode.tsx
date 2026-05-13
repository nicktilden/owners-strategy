"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "@xyflow/react"
import { JourneyNode, Persona } from "@/data/journey-map-seed"

export type TaskNodeData = {
  node: JourneyNode
  persona: Persona
  showDataLayer: boolean
  highlightPersonaId: string | null
}

function TaskNodeComponent({ data }: NodeProps) {
  const { node, persona, showDataLayer, highlightPersonaId } = data as TaskNodeData

  const isDimmed =
    highlightPersonaId !== null && highlightPersonaId !== node.personaId

  return (
    <div
      style={{
        width: 180,
        opacity: isDimmed ? 0.25 : 1,
        transition: "opacity 0.2s ease",
        borderColor: persona.color,
        borderWidth: 1.5,
        borderStyle: "solid",
        borderRadius: 8,
        backgroundColor: "var(--color-card)",
        padding: "10px 12px",
        position: "relative",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }}
    >
      {/* Step number badge */}
      <div
        style={{
          position: "absolute",
          top: -8,
          left: -8,
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: persona.color,
          color: "#fff",
          fontSize: 9,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {node.stepNumber}
      </div>

      {/* Label */}
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--color-foreground)",
          lineHeight: 1.35,
          marginBottom: showDataLayer ? 8 : 0,
        }}
      >
        {node.label}
      </p>

      {/* Data layer */}
      {showDataLayer && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {node.dataTypes.map((dt) => (
            <span
              key={dt}
              style={{
                fontSize: 9,
                padding: "1px 5px",
                borderRadius: 3,
                background: `${persona.color}20`,
                color: persona.color,
                border: `1px solid ${persona.color}40`,
                fontWeight: 500,
              }}
            >
              {dt}
            </span>
          ))}
          {node.tools.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 9,
                padding: "1px 5px",
                borderRadius: 3,
                background: "var(--color-muted)",
                color: "var(--color-muted-foreground)",
                border: "1px solid var(--color-border)",
                fontWeight: 400,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  )
}

export const TaskNode = memo(TaskNodeComponent)

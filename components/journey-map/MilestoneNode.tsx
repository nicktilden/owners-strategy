"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "@xyflow/react"
import { JourneyNode, Persona } from "@/data/journey-map-seed"

export type MilestoneNodeData = {
  node: JourneyNode
  persona: Persona
  showDataLayer: boolean
  highlightPersonaId: string | null
}

function MilestoneNodeComponent({ data }: NodeProps) {
  const { node, highlightPersonaId } = data as MilestoneNodeData

  const isDimmed =
    highlightPersonaId !== null && highlightPersonaId !== node.personaId

  return (
    <div
      style={{
        opacity: isDimmed ? 0.25 : 1,
        transition: "opacity 0.2s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      {/* Diamond shape */}
      <div
        style={{
          width: 56,
          height: 56,
          backgroundColor: "#FFFBEB",
          border: "2px solid #B45309",
          borderRadius: 4,
          transform: "rotate(45deg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(180,83,9,0.25)",
          position: "relative",
        }}
      >
        {/* Inner content — counter-rotate so text is upright */}
        <div
          style={{
            transform: "rotate(-45deg)",
            textAlign: "center",
            width: 48,
          }}
        >
          <span style={{ fontSize: 9, fontWeight: 700, color: "#B45309" }}>
            {node.stepNumber}
          </span>
        </div>

        <Handle
          type="target"
          position={Position.Left}
          style={{ opacity: 0, top: "50%", left: -10 }}
        />
        <Handle
          type="source"
          position={Position.Right}
          style={{ opacity: 0, top: "50%", right: -10 }}
        />
        <Handle
          type="target"
          position={Position.Top}
          style={{ opacity: 0, left: "50%", top: -10 }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ opacity: 0, left: "50%", bottom: -10 }}
        />
      </div>

      {/* Label below diamond */}
      <div
        style={{
          backgroundColor: "#B4530915",
          border: "1px solid #B4530940",
          borderRadius: 6,
          padding: "3px 8px",
          maxWidth: 160,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#B45309",
            lineHeight: 1.3,
          }}
        >
          {node.milestoneLabel ?? node.label}
        </p>
      </div>
    </div>
  )
}

export const MilestoneNode = memo(MilestoneNodeComponent)

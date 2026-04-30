"use client"

import { useState, useMemo } from "react"
import { valueToNumber, getDependencyColor, getBubbleSize } from "@/lib/utils"
import type { Capability, Weights } from "@/lib/types"
import { DetailPanel } from "./detail-panel"

interface MatrixChartProps {
  capabilities: Capability[]
  weights: Weights
}

const PADDING = 60
const QUADRANT_LABELS = [
  { x: 75, y: 25, label: "Build Now", sublabel: "High Value, High Readiness" },
  { x: 25, y: 25, label: "Sequence Carefully", sublabel: "High Value, Low Readiness" },
  { x: 75, y: 75, label: "Platform Investment", sublabel: "Low Value, High Readiness" },
  { x: 25, y: 75, label: "Defer / Optimize", sublabel: "Low Value, Low Readiness" },
]

export function MatrixChart({ capabilities, weights }: MatrixChartProps) {
  const [selectedCapability, setSelectedCapability] = useState<Capability | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const bubbleData = useMemo(() => {
    return capabilities.map((cap) => {
      // Apply weight influence to positions
      const baseOwnerValue = valueToNumber(cap.ownerValue)
      const basePlatformReadiness = valueToNumber(cap.platformReadiness)

      // Weighted adjustments (subtle influence based on other factors)
      const businessInfluence = (valueToNumber(cap.businessValue) - 2) * (weights.businessValue / 100) * 0.3
      const dependencyInfluence = (2 - valueToNumber(cap.dependencies)) * (weights.dependencies / 100) * 0.3

      const ownerValue = Math.max(0.5, Math.min(3.5, baseOwnerValue + businessInfluence))
      const platformReadiness = Math.max(0.5, Math.min(3.5, basePlatformReadiness + dependencyInfluence))

      // Convert to percentage positions (with some jitter to prevent overlap)
      const jitterX = ((Number.parseInt(cap.id) % 3) - 1) * 3
      const jitterY = ((Number.parseInt(cap.id) % 2) - 0.5) * 4

      const x = ((platformReadiness - 0.5) / 3) * 100 + jitterX
      const y = 100 - ((ownerValue - 0.5) / 3) * 100 + jitterY

      return {
        ...cap,
        x: Math.max(10, Math.min(90, x)),
        y: Math.max(10, Math.min(90, y)),
        size: getBubbleSize(cap.businessValue),
        color: getDependencyColor(cap.dependencies),
      }
    })
  }, [capabilities, weights])

  return (
    <div className="relative">
      {/* Chart */}
      <div className="relative aspect-square max-h-[600px] w-full">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Background */}
          <rect x="0" y="0" width="100" height="100" fill="var(--card)" />

          {/* Grid lines */}
          <line x1="50" y1="0" x2="50" y2="100" stroke="var(--border)" strokeWidth="0.3" strokeDasharray="2,2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="var(--border)" strokeWidth="0.3" strokeDasharray="2,2" />

          {/* Quadrant backgrounds */}
          <rect x="50" y="0" width="50" height="50" fill="var(--success)" fillOpacity="0.05" />
          <rect x="0" y="0" width="50" height="50" fill="var(--warning)" fillOpacity="0.05" />
          <rect x="50" y="50" width="50" height="50" fill="var(--muted)" fillOpacity="0.1" />
          <rect x="0" y="50" width="50" height="50" fill="var(--muted)" fillOpacity="0.15" />

          {/* Quadrant labels */}
          {QUADRANT_LABELS.map((q, i) => (
            <g key={i}>
              <text
                x={q.x}
                y={q.y}
                textAnchor="middle"
                fill="var(--muted-foreground)"
                fontSize="2.5"
                fontWeight="600"
                opacity="0.6"
              >
                {q.label}
              </text>
              <text
                x={q.x}
                y={q.y + 3.5}
                textAnchor="middle"
                fill="var(--muted-foreground)"
                fontSize="1.5"
                opacity="0.4"
              >
                {q.sublabel}
              </text>
            </g>
          ))}

          {/* Axis labels */}
          <text x="50" y="98" textAnchor="middle" fill="var(--muted-foreground)" fontSize="2" fontWeight="500">
            Platform Readiness →
          </text>
          <text
            x="2"
            y="50"
            textAnchor="middle"
            fill="var(--muted-foreground)"
            fontSize="2"
            fontWeight="500"
            transform="rotate(-90, 2, 50)"
          >
            Owner Value →
          </text>

          {/* Low/High labels */}
          <text x="5" y="96" fill="var(--muted-foreground)" fontSize="1.5" opacity="0.5">
            Low
          </text>
          <text x="92" y="96" fill="var(--muted-foreground)" fontSize="1.5" opacity="0.5">
            High
          </text>
          <text x="2" y="95" fill="var(--muted-foreground)" fontSize="1.5" opacity="0.5" transform="rotate(-90, 2, 95)">
            Low
          </text>
          <text x="2" y="8" fill="var(--muted-foreground)" fontSize="1.5" opacity="0.5" transform="rotate(-90, 2, 8)">
            High
          </text>

          {/* Bubbles */}
          {bubbleData.map((bubble) => {
            const isHovered = hoveredId === bubble.id
            const isSelected = selectedCapability?.id === bubble.id
            const scale = isHovered || isSelected ? 1.15 : 1

            return (
              <g
                key={bubble.id}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => setSelectedCapability(bubble)}
                onMouseEnter={() => setHoveredId(bubble.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Glow effect on hover */}
                {(isHovered || isSelected) && (
                  <circle
                    cx={bubble.x}
                    cy={bubble.y}
                    r={(bubble.size / 10) * scale + 1}
                    fill={bubble.color}
                    opacity="0.3"
                  />
                )}

                <circle
                  cx={bubble.x}
                  cy={bubble.y}
                  r={(bubble.size / 10) * scale}
                  fill={bubble.color}
                  opacity={isHovered || isSelected ? 1 : 0.8}
                  stroke={isSelected ? "var(--foreground)" : "transparent"}
                  strokeWidth="0.3"
                />

                {/* Label on hover */}
                {isHovered && (
                  <text
                    x={bubble.x}
                    y={bubble.y - bubble.size / 10 - 2}
                    textAnchor="middle"
                    fill="var(--foreground)"
                    fontSize="2"
                    fontWeight="500"
                  >
                    {bubble.name.length > 20 ? bubble.name.slice(0, 20) + "..." : bubble.name}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="font-medium">Dependency Risk:</span>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-success" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-warning" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-danger" />
            <span>High</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium">Business Value:</span>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-muted-foreground" />
            <span>Small</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-muted-foreground" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-4 w-4 rounded-full bg-muted-foreground" />
            <span>Large</span>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedCapability && (
        <DetailPanel capability={selectedCapability} onClose={() => setSelectedCapability(null)} />
      )}
    </div>
  )
}

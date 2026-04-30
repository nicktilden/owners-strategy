"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getQuadrant, valueToNumber, getDependencyColor } from "@/lib/utils"
import type { Capability } from "@/lib/types"

interface DetailPanelProps {
  capability: Capability
  onClose: () => void
}

export function DetailPanel({ capability, onClose }: DetailPanelProps) {
  const quadrant = getQuadrant(valueToNumber(capability.ownerValue), valueToNumber(capability.platformReadiness))

  return (
    <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:bottom-4 sm:w-80 bg-popover border border-border rounded-lg shadow-xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="font-semibold text-foreground leading-tight">{capability.name}</h3>
          <Badge variant="outline" className="mt-1 text-xs">
            {quadrant}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{capability.description}</p>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <ScoreItem label="Owner Value" value={capability.ownerValue} />
        <ScoreItem label="Platform Readiness" value={capability.platformReadiness} />
        <ScoreItem label="Business Value" value={capability.businessValue} />
        <ScoreItem
          label="Dependencies"
          value={capability.dependencies}
          color={getDependencyColor(capability.dependencies)}
        />
      </div>

      {/* Teams */}
      <div className="mb-4">
        <span className="text-xs font-medium text-muted-foreground">Teams Involved</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {capability.dependencyTeams.map((team) => (
            <Badge key={team} variant="secondary" className="text-xs">
              {team}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tier */}
      <div className="mb-4">
        <span className="text-xs font-medium text-muted-foreground">Tier</span>
        <Badge variant="outline" className="ml-2 text-xs">
          {capability.tier}
        </Badge>
      </div>

      {/* Risks */}
      {capability.risks.length > 0 && (
        <div className="mb-3">
          <span className="text-xs font-medium text-muted-foreground">Key Risks</span>
          <ul className="mt-1 space-y-1">
            {capability.risks.map((risk, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                <span className="text-danger">•</span>
                {risk}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Assumptions */}
      {capability.assumptions.length > 0 && (
        <div>
          <span className="text-xs font-medium text-muted-foreground">Assumptions</span>
          <ul className="mt-1 space-y-1">
            {capability.assumptions.map((assumption, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                <span className="text-primary">•</span>
                {assumption}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function ScoreItem({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-secondary/50 rounded px-2 py-1.5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium" style={color ? { color } : undefined}>
        {value}
      </div>
    </div>
  )
}

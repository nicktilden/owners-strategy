"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { calculateWeightedScore, getDependencyColor, getQuadrant, valueToNumber } from "@/lib/utils"
import type { Capability, Weights } from "@/lib/types"

interface RankingListProps {
  capabilities: Capability[]
  weights: Weights
}

export function RankingList({ capabilities, weights }: RankingListProps) {
  const rankedCapabilities = useMemo(() => {
    return [...capabilities]
      .map((cap) => ({
        ...cap,
        score: calculateWeightedScore(cap, weights),
        quadrant: getQuadrant(valueToNumber(cap.ownerValue), valueToNumber(cap.platformReadiness)),
      }))
      .sort((a, b) => b.score - a.score)
  }, [capabilities, weights])

  return (
    <div className="p-4">
      <div className="grid gap-2">
        {rankedCapabilities.map((cap, index) => (
          <div
            key={cap.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-foreground font-semibold text-sm">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground truncate">{cap.name}</span>
                <Badge variant="outline" className="text-xs shrink-0">
                  {cap.tier}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{cap.quadrant}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getDependencyColor(cap.dependencies) }}
                  />
                  {cap.dependencies} dependency
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-lg font-semibold text-foreground">{cap.score.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">score</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

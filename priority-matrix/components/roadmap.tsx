"use client"

import { useState, useMemo } from "react"
import type { Capability, CapabilityStatus, TierType } from "@/lib/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface RoadmapProps {
  capabilities: Capability[]
  onUpdateCapability: (capability: Capability) => void
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"]

const statusColors: Record<CapabilityStatus, string> = {
  "Not Started": "bg-muted-foreground/30",
  Discovery: "bg-amber-500",
  "In Progress": "bg-blue-500",
  Complete: "bg-emerald-500",
}

const statusTextColors: Record<CapabilityStatus, string> = {
  "Not Started": "text-muted-foreground",
  Discovery: "text-amber-500",
  "In Progress": "text-blue-500",
  Complete: "text-emerald-500",
}

const tierColors: Record<TierType, string> = {
  "Net New": "border-l-blue-500",
  Enhancement: "border-l-purple-500",
  Extension: "border-l-emerald-500",
}

export function Roadmap({ capabilities, onUpdateCapability }: RoadmapProps) {
  const [hoveredCapability, setHoveredCapability] = useState<string | null>(null)

  // Generate 24 months starting from Jan 2026
  const timelineStart = new Date(2026, 0, 1)
  const timelineEnd = new Date(2027, 11, 31)

  const months = useMemo(() => {
    const result: { date: Date; label: string; year: number; quarter: number; monthIndex: number }[] = []
    const current = new Date(timelineStart)

    while (current <= timelineEnd) {
      result.push({
        date: new Date(current),
        label: MONTHS[current.getMonth()],
        year: current.getFullYear(),
        quarter: Math.floor(current.getMonth() / 3) + 1,
        monthIndex: result.length,
      })
      current.setMonth(current.getMonth() + 1)
    }
    return result
  }, [])

  const totalMonths = months.length

  const getBarPosition = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const startOffset = (start.getFullYear() - 2026) * 12 + start.getMonth()
    const endOffset = (end.getFullYear() - 2026) * 12 + end.getMonth()

    const left = Math.max(0, (startOffset / totalMonths) * 100)
    const width = Math.min(100 - left, ((endOffset - startOffset + 1) / totalMonths) * 100)

    return { left: `${left}%`, width: `${width}%` }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const getDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1
    return `${months} month${months > 1 ? "s" : ""}`
  }

  // Group quarters for header
  const quarters = useMemo(() => {
    const result: { label: string; year: number; span: number; startIndex: number }[] = []
    let currentQuarter = -1
    let currentYear = -1

    months.forEach((month, index) => {
      if (month.quarter !== currentQuarter || month.year !== currentYear) {
        result.push({
          label: `${QUARTERS[month.quarter - 1]} ${month.year}`,
          year: month.year,
          span: 1,
          startIndex: index,
        })
        currentQuarter = month.quarter
        currentYear = month.year
      } else {
        result[result.length - 1].span++
      }
    })
    return result
  }, [months])

  // Sort capabilities by start date
  const sortedCapabilities = useMemo(() => {
    return [...capabilities].sort((a, b) => {
      if (!a.timeline || !b.timeline) return 0
      return new Date(a.timeline.startDate).getTime() - new Date(b.timeline.startDate).getTime()
    })
  }, [capabilities])

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Capability Roadmap</h2>
          <p className="text-sm text-muted-foreground mt-1">2-year timeline showing capability delivery schedule</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-muted-foreground">Status:</span>
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span className="text-muted-foreground">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3 text-xs">
        <span className="text-muted-foreground">Tier:</span>
        {Object.entries(tierColors).map(([tier, color]) => (
          <div key={tier} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 border-l-2 ${color}`} />
            <span className="text-muted-foreground">{tier}</span>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {/* Timeline Header */}
        <div className="border-b border-border bg-muted/30">
          {/* Quarters row */}
          <div className="flex">
            <div className="w-64 shrink-0 px-4 py-2 border-r border-border" />
            <div className="flex-1 flex">
              {quarters.map((quarter, idx) => (
                <div
                  key={idx}
                  className="text-center text-xs font-medium text-foreground border-r border-border py-2"
                  style={{ width: `${(quarter.span / totalMonths) * 100}%` }}
                >
                  {quarter.label}
                </div>
              ))}
            </div>
          </div>
          {/* Months row */}
          <div className="flex">
            <div className="w-64 shrink-0 px-4 py-2 border-r border-border text-xs font-medium text-muted-foreground">
              Capability
            </div>
            <div className="flex-1 flex">
              {months.map((month, idx) => (
                <div
                  key={idx}
                  className={`text-center text-[10px] text-muted-foreground py-1.5 border-r border-border/50 ${
                    month.label === "Jan" ? "border-l border-border" : ""
                  }`}
                  style={{ width: `${100 / totalMonths}%` }}
                >
                  {month.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Capability Rows */}
        <div className="divide-y divide-border/50">
          {sortedCapabilities.map((capability) => {
            const timeline = capability.timeline
            if (!timeline) return null

            const position = getBarPosition(timeline.startDate, timeline.endDate)

            return (
              <div
                key={capability.id}
                className={`flex items-center transition-colors ${
                  hoveredCapability === capability.id ? "bg-muted/50" : ""
                }`}
                onMouseEnter={() => setHoveredCapability(capability.id)}
                onMouseLeave={() => setHoveredCapability(null)}
              >
                {/* Capability Name */}
                <div
                  className={`w-64 shrink-0 px-4 py-3 border-r border-border border-l-2 ${tierColors[capability.tier]}`}
                >
                  <span className="text-sm font-medium text-foreground truncate block">{capability.name}</span>
                </div>

                {/* Timeline Bar */}
                <div className="flex-1 relative h-12">
                  {/* Month grid lines */}
                  <div className="absolute inset-0 flex">
                    {months.map((month, idx) => (
                      <div
                        key={idx}
                        className={`h-full border-r border-border/20 ${
                          month.label === "Jan" ? "border-l border-border/40" : ""
                        }`}
                        style={{ width: `${100 / totalMonths}%` }}
                      />
                    ))}
                  </div>

                  {/* Capability Bar with Popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className={`absolute top-1/2 -translate-y-1/2 h-7 rounded-md cursor-pointer transition-all hover:scale-y-110 ${statusColors[timeline.status]}`}
                        style={{
                          left: position.left,
                          width: position.width,
                          minWidth: "24px",
                        }}
                      >
                        <span className="sr-only">{capability.name}</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" side="top" align="start" sideOffset={8}>
                      <div className="p-4 space-y-4">
                        {/* Header */}
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-foreground leading-tight">{capability.name}</h3>
                            <Badge
                              variant="outline"
                              className={`shrink-0 ${statusTextColors[timeline.status]} border-current`}
                            >
                              {timeline.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                            {capability.description}
                          </p>
                        </div>

                        {/* Timeline */}
                        <div className="bg-muted/50 rounded-md p-3">
                          <div className="text-xs font-medium text-muted-foreground mb-2">Timeline</div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground">
                              {formatDate(timeline.startDate)} — {formatDate(timeline.endDate)}
                            </span>
                            <span className="text-muted-foreground">
                              {getDuration(timeline.startDate, timeline.endDate)}
                            </span>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-1">Owner Value</div>
                            <div className="text-foreground">{capability.ownerValue}</div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-1">Business Value</div>
                            <div className="text-foreground">{capability.businessValue}</div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-1">Platform Readiness</div>
                            <div className="text-foreground">{capability.platformReadiness}</div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-1">Dependencies</div>
                            <div className="text-foreground">{capability.dependencies}</div>
                          </div>
                        </div>

                        {/* Teams */}
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-2">Dependent Teams</div>
                          <div className="flex flex-wrap gap-1.5">
                            {capability.dependencyTeams.map((team) => (
                              <Badge key={team} variant="secondary" className="text-xs">
                                {team}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Tier & Risks */}
                        <div className="pt-2 border-t border-border space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">Tier:</span>
                            <Badge variant="outline" className="text-xs">
                              {capability.tier}
                            </Badge>
                          </div>
                          {capability.risks.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-muted-foreground mb-1">Key Risks</div>
                              <ul className="text-xs text-muted-foreground space-y-0.5">
                                {capability.risks.slice(0, 2).map((risk, idx) => (
                                  <li key={idx} className="flex items-start gap-1.5">
                                    <span className="text-amber-500 mt-0.5">•</span>
                                    {risk}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Today marker indicator */}
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <div className="w-0.5 h-4 bg-red-500 rounded-full" />
        <span>Current date shown as vertical line in timeline</span>
      </div>
    </div>
  )
}

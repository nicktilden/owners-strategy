"use client"

import React from "react"

import { useState } from "react"
import type { Capability, CapabilityStatus, TierType, LevelOfEffort, DependencyLevel } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Filter, X } from "lucide-react"
import CapabilityCard from "@/components/capability-card"

interface SequencingProps {
  capabilities: Capability[]
  onUpdateCapability: (capability: Capability) => void
}

const statusColors: Record<CapabilityStatus, string> = {
  "Not Started": "bg-muted text-muted-foreground",
  Discovery: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/30",
  Complete: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  Blocked: "bg-red-500/10 text-red-500 border-red-500/30",
  "On Hold": "bg-orange-500/10 text-orange-500 border-orange-500/30",
}

const tierColors: Record<TierType, string> = {
  "Net New": "bg-blue-500/10 text-blue-500 border-blue-500/30",
  Enhancement: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  Extension: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
}

const effortSizes: Record<LevelOfEffort, { label: string; bars: number }> = {
  Small: { label: "S", bars: 1 },
  Medium: { label: "M", bars: 2 },
  Large: { label: "L", bars: 3 },
  "X-Large": { label: "XL", bars: 4 },
}

const dependencyColors: Record<string, string> = {
  Low: "text-emerald-500",
  Medium: "text-amber-500",
  High: "text-red-500",
}

const allTiers: TierType[] = ["Net New", "Enhancement", "Extension"]
const allStatuses: CapabilityStatus[] = ["Not Started", "Discovery", "In Progress", "Complete", "Blocked", "On Hold"]
const allEfforts: LevelOfEffort[] = ["Small", "Medium", "Large", "X-Large"]
const allDependencies: DependencyLevel[] = ["Low", "Medium", "High"]

export function Sequencing({ capabilities, onUpdateCapability }: SequencingProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null)

  const [selectedTiers, setSelectedTiers] = useState<TierType[]>(allTiers)
  const [selectedStatuses, setSelectedStatuses] = useState<CapabilityStatus[]>(allStatuses)
  const [selectedEfforts, setSelectedEfforts] = useState<LevelOfEffort[]>(allEfforts)
  const [selectedDependencies, setSelectedDependencies] = useState<DependencyLevel[]>(allDependencies)
  const [filterOpen, setFilterOpen] = useState(false)

  const toggleTier = (tier: TierType) => {
    setSelectedTiers((prev) => (prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]))
  }
  const toggleStatus = (status: CapabilityStatus) => {
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }
  const toggleEffort = (effort: LevelOfEffort) => {
    setSelectedEfforts((prev) => (prev.includes(effort) ? prev.filter((e) => e !== effort) : [...prev, effort]))
  }
  const toggleDependency = (dep: DependencyLevel) => {
    setSelectedDependencies((prev) => (prev.includes(dep) ? prev.filter((d) => d !== dep) : [...prev, dep]))
  }

  const resetFilters = () => {
    setSelectedTiers(allTiers)
    setSelectedStatuses(allStatuses)
    setSelectedEfforts(allEfforts)
    setSelectedDependencies(allDependencies)
  }

  const hasActiveFilters =
    selectedTiers.length !== allTiers.length ||
    selectedStatuses.length !== allStatuses.length ||
    selectedEfforts.length !== allEfforts.length ||
    selectedDependencies.length !== allDependencies.length

  // Define sequence sections with state for reordering
  const [nowCapabilities, setNowCapabilities] = useState([
    "Owners Hubs",
    "Health & Risk Framework",
    "Stage-Based Workflows",
    "Procore Connect for Owners",
    "Interaction Model Update",
  ])
  const [nextCapabilities, setNextCapabilities] = useState([
    "Page-level Filtering",
    "Universal Controls - View Modes",
    "Universal Controls - Compare",
  ])
  const [futureCapabilities, setFutureCapabilities] = useState([
    "Portfolio Views",
    "Navigation/IA Update",
    "Portfolio Level Assist",
    "Universal Controls - AI Summary",
  ])

  type SectionType = "now" | "next" | "future"

  const moveCapability = (name: string, fromSection: SectionType, direction: "up" | "down") => {
    const sections: { key: SectionType; items: string[]; setItems: React.Dispatch<React.SetStateAction<string[]>> }[] = [
      { key: "now", items: nowCapabilities, setItems: setNowCapabilities },
      { key: "next", items: nextCapabilities, setItems: setNextCapabilities },
      { key: "future", items: futureCapabilities, setItems: setFutureCapabilities },
    ]

    const sectionIndex = sections.findIndex((s) => s.key === fromSection)
    const currentSection = sections[sectionIndex]
    const itemIndex = currentSection.items.indexOf(name)

    if (direction === "up") {
      if (itemIndex > 0) {
        // Move within section
        const newItems = [...currentSection.items]
        ;[newItems[itemIndex - 1], newItems[itemIndex]] = [newItems[itemIndex], newItems[itemIndex - 1]]
        currentSection.setItems(newItems)
      } else if (sectionIndex > 0) {
        // Move to previous section (at the end)
        const prevSection = sections[sectionIndex - 1]
        currentSection.setItems(currentSection.items.filter((n) => n !== name))
        prevSection.setItems([...prevSection.items, name])
      }
    } else {
      if (itemIndex < currentSection.items.length - 1) {
        // Move within section
        const newItems = [...currentSection.items]
        ;[newItems[itemIndex], newItems[itemIndex + 1]] = [newItems[itemIndex + 1], newItems[itemIndex]]
        currentSection.setItems(newItems)
      } else if (sectionIndex < sections.length - 1) {
        // Move to next section (at the beginning)
        const nextSection = sections[sectionIndex + 1]
        currentSection.setItems(currentSection.items.filter((n) => n !== name))
        nextSection.setItems([name, ...nextSection.items])
      }
    }
  }

  const canMoveUp = (name: string, section: SectionType): boolean => {
    if (section === "now") {
      return nowCapabilities.indexOf(name) > 0
    }
    return true
  }

  const canMoveDown = (name: string, section: SectionType): boolean => {
    if (section === "future") {
      return futureCapabilities.indexOf(name) < futureCapabilities.length - 1
    }
    return true
  }

  const filterCapability = (cap: Capability) => {
    const status = cap.timeline?.status || "Not Started"
    const effort = cap.levelOfEffort || "Medium"
    return (
      selectedTiers.includes(cap.tier) &&
      selectedStatuses.includes(status) &&
      selectedEfforts.includes(effort) &&
      selectedDependencies.includes(cap.dependencies)
    )
  }

  const getCapabilitiesBySection = (names: string[]) => {
    return names
      .map((name) => capabilities.find((cap) => cap.name === name))
      .filter((cap): cap is Capability => cap !== undefined && filterCapability(cap))
  }

  const nowItems = getCapabilitiesBySection(nowCapabilities)
  const nextItems = getCapabilitiesBySection(nextCapabilities)
  const futureItems = getCapabilitiesBySection(futureCapabilities)

  const totalFiltered = nowItems.length + nextItems.length + futureItems.length

  const filteredCapabilities = capabilities.filter(filterCapability)

  return (
    <TooltipProvider>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Sequencing</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Capability sequencing based on level of effort, dependencies, and strategic priority
            </p>
          </div>

          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filter
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {filteredCapabilities.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Filters</h4>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="h-auto py-1 px-2 text-xs">
                      <X className="h-3 w-3 mr-1" />
                      Reset
                    </Button>
                  )}
                </div>

                {/* Tier Filter */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Tier</Label>
                  <div className="flex flex-wrap gap-2">
                    {allTiers.map((tier) => (
                      <div key={tier} className="flex items-center gap-1.5">
                        <Checkbox
                          id={`tier-${tier}`}
                          checked={selectedTiers.includes(tier)}
                          onCheckedChange={() => toggleTier(tier)}
                        />
                        <Label htmlFor={`tier-${tier}`} className="text-xs cursor-pointer">
                          {tier}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="flex flex-wrap gap-2">
                    {allStatuses.map((status) => (
                      <div key={status} className="flex items-center gap-1.5">
                        <Checkbox
                          id={`status-${status}`}
                          checked={selectedStatuses.includes(status)}
                          onCheckedChange={() => toggleStatus(status)}
                        />
                        <Label htmlFor={`status-${status}`} className="text-xs cursor-pointer">
                          {status}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Effort Filter */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Level of Effort</Label>
                  <div className="flex flex-wrap gap-2">
                    {allEfforts.map((effort) => (
                      <div key={effort} className="flex items-center gap-1.5">
                        <Checkbox
                          id={`effort-${effort}`}
                          checked={selectedEfforts.includes(effort)}
                          onCheckedChange={() => toggleEffort(effort)}
                        />
                        <Label htmlFor={`effort-${effort}`} className="text-xs cursor-pointer">
                          {effort}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dependency Filter */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Dependency</Label>
                  <div className="flex flex-wrap gap-2">
                    {allDependencies.map((dep) => (
                      <div key={dep} className="flex items-center gap-1.5">
                        <Checkbox
                          id={`dep-${dep}`}
                          checked={selectedDependencies.includes(dep)}
                          onCheckedChange={() => toggleDependency(dep)}
                        />
                        <Label htmlFor={`dep-${dep}`} className="text-xs cursor-pointer">
                          {dep}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Legend */}
        <div className="mb-6 flex flex-wrap items-center gap-6 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground font-medium">Tier:</span>
            {Object.entries(tierColors).map(([tier, color]) => (
              <Badge key={tier} variant="outline" className={`${color} font-normal`}>
                {tier}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground font-medium">Status:</span>
            {Object.entries(statusColors).map(([status, color]) => (
              <Badge key={status} variant="outline" className={`${color} font-normal`}>
                {status}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground font-medium">Effort:</span>
            {Object.entries(effortSizes).map(([effort, { bars }]) => (
              <div key={effort} className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-1.5 h-3 rounded-sm ${i <= bars ? "bg-foreground" : "bg-muted"}`} />
                  ))}
                </div>
                <span className="text-muted-foreground">{effort}</span>
              </div>
            ))}
          </div>
        </div>

        {totalFiltered === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Filter className="h-10 w-10 text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-foreground">No capabilities match your filters</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filter criteria</p>
            <Button variant="outline" size="sm" onClick={resetFilters} className="mt-4 bg-transparent">
              Reset Filters
            </Button>
          </div>
        ) : (
          /* Capability List by Section */
          <div className="space-y-10">
            {/* NOW Section */}
            {nowItems.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-foreground">NOW</h3>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">{nowItems.length} capabilities</span>
                </div>
                <div className="space-y-4">
                  {nowItems.map((capability, index) => {
                    const effort = capability.levelOfEffort || "Medium"
                    const effortData = effortSizes[effort]
                    const status = capability.timeline?.status || "Not Started"
                    const thumbnailUrl =
                      capability.thumbnail ||
                      `/placeholder.svg?height=120&width=200&query=${encodeURIComponent(capability.thumbnailQuery || capability.name)}`
                    const expandedUrl =
                      capability.thumbnail ||
                      `/placeholder.svg?height=800&width=1400&query=${encodeURIComponent(capability.thumbnailQuery || capability.name)}`

                    return (
                      <CapabilityCard
                        key={capability.id}
                        capability={capability}
                        index={index + 1}
                        thumbnailUrl={thumbnailUrl}
                        expandedUrl={expandedUrl}
                        effortData={effortData}
                        effort={effort}
                        status={status}
                        tierColors={tierColors}
                        statusColors={statusColors}
                        dependencyColors={dependencyColors}
                        onMoveUp={() => moveCapability(capability.name, "now", "up")}
                        onMoveDown={() => moveCapability(capability.name, "now", "down")}
                        canMoveUp={canMoveUp(capability.name, "now")}
                        canMoveDown={canMoveDown(capability.name, "now")}
                      />
                    )
                  })}
                </div>
              </div>
            )}

            {/* NEXT Section */}
            {nextItems.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-foreground">NEXT</h3>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">{nextItems.length} capabilities</span>
                </div>
                <div className="space-y-4">
                  {nextItems.map((capability, index) => {
                    const effort = capability.levelOfEffort || "Medium"
                    const effortData = effortSizes[effort]
                    const status = capability.timeline?.status || "Not Started"
                    const thumbnailUrl =
                      capability.thumbnail ||
                      `/placeholder.svg?height=120&width=200&query=${encodeURIComponent(capability.thumbnailQuery || capability.name)}`
                    const expandedUrl =
                      capability.thumbnail ||
                      `/placeholder.svg?height=800&width=1400&query=${encodeURIComponent(capability.thumbnailQuery || capability.name)}`

                    return (
                      <CapabilityCard
                        key={capability.id}
                        capability={capability}
                        index={index + 1}
                        thumbnailUrl={thumbnailUrl}
                        expandedUrl={expandedUrl}
                        effortData={effortData}
                        effort={effort}
                        status={status}
                        tierColors={tierColors}
                        statusColors={statusColors}
                        dependencyColors={dependencyColors}
                        onMoveUp={() => moveCapability(capability.name, "next", "up")}
                        onMoveDown={() => moveCapability(capability.name, "next", "down")}
                        canMoveUp={canMoveUp(capability.name, "next")}
                        canMoveDown={canMoveDown(capability.name, "next")}
                      />
                    )
                  })}
                </div>
              </div>
            )}

            {/* FUTURE Section */}
            {futureItems.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-foreground">FUTURE</h3>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">{futureItems.length} capabilities</span>
                </div>
                <div className="space-y-4">
                  {futureItems.map((capability, index) => {
                    const effort = capability.levelOfEffort || "Medium"
                    const effortData = effortSizes[effort]
                    const status = capability.timeline?.status || "Not Started"
                    const thumbnailUrl =
                      capability.thumbnail ||
                      `/placeholder.svg?height=120&width=200&query=${encodeURIComponent(capability.thumbnailQuery || capability.name)}`
                    const expandedUrl =
                      capability.thumbnail ||
                      `/placeholder.svg?height=800&width=1400&query=${encodeURIComponent(capability.thumbnailQuery || capability.name)}`

                    return (
                      <CapabilityCard
                        key={capability.id}
                        capability={capability}
                        index={index + 1}
                        thumbnailUrl={thumbnailUrl}
                        expandedUrl={expandedUrl}
                        effortData={effortData}
                        effort={effort}
                        status={status}
                        tierColors={tierColors}
                        statusColors={statusColors}
                        dependencyColors={dependencyColors}
                        onMoveUp={() => moveCapability(capability.name, "future", "up")}
                        onMoveDown={() => moveCapability(capability.name, "future", "down")}
                        canMoveUp={canMoveUp(capability.name, "future")}
                        canMoveDown={canMoveDown(capability.name, "future")}
                      />
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

"use client"

import { useState, useMemo } from "react"
import { Settings, Filter, List, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { MatrixChart } from "./matrix-chart"
import { WeightControls } from "./weight-controls"
import { RankingList } from "./ranking-list"
import { CapabilityManager } from "./capability-manager"
import type { Capability, Weights, DependencyTeam, TierType, DependencyLevel } from "@/lib/types"

const defaultWeights: Weights = {
  ownerValue: 30,
  platformReadiness: 25,
  businessValue: 25,
  dependencies: 20,
}

const allTeams: DependencyTeam[] = ["UIF", "Hubs", "Platform", "Connect"]
const allTiers: TierType[] = ["Net New", "Enhancement", "Extension"]
const allDependencies: DependencyLevel[] = ["Low", "Medium", "High"]

interface PriorityMatrixProps {
  capabilities: Capability[]
  onCapabilitiesChange: (capabilities: Capability[]) => void
}

export function PriorityMatrix({ capabilities, onCapabilitiesChange }: PriorityMatrixProps) {
  const [weights, setWeights] = useState<Weights>(defaultWeights)
  const [selectedTeams, setSelectedTeams] = useState<DependencyTeam[]>(allTeams)
  const [selectedTiers, setSelectedTiers] = useState<TierType[]>(allTiers)
  const [selectedDependencies, setSelectedDependencies] = useState<DependencyLevel[]>(allDependencies)
  const [showRanking, setShowRanking] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  const toggleTeam = (team: DependencyTeam) => {
    setSelectedTeams((prev) => (prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]))
  }
  const toggleTier = (tier: TierType) => {
    setSelectedTiers((prev) => (prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]))
  }
  const toggleDependency = (dep: DependencyLevel) => {
    setSelectedDependencies((prev) => (prev.includes(dep) ? prev.filter((d) => d !== dep) : [...prev, dep]))
  }

  const resetFilters = () => {
    setSelectedTeams(allTeams)
    setSelectedTiers(allTiers)
    setSelectedDependencies(allDependencies)
  }

  const hasActiveFilters =
    selectedTeams.length !== allTeams.length ||
    selectedTiers.length !== allTiers.length ||
    selectedDependencies.length !== allDependencies.length

  const filteredCapabilities = useMemo(() => {
    return capabilities.filter((cap) => {
      const hasMatchingTeam = cap.dependencyTeams.length === 0 || cap.dependencyTeams.some((team) => selectedTeams.includes(team))
      const hasMatchingTier = selectedTiers.includes(cap.tier)
      const hasMatchingDependency = selectedDependencies.includes(cap.dependencies)
      return hasMatchingTeam && hasMatchingTier && hasMatchingDependency
    })
  }, [capabilities, selectedTeams, selectedTiers, selectedDependencies])

  const handleUpdateCapability = (updated: Capability) => {
    onCapabilitiesChange(capabilities.map((cap) => (cap.id === updated.id ? updated : cap)))
  }

  const handleAddCapability = (newCap: Omit<Capability, "id">) => {
    const id = (Math.max(...capabilities.map((c) => Number.parseInt(c.id))) + 1).toString()
    onCapabilitiesChange([...capabilities, { ...newCap, id }])
  }

  const handleDeleteCapability = (id: string) => {
    onCapabilitiesChange(capabilities.filter((cap) => cap.id !== id))
  }

  return (
    <div className="bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Priority Matrix</h1>
            <p className="text-sm text-muted-foreground">Owner Experience Capabilities</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showRanking ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowRanking(!showRanking)}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Ranking</span>
            </Button>

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
                            id={`matrix-tier-${tier}`}
                            checked={selectedTiers.includes(tier)}
                            onCheckedChange={() => toggleTier(tier)}
                          />
                          <Label htmlFor={`matrix-tier-${tier}`} className="text-xs cursor-pointer">
                            {tier}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dependency Level Filter */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Dependency Level</Label>
                    <div className="flex flex-wrap gap-2">
                      {allDependencies.map((dep) => (
                        <div key={dep} className="flex items-center gap-1.5">
                          <Checkbox
                            id={`matrix-dep-${dep}`}
                            checked={selectedDependencies.includes(dep)}
                            onCheckedChange={() => toggleDependency(dep)}
                          />
                          <Label htmlFor={`matrix-dep-${dep}`} className="text-xs cursor-pointer">
                            {dep}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team Filter */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Team Dependencies</Label>
                    <div className="flex flex-wrap gap-2">
                      {allTeams.map((team) => (
                        <div key={team} className="flex items-center gap-1.5">
                          <Checkbox
                            id={`matrix-team-${team}`}
                            checked={selectedTeams.includes(team)}
                            onCheckedChange={() => toggleTeam(team)}
                          />
                          <Label htmlFor={`matrix-team-${team}`} className="text-xs cursor-pointer">
                            {team}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[350px] sm:w-[450px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Manage Capabilities</SheetTitle>
                </SheetHeader>
                <CapabilityManager
                  capabilities={capabilities}
                  onUpdate={handleUpdateCapability}
                  onAdd={handleAddCapability}
                  onDelete={handleDeleteCapability}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Main Matrix Area */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <MatrixChart capabilities={filteredCapabilities} weights={weights} />
          </div>

          {/* Weight Controls - Below chart on mobile */}
          <div className="mt-4 lg:hidden">
            <WeightControls weights={weights} onWeightsChange={setWeights} />
          </div>
        </main>

        {/* Sidebar */}
        <aside className="hidden lg:block w-80 border-l border-border p-4">
          <WeightControls weights={weights} onWeightsChange={setWeights} />
        </aside>
      </div>

      {/* Ranking Panel - Slides up from bottom */}
      {showRanking && (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-card border-t border-border shadow-lg max-h-[50vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
            <h3 className="font-semibold">Priority Ranking</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowRanking(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <RankingList capabilities={filteredCapabilities} weights={weights} />
        </div>
      )}
    </div>
  )
}

"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { Filters, DependencyTeam, TierType } from "@/lib/types"

interface FilterPanelProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  allTeams: DependencyTeam[]
  allTiers: TierType[]
}

export function FilterPanel({ filters, onFiltersChange, allTeams, allTiers }: FilterPanelProps) {
  const toggleTeam = (team: DependencyTeam) => {
    const newTeams = filters.teams.includes(team) ? filters.teams.filter((t) => t !== team) : [...filters.teams, team]
    onFiltersChange({ ...filters, teams: newTeams })
  }

  const toggleTier = (tier: TierType) => {
    const newTiers = filters.tiers.includes(tier) ? filters.tiers.filter((t) => t !== tier) : [...filters.tiers, tier]
    onFiltersChange({ ...filters, tiers: newTiers })
  }

  const selectAllTeams = () => onFiltersChange({ ...filters, teams: allTeams })
  const clearAllTeams = () => onFiltersChange({ ...filters, teams: [] })
  const selectAllTiers = () => onFiltersChange({ ...filters, tiers: allTiers })
  const clearAllTiers = () => onFiltersChange({ ...filters, tiers: [] })

  return (
    <div className="py-6 space-y-6">
      {/* Team Dependencies */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm">Team Dependencies</h4>
          <div className="flex gap-2 text-xs">
            <button onClick={selectAllTeams} className="text-primary hover:underline">
              All
            </button>
            <span className="text-muted-foreground">|</span>
            <button onClick={clearAllTeams} className="text-muted-foreground hover:underline">
              None
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {allTeams.map((team) => (
            <div key={team} className="flex items-center gap-2">
              <Checkbox
                id={`team-${team}`}
                checked={filters.teams.includes(team)}
                onCheckedChange={() => toggleTeam(team)}
              />
              <Label htmlFor={`team-${team}`} className="text-sm cursor-pointer">
                {team}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Tiers */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm">Capability Tiers</h4>
          <div className="flex gap-2 text-xs">
            <button onClick={selectAllTiers} className="text-primary hover:underline">
              All
            </button>
            <span className="text-muted-foreground">|</span>
            <button onClick={clearAllTiers} className="text-muted-foreground hover:underline">
              None
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {allTiers.map((tier) => (
            <div key={tier} className="flex items-center gap-2">
              <Checkbox
                id={`tier-${tier}`}
                checked={filters.tiers.includes(tier)}
                onCheckedChange={() => toggleTier(tier)}
              />
              <Label htmlFor={`tier-${tier}`} className="text-sm cursor-pointer">
                {tier}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="text-xs text-muted-foreground">
        Showing capabilities that match selected teams <strong>and</strong> tiers.
      </div>
    </div>
  )
}

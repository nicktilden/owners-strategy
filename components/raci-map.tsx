"use client"
import type { Capability, RaciValue, RaciTeam } from "@/lib/types"
import { raciTeams } from "@/lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RaciMapProps {
  capabilities: Capability[]
  onUpdateCapability: (capability: Capability) => void
}

const raciLabels: Record<string, string> = {
  R: "Responsible",
  A: "Accountable",
  C: "Consulted",
  I: "Informed",
}

const raciColors: Record<string, string> = {
  R: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  A: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  C: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  I: "bg-slate-500/20 text-slate-400 border-slate-500/30",
}

export function RaciMap({ capabilities, onUpdateCapability }: RaciMapProps) {
  const handleRaciChange = (capability: Capability, team: RaciTeam, value: string) => {
    const newRaci = {
      ...capability.raci,
      [team]: value === "none" ? null : (value as RaciValue),
    }
    onUpdateCapability({
      ...capability,
      raci: newRaci,
    })
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">RACI Responsibility Matrix</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Define team responsibilities for each capability. Click any cell to update assignments.
        </p>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-4">
        <TooltipProvider>
          {Object.entries(raciLabels).map(([key, label]) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${raciColors[key]} cursor-help`}>
                  <span className="font-semibold text-sm">{key}</span>
                  <span className="text-xs opacity-80">{label}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  {key === "R" && "Does the work to complete the task"}
                  {key === "A" && "Ultimately answerable for the task's completion"}
                  {key === "C" && "Provides input and expertise before decisions"}
                  {key === "I" && "Kept updated on progress and outcomes"}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* RACI Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-sm text-foreground border-b border-border min-w-[240px] sticky left-0 bg-muted/50 z-10">
                  Capability
                </th>
                {raciTeams.map((team) => (
                  <th
                    key={team}
                    className="text-center px-3 py-3 font-semibold text-sm text-foreground border-b border-border min-w-[100px]"
                  >
                    {team}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {capabilities.map((capability, index) => (
                <tr
                  key={capability.id}
                  className={`${index % 2 === 0 ? "bg-background" : "bg-muted/20"} hover:bg-muted/40 transition-colors`}
                >
                  <td
                    className={`px-4 py-3 border-b border-border sticky left-0 z-10 ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-foreground">{capability.name}</span>
                      <span className="text-xs text-muted-foreground mt-0.5">{capability.tier}</span>
                    </div>
                  </td>
                  {raciTeams.map((team) => {
                    const value = capability.raci?.[team] || null
                    return (
                      <td key={team} className="px-2 py-2 border-b border-border text-center">
                        <Select
                          value={value || "none"}
                          onValueChange={(newValue) => handleRaciChange(capability, team, newValue)}
                        >
                          <SelectTrigger
                            className={`w-16 h-9 mx-auto border ${
                              value ? raciColors[value] : "bg-transparent text-muted-foreground border-border/50"
                            }`}
                          >
                            <SelectValue>
                              {value ? (
                                <span className="font-semibold">{value}</span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              <span className="text-muted-foreground">None</span>
                            </SelectItem>
                            <SelectItem value="R">
                              <span className="flex items-center gap-2">
                                <span className="font-semibold text-blue-400">R</span>
                                <span className="text-muted-foreground text-xs">Responsible</span>
                              </span>
                            </SelectItem>
                            <SelectItem value="A">
                              <span className="flex items-center gap-2">
                                <span className="font-semibold text-amber-400">A</span>
                                <span className="text-muted-foreground text-xs">Accountable</span>
                              </span>
                            </SelectItem>
                            <SelectItem value="C">
                              <span className="flex items-center gap-2">
                                <span className="font-semibold text-emerald-400">C</span>
                                <span className="text-muted-foreground text-xs">Consulted</span>
                              </span>
                            </SelectItem>
                            <SelectItem value="I">
                              <span className="flex items-center gap-2">
                                <span className="font-semibold text-slate-400">I</span>
                                <span className="text-muted-foreground text-xs">Informed</span>
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {raciTeams.map((team) => {
          const counts = {
            R: capabilities.filter((c) => c.raci?.[team] === "R").length,
            A: capabilities.filter((c) => c.raci?.[team] === "A").length,
            C: capabilities.filter((c) => c.raci?.[team] === "C").length,
            I: capabilities.filter((c) => c.raci?.[team] === "I").length,
          }
          return (
            <div key={team} className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <h4 className="font-medium text-sm text-foreground mb-2">{team}</h4>
              <div className="flex gap-2 text-xs">
                <span className="text-blue-400">{counts.R}R</span>
                <span className="text-amber-400">{counts.A}A</span>
                <span className="text-emerald-400">{counts.C}C</span>
                <span className="text-slate-400">{counts.I}I</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

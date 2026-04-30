"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { Capability, ValueLevel, RiskLevel, TierType, DependencyTeam } from "@/lib/types"

interface CapabilityManagerProps {
  capabilities: Capability[]
  onUpdate: (capability: Capability) => void
  onAdd: (capability: Omit<Capability, "id">) => void
  onDelete: (id: string) => void
}

const VALUE_OPTIONS: ValueLevel[] = ["Low", "Medium", "High"]
const RISK_OPTIONS: RiskLevel[] = ["Low", "Medium", "High"]
const TIER_OPTIONS: TierType[] = ["Foundation", "Decision", "Intelligence", "Optimization"]
const TEAM_OPTIONS: DependencyTeam[] = ["UIF", "Hubs", "Platform", "Connect"]

export function CapabilityManager({ capabilities, onUpdate, onAdd, onDelete }: CapabilityManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="py-4 space-y-4">
      {/* Add New Button */}
      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} className="w-full gap-2" variant="outline">
          <Plus className="h-4 w-4" />
          Add Capability
        </Button>
      )}

      {/* Add Form */}
      {isAdding && (
        <div className="border border-border rounded-lg p-4 bg-secondary/20">
          <CapabilityForm
            onSave={(cap) => {
              onAdd(cap)
              setIsAdding(false)
            }}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      <Separator />

      {/* Capabilities List */}
      <div className="space-y-2">
        {capabilities.map((cap) => (
          <Collapsible
            key={cap.id}
            open={expandedId === cap.id}
            onOpenChange={(open) => setExpandedId(open ? cap.id : null)}
          >
            <div className="border border-border rounded-lg overflow-hidden">
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between p-3 hover:bg-secondary/30 transition-colors text-left">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium text-sm truncate">{cap.name}</span>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {cap.tier}
                    </Badge>
                  </div>
                  {expandedId === cap.id ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="border-t border-border p-3 bg-secondary/10">
                  {editingId === cap.id ? (
                    <CapabilityForm
                      initialData={cap}
                      onSave={(updated) => {
                        onUpdate({ ...updated, id: cap.id })
                        setEditingId(null)
                      }}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">{cap.description}</p>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Owner Value:</span> {cap.ownerValue}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Platform Readiness:</span> {cap.platformReadiness}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Business Value:</span> {cap.businessValue}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Dependencies:</span> {cap.dependencies}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {cap.dependencyTeams.map((team) => (
                          <Badge key={team} variant="secondary" className="text-xs">
                            {team}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(cap.id)} className="gap-1">
                          <Pencil className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(cap.id)}
                          className="gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}

function CapabilityForm({
  initialData,
  onSave,
  onCancel,
}: {
  initialData?: Capability
  onSave: (cap: Omit<Capability, "id">) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initialData?.name || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [ownerValue, setOwnerValue] = useState<ValueLevel>(initialData?.ownerValue || "Medium")
  const [platformReadiness, setPlatformReadiness] = useState<ValueLevel>(initialData?.platformReadiness || "Medium")
  const [businessValue, setBusinessValue] = useState<ValueLevel>(initialData?.businessValue || "Medium")
  const [dependencies, setDependencies] = useState<RiskLevel>(initialData?.dependencies || "Medium")
  const [dependencyTeams, setDependencyTeams] = useState<DependencyTeam[]>(initialData?.dependencyTeams || [])
  const [tier, setTier] = useState<TierType>(initialData?.tier || "Foundation")
  const [risks, setRisks] = useState(initialData?.risks.join("\n") || "")
  const [assumptions, setAssumptions] = useState(initialData?.assumptions.join("\n") || "")

  const toggleTeam = (team: DependencyTeam) => {
    setDependencyTeams((prev) => (prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSave({
      name: name.trim(),
      description: description.trim(),
      ownerValue,
      platformReadiness,
      businessValue,
      dependencies,
      dependencyTeams,
      tier,
      risks: risks.split("\n").filter((r) => r.trim()),
      assumptions: assumptions.split("\n").filter((a) => a.trim()),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-xs">
          Name *
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Capability name"
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-xs">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description"
          className="mt-1"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Owner Value</Label>
          <Select value={ownerValue} onValueChange={(v) => setOwnerValue(v as ValueLevel)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VALUE_OPTIONS.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Platform Readiness</Label>
          <Select value={platformReadiness} onValueChange={(v) => setPlatformReadiness(v as ValueLevel)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VALUE_OPTIONS.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Business Value</Label>
          <Select value={businessValue} onValueChange={(v) => setBusinessValue(v as ValueLevel)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low (Small)</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High (Large)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Dependencies</Label>
          <Select value={dependencies} onValueChange={(v) => setDependencies(v as RiskLevel)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low (Green)</SelectItem>
              <SelectItem value="Medium">Medium (Yellow)</SelectItem>
              <SelectItem value="High">High (Red)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-xs">Tier</Label>
        <Select value={tier} onValueChange={(v) => setTier(v as TierType)}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIER_OPTIONS.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs mb-2 block">Dependency Teams</Label>
        <div className="flex flex-wrap gap-3">
          {TEAM_OPTIONS.map((team) => (
            <div key={team} className="flex items-center gap-1.5">
              <Checkbox
                id={`form-team-${team}`}
                checked={dependencyTeams.includes(team)}
                onCheckedChange={() => toggleTeam(team)}
              />
              <Label htmlFor={`form-team-${team}`} className="text-xs cursor-pointer">
                {team}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="risks" className="text-xs">
          Risks (one per line)
        </Label>
        <Textarea
          id="risks"
          value={risks}
          onChange={(e) => setRisks(e.target.value)}
          placeholder="Enter risks, one per line"
          className="mt-1"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="assumptions" className="text-xs">
          Assumptions (one per line)
        </Label>
        <Textarea
          id="assumptions"
          value={assumptions}
          onChange={(e) => setAssumptions(e.target.value)}
          placeholder="Enter assumptions, one per line"
          className="mt-1"
          rows={2}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" size="sm">
          Save
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

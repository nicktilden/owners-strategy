"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { AudienceType, phases as allPhases, personas } from "@/data/journey-map-seed"
import { AudienceLens } from "./AudienceLens"
import { LifecyclePhases } from "./LifecyclePhases"
import { JourneyCanvas } from "./JourneyCanvas"
import { Breadcrumb } from "./Breadcrumb"
import { AudienceSwitcher } from "./AudienceSwitcher"

type Level = 1 | 2 | 3 | 4

export function JourneyMapShell() {
  const [level, setLevel] = useState<Level>(1)
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>("owners")
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null)
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // Phases and personas filtered to the current audience
  const audiencePhases = useMemo(
    () => allPhases.filter((p) => p.audienceType === selectedAudience),
    [selectedAudience]
  )
  const audiencePersonas = useMemo(
    () => personas.filter((p) => p.audienceType === selectedAudience),
    [selectedAudience]
  )

  const selectedPhase = audiencePhases.find((p) => p.id === selectedPhaseId) ?? null
  const selectedStage =
    selectedPhase?.stages.find((s) => s.id === selectedStageId) ?? null

  function handleSelectAudience(audience: AudienceType) {
    setSelectedAudience(audience)
    setLevel(2)
    setSelectedPhaseId(null)
    setSelectedStageId(null)
    setSelectedNodeId(null)
  }

  function handleSelectStage(phaseId: string, stageId: string) {
    setSelectedPhaseId(phaseId)
    setSelectedStageId(stageId)
    setSelectedNodeId(null)
    setLevel(3)
  }

  function handleNavigateStage(stageId: string) {
    // Find which phase this stage belongs to (within current audience's phases)
    for (const phase of audiencePhases) {
      const found = phase.stages.find((s) => s.id === stageId)
      if (found) {
        setSelectedPhaseId(phase.id)
        setSelectedStageId(stageId)
        setSelectedNodeId(null)
        break
      }
    }
  }

  function handleSelectLevel(targetLevel: Level) {
    setLevel(targetLevel)
    if (targetLevel < 3) {
      setSelectedNodeId(null)
    }
    if (targetLevel < 2) {
      setSelectedPhaseId(null)
      setSelectedStageId(null)
    }
  }

  function handleSelectNode(nodeId: string) {
    setSelectedNodeId(nodeId)
    setLevel(4)
  }

  function handleCloseDrawer() {
    setSelectedNodeId(null)
    setLevel(3)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
        <div className="container mx-auto px-6 py-6 flex items-center gap-4">
          <div className="flex-1">
            <Link
              href="/"
              className="text-xs font-medium uppercase tracking-widest text-[#FF5200] hover:opacity-80 transition-opacity"
            >
              ← Owners Strategy
            </Link>
            <h1
              className={`font-semibold tracking-tight text-foreground mt-1 transition-all duration-300 ${
                level === 1 ? "text-4xl" : "text-2xl"
              }`}
            >
              Journey Map
            </h1>
          </div>
          {level >= 2 && (
            <div className="flex flex-col items-end gap-2">
              <AudienceSwitcher
                selected={selectedAudience}
                onChange={handleSelectAudience}
              />
            </div>
          )}
        </div>
        {level >= 2 && (
          <div className="container mx-auto px-6 pb-4">
            <Breadcrumb
              audience={selectedAudience}
              phase={selectedPhase}
              stage={selectedStage}
              onSelectLevel={handleSelectLevel}
            />
          </div>
        )}
      </header>

      <main className="flex-1 overflow-hidden">
        <div
          key={level <= 2 ? "overview" : `stage-${selectedStageId}`}
          className="h-full animate-in fade-in duration-200"
        >
          {level === 1 && (
            <div className="container mx-auto px-6 py-12">
              <AudienceLens onSelect={handleSelectAudience} />
            </div>
          )}

          {level === 2 && (
            <div className="container mx-auto px-6 py-10 overflow-y-auto">
              <LifecyclePhases
                audience={selectedAudience}
                onSelectStage={handleSelectStage}
              />
            </div>
          )}

          {(level === 3 || level === 4) && selectedStageId && (
            <JourneyCanvas
              stageId={selectedStageId}
              phases={audiencePhases}
              personas={audiencePersonas}
              selectedNodeId={level === 4 ? selectedNodeId : null}
              onSelectNode={handleSelectNode}
              onCloseDrawer={handleCloseDrawer}
              onNavigateStage={handleNavigateStage}
            />
          )}
        </div>
      </main>
    </div>
  )
}

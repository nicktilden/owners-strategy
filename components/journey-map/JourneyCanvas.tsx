"use client"

import "@xyflow/react/dist/style.css"

import { useState, useCallback, useMemo } from "react"
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
  Panel,
  NodeMouseHandler,
  Node,
  Edge,
} from "@xyflow/react"

import {
  journeyNodes,
  journeyEdges,
  Phase,
  Persona,
  Stage,
  phaseColors,
} from "@/data/journey-map-seed"

import { TaskNode, TaskNodeData } from "./TaskNode"
import { MilestoneNode, MilestoneNodeData } from "./MilestoneNode"
import { PersonaLaneBackground } from "./PersonaLaneBackground"
import { PersonaLabelColumn } from "./PersonaLabelColumn"
import { StageNav } from "./StageNav"
import { JourneyFilters } from "./JourneyFilters"
import { TaskDetailDrawer } from "./TaskDetailDrawer"
import { PersonaDetailDrawer } from "./PersonaDetailDrawer"

// Define node types OUTSIDE component to avoid re-registration warnings
const nodeTypes = {
  "task-node": TaskNode,
  "milestone-node": MilestoneNode,
}

const LANE_HEIGHT = 160
const LABEL_COL_WIDTH = 140
const NODE_X_SPACING = 240
const NODE_X_OFFSET = LABEL_COL_WIDTH + 40

interface JourneyCanvasProps {
  stageId: string
  phases: Phase[]
  personas: Persona[]
  selectedNodeId: string | null
  onSelectNode: (nodeId: string) => void
  onCloseDrawer: () => void
  onNavigateStage: (stageId: string) => void
}

// Flatten all stages for the drawer
const allStages: Stage[] = []
// We'll derive from phases prop at runtime

export function JourneyCanvas({
  stageId,
  phases,
  personas,
  selectedNodeId,
  onSelectNode,
  onCloseDrawer,
  onNavigateStage,
}: JourneyCanvasProps) {
  const [highlightPersonaId, setHighlightPersonaId] = useState<string | null>(null)
  const [showDataLayer, setShowDataLayer] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)

  // Flatten stages from phases
  const flatStages: Stage[] = useMemo(
    () => phases.flatMap((p) => p.stages),
    [phases]
  )

  // Current phase + stage for the context bar
  const currentStage = useMemo(
    () => flatStages.find((s) => s.id === stageId) ?? null,
    [flatStages, stageId]
  )
  const currentPhase = useMemo(
    () => phases.find((p) => p.stages.some((s) => s.id === stageId)) ?? null,
    [phases, stageId]
  )

  // Filter nodes for this stage
  const stageNodes = useMemo(
    () => journeyNodes.filter((n) => n.stageId === stageId),
    [stageId]
  )

  // Build persona index for lane positioning
  // Only include personas that actually appear in this stage
  const stagePersonaIds = useMemo(
    () => [...new Set(stageNodes.map((n) => n.personaId))],
    [stageNodes]
  )
  const stagePersonas = useMemo(
    () => personas.filter((p) => stagePersonaIds.includes(p.id)),
    [personas, stagePersonaIds]
  )
  const personaIndexMap = useMemo(() => {
    const map: Record<string, number> = {}
    stagePersonas.forEach((p, i) => {
      map[p.id] = i
    })
    return map
  }, [stagePersonas])

  // Convert JourneyNodes → ReactFlow nodes
  const rfNodes: Node[] = useMemo(
    () =>
      stageNodes.map((jn) => {
        const personaIndex = personaIndexMap[jn.personaId] ?? 0
        const persona = personas.find((p) => p.id === jn.personaId)!
        const x = NODE_X_OFFSET + (jn.stepNumber - 1) * NODE_X_SPACING
        const y = personaIndex * LANE_HEIGHT + LANE_HEIGHT / 2 - 40

        const isMilestone = jn.isMilestone
        const nodeData: TaskNodeData | MilestoneNodeData = {
          node: jn,
          persona,
          showDataLayer,
          highlightPersonaId,
        }

        return {
          id: jn.id,
          type: isMilestone ? "milestone-node" : "task-node",
          position: { x, y },
          data: nodeData,
          selected: jn.id === selectedNodeId,
        }
      }),
    [stageNodes, personaIndexMap, personas, showDataLayer, highlightPersonaId, selectedNodeId]
  )

  // Convert JourneyEdges → ReactFlow edges (only edges where both source & target are in stage)
  const stageNodeIds = useMemo(() => new Set(stageNodes.map((n) => n.id)), [stageNodes])
  const rfEdges: Edge[] = useMemo(
    () =>
      journeyEdges
        .filter(
          (je) =>
            stageNodeIds.has(je.sourceNodeId) && stageNodeIds.has(je.targetNodeId)
        )
        .map((je) => ({
          id: je.id,
          source: je.sourceNodeId,
          target: je.targetNodeId,
          style: {
            stroke: je.crossLane ? "#64748B80" : "#64748B50",
            strokeWidth: je.crossLane ? 1.5 : 1,
            strokeDasharray: je.crossLane ? "4 3" : undefined,
          },
          animated: false,
        })),
    [journeyEdges, stageNodeIds]
  )

  const [nodes, , onNodesChange] = useNodesState(rfNodes)
  const [edges, , onEdgesChange] = useEdgesState(rfEdges)

  // Sync node data changes (showDataLayer, highlight, selectedNodeId) without re-initializing state
  // We use useMemo-derived nodes above directly — but useNodesState initializes once.
  // Solution: re-derive nodes directly from rfNodes (bypass useNodesState reactivity for data updates).
  // We pass rfNodes directly to ReactFlow so data always reflects current filter state.

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      onSelectNode(node.id)
    },
    [onSelectNode]
  )

  const handlePaneClick = useCallback(() => {
    if (selectedNodeId) {
      onCloseDrawer()
    }
  }, [selectedNodeId, onCloseDrawer])

  const selectedJourneyNode = journeyNodes.find((n) => n.id === selectedNodeId) ?? null

  const canvasWidth = Math.max(
    NODE_X_OFFSET + (Math.max(...stageNodes.map((n) => n.stepNumber), 1)) * NODE_X_SPACING + 300,
    900
  )
  const canvasHeight = stagePersonas.length * LANE_HEIGHT

  const phaseColor = currentPhase ? (phaseColors[currentPhase.id] ?? "#64748B") : "#64748B"

  // Phase-level prev/next for the phase bar
  const phaseIndex = phases.findIndex((p) => p.id === currentPhase?.id)
  const prevPhase = phaseIndex > 0 ? phases[phaseIndex - 1] : null
  const nextPhase = phaseIndex < phases.length - 1 ? phases[phaseIndex + 1] : null
  const prevPhaseColor = prevPhase ? (phaseColors[prevPhase.id] ?? "#64748B") : "#64748B"
  const nextPhaseColor = nextPhase ? (phaseColors[nextPhase.id] ?? "#64748B") : "#64748B"

  return (
    <div style={{ position: "relative", width: "100%", height: "calc(100vh - 140px)", display: "flex", flexDirection: "column" }}>

      {/* Phase + Stage context bar */}
      <div
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-background)",
          flexShrink: 0,
        }}
      >
        {/* Phase row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            borderBottom: `1px solid ${phaseColor}30`,
            background: `${phaseColor}0A`,
          }}
        >
          {/* Prev phase */}
          <button
            onClick={() => prevPhase && onNavigateStage(prevPhase.stages[0].id)}
            disabled={!prevPhase}
            title={prevPhase ? `← ${prevPhase.label} phase` : undefined}
            style={{
              padding: "7px 12px",
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 10,
              fontWeight: 600,
              color: prevPhase ? prevPhaseColor : "var(--color-muted-foreground)",
              opacity: prevPhase ? 1 : 0.3,
              cursor: prevPhase ? "pointer" : "not-allowed",
              borderRight: "1px solid var(--color-border)",
              background: "transparent",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              transition: "background 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => { if (prevPhase) e.currentTarget.style.background = `${prevPhaseColor}15` }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
          >
            ← {prevPhase?.label ?? ""}
          </button>

          {/* Current phase label */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 16px", flex: 1 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: phaseColor, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: phaseColor, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {currentPhase?.label ?? "Phase"}
            </span>
          </div>

          {/* Next phase */}
          <button
            onClick={() => nextPhase && onNavigateStage(nextPhase.stages[0].id)}
            disabled={!nextPhase}
            title={nextPhase ? `${nextPhase.label} phase →` : undefined}
            style={{
              padding: "7px 12px",
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 10,
              fontWeight: 600,
              color: nextPhase ? nextPhaseColor : "var(--color-muted-foreground)",
              opacity: nextPhase ? 1 : 0.3,
              cursor: nextPhase ? "pointer" : "not-allowed",
              borderLeft: "1px solid var(--color-border)",
              background: "transparent",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              transition: "background 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => { if (nextPhase) e.currentTarget.style.background = `${nextPhaseColor}15` }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
          >
            {nextPhase?.label ?? ""} →
          </button>
        </div>
        {/* Stage row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px 7px 32px",
          }}
        >
          <span style={{ fontSize: 10, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>
            Stage
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-foreground)" }}>
            {currentStage?.label ?? ""}
          </span>
          {currentStage?.description && (
            <span style={{ fontSize: 11, color: "var(--color-muted-foreground)", marginLeft: 4 }}>
              — {currentStage.description}
            </span>
          )}
        </div>
      </div>

      {/* Canvas area */}
      <div style={{ position: "relative", flex: 1 }}>
      {/* Persona label column — fixed overlay */}
      <PersonaLabelColumn
        personas={stagePersonas}
        laneHeight={LANE_HEIGHT}
        topOffset={0}
        onSelectPersona={(p) => setSelectedPersona(p)}
      />

      <ReactFlow
            style={{ height: "100%" }}
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        panOnScroll={false}
        panOnDrag={true}
        zoomOnScroll={true}
        minZoom={0.3}
        maxZoom={2}
        style={{ background: "var(--color-background)" }}
        proOptions={{ hideAttribution: true }}
      >
        {/* Lane backgrounds */}
        <PersonaLaneBackground
          personas={stagePersonas}
          laneHeight={LANE_HEIGHT}
          canvasWidth={canvasWidth}
        />

        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="var(--color-border)"
          style={{ opacity: 0.4 }}
        />

        {/* Stage navigation — bottom center */}
        <Panel position="bottom-center" style={{ marginBottom: 16 }}>
          <StageNav
            phases={phases}
            currentStageId={stageId}
            onNavigate={onNavigateStage}
          />
        </Panel>

        {/* Filters — top right */}
        <Panel position="top-right" style={{ marginTop: 12, marginRight: 12 }}>
          <JourneyFilters
            personas={stagePersonas}
            highlightPersonaId={highlightPersonaId}
            onHighlight={setHighlightPersonaId}
            showDataLayer={showDataLayer}
            onToggleDataLayer={() => setShowDataLayer((v) => !v)}
          />
        </Panel>
      </ReactFlow>

      {/* Task detail drawer (L4) */}
      {selectedJourneyNode && (
        <TaskDetailDrawer
          node={selectedJourneyNode}
          personas={personas}
          phases={phases}
          stages={flatStages}
          allNodes={journeyNodes}
          onClose={onCloseDrawer}
          onJumpToNode={(nodeId) => {
            onSelectNode(nodeId)
          }}
        />
      )}

      {/* Persona detail drawer */}
      {selectedPersona && !selectedJourneyNode && (
        <PersonaDetailDrawer
          persona={selectedPersona}
          onClose={() => setSelectedPersona(null)}
        />
      )}
      </div>
    </div>
  )
}

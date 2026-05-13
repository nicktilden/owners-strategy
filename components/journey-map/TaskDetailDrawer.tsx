"use client"

import { JourneyNode, Persona, Phase, Stage } from "@/data/journey-map-seed"

interface TaskDetailDrawerProps {
  node: JourneyNode
  personas: Persona[]
  phases: Phase[]
  stages: Stage[]
  allNodes: JourneyNode[]
  onClose: () => void
  onJumpToNode: (nodeId: string) => void
}

export function TaskDetailDrawer({
  node,
  personas,
  phases,
  stages,
  allNodes,
  onClose,
  onJumpToNode,
}: TaskDetailDrawerProps) {
  const persona = personas.find((p) => p.id === node.personaId)
  const phase = phases.find((p) => p.id === node.phaseId)
  const stage = stages.find((s) => s.id === node.stageId)
  const relatedNodes = allNodes.filter((n) => node.relatedNodeIds.includes(n.id))

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 384,
        height: "100%",
        background: "var(--color-card)",
        borderLeft: "1px solid var(--color-border)",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.3)",
        animation: "slideInRight 0.2s ease",
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          {node.isMilestone && (
            <span
              style={{
                display: "inline-block",
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#B45309",
                background: "#B4530915",
                border: "1px solid #B4530940",
                borderRadius: 4,
                padding: "1px 6px",
                marginBottom: 6,
              }}
            >
              Milestone
            </span>
          )}
          <h2
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--color-foreground)",
              lineHeight: 1.3,
            }}
          >
            {node.label}
          </h2>
          <p
            style={{
              fontSize: 12,
              color: "var(--color-muted-foreground)",
              marginTop: 6,
              lineHeight: 1.5,
            }}
          >
            {node.description}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            color: "var(--color-muted-foreground)",
            background: "none",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
            padding: "2px 6px",
            borderRadius: 4,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Persona badge */}
        {persona && (
          <div>
            <SectionLabel>Persona</SectionLabel>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: persona.color,
                background: `${persona.color}15`,
                border: `1px solid ${persona.color}40`,
                borderRadius: 6,
                padding: "4px 10px",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: persona.color,
                  flexShrink: 0,
                }}
              />
              {persona.label}
            </span>
          </div>
        )}

        {/* Phase + Stage context */}
        <div>
          <SectionLabel>Context</SectionLabel>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {phase && (
              <Tag>{phase.label}</Tag>
            )}
            {stage && (
              <Tag>{stage.label}</Tag>
            )}
          </div>
        </div>

        {/* Data types */}
        {node.dataTypes.length > 0 && (
          <div>
            <SectionLabel>Data Types</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {node.dataTypes.map((dt) => (
                <span
                  key={dt}
                  style={{
                    fontSize: 11,
                    padding: "3px 8px",
                    borderRadius: 4,
                    background: persona ? `${persona.color}15` : "var(--color-muted)",
                    color: persona?.color ?? "var(--color-foreground)",
                    border: `1px solid ${persona ? `${persona.color}30` : "var(--color-border)"}`,
                    fontWeight: 500,
                  }}
                >
                  {dt}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tools */}
        {node.tools.length > 0 && (
          <div>
            <SectionLabel>Tools</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {node.tools.map((tool) => (
                <span
                  key={tool}
                  style={{
                    fontSize: 11,
                    padding: "3px 8px",
                    borderRadius: 4,
                    background: "var(--color-muted)",
                    color: "var(--color-muted-foreground)",
                    border: "1px solid var(--color-border)",
                    fontWeight: 400,
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related tasks */}
        {relatedNodes.length > 0 && (
          <div>
            <SectionLabel>Related Steps</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {relatedNodes.map((related) => {
                const relPersona = personas.find((p) => p.id === related.personaId)
                return (
                  <button
                    key={related.id}
                    onClick={() => onJumpToNode(related.id)}
                    style={{
                      textAlign: "left",
                      background: "var(--color-muted)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 6,
                      padding: "8px 10px",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.background =
                        "var(--color-accent)"
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.background =
                        "var(--color-muted)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          backgroundColor: relPersona?.color ?? "#888",
                          fontSize: 8,
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {related.stepNumber}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "var(--color-foreground)",
                        }}
                      >
                        {related.label}
                      </span>
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: 11,
                          color: "var(--color-muted-foreground)",
                        }}
                      >
                        →
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 9,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "var(--color-muted-foreground)",
        marginBottom: 8,
      }}
    >
      {children}
    </p>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 11,
        padding: "3px 8px",
        borderRadius: 4,
        background: "var(--color-muted)",
        color: "var(--color-muted-foreground)",
        border: "1px solid var(--color-border)",
      }}
    >
      {children}
    </span>
  )
}

"use client"

import { Persona, JourneyNode, journeyNodes } from "@/data/journey-map-seed"

interface PersonaDetailDrawerProps {
  persona: Persona
  onClose: () => void
}

type ArchetypeDetail = {
  /** Short descriptor shown under the archetype name */
  role: string
  /** Archetype description */
  summary: string
  /** Representative quote from the archetype */
  quote?: string
  /** Individual job-title personas that belong to this archetype */
  personas?: string[]
  goals: string[]
  painPoints: string[]
  tools: string[]
}

const ARCHETYPE_DETAILS: Record<string, ArchetypeDetail> = {

  // ── Owners ────────────────────────────────────────────────────────────────

  "profit-protectors": {
    role: "Business Investment Lens",
    summary:
      "Profit Protectors view the portfolio from a holistic business investment lens. They care most about financial performance, return on investment, and protecting margins across the project lifecycle.",
    quote:
      "I care most about cost and schedule because they are directly correlated with my investment and potential profit.",
    personas: ["CFO", "VP Development", "VP Operations", "Managing Director"],
    goals: [
      "Maximize ROI and protect project margins",
      "Maintain budget accuracy and cost predictability",
      "Get early warning on cost overruns and risk exposure",
      "Ensure financing milestones are hit on schedule",
    ],
    painPoints: [
      "Budget surprises late in the project",
      "Lack of real-time cost visibility across projects",
      "Manual reconciliation between finance and field data",
      "Change order volume eroding contingency",
    ],
    tools: ["Procore Financials", "Sage", "Excel", "ERP systems"],
  },

  "performance-optimizers": {
    role: "Portfolio Health & Risk Awareness",
    summary:
      "Performance Optimizers are responsible for part (or all) of the portfolio and need to be constantly aware of overall portfolio health and potential risks. They want the big picture first, then the ability to drill down.",
    quote:
      "I like to see the big picture and then whittle it down from there.",
    personas: [
      "Dir. of Construction",
      "Project / Portfolio Dir.",
      "Operations Director",
      "Delivery Strategy Mgr.",
    ],
    goals: [
      "Maintain real-time visibility into portfolio health",
      "Identify schedule and cost risks before they escalate",
      "Coordinate delivery across multiple active projects",
      "Drive consistent processes and reduce firefighting",
    ],
    painPoints: [
      "Schedule slippage that compounds over time",
      "Poor cross-project visibility into subcontractor performance",
      "Too many tools and disconnected data sources",
      "Reactive rather than proactive issue resolution",
    ],
    tools: ["Procore Schedule", "Primavera P6", "Procore Portfolio", "Procore Analytics"],
  },

  "detail-detectives": {
    role: "Project-Level Control & Compliance",
    summary:
      "Detail Detectives are responsible for managing one to several projects, working directly with GCs to manage change and deliver on time. They go deep on documentation, compliance, and field-level accuracy.",
    quote:
      "I'm basically going in every day and trying to spot the error or variance.",
    personas: [
      "Portfolio Mgr.",
      "Program / Project Mgr.",
      "Operations Controller",
      "Construction Mgr.",
      "Operations Mgr.",
    ],
    goals: [
      "Ensure construction meets design specs and code",
      "Capture and close all punch list and inspection items",
      "Maintain complete audit trail for handover",
      "Support commissioning and occupancy milestones",
    ],
    painPoints: [
      "Incomplete or missing documentation at handover",
      "Inconsistent inspection records across trade contractors",
      "Hard to track open items across multiple systems",
      "Last-minute punch list volume delaying closeout",
    ],
    tools: ["Procore Inspections", "Procore Documents", "Bluebeam", "Procore Drawings"],
  },

  "process-facilitators": {
    role: "Platform Setup & Systemization",
    summary:
      "Process Facilitators set up and own the Procore platform for their organization. They oversee the systemization and standardization of how work gets done — managing compliance, access, and administrative workflows.",
    quote:
      "We help oversee the systemization and the standardization of how we work.",
    personas: ["IT Director", "System Administrator"],
    goals: [
      "Standardize processes and workflows across the organization",
      "Manage platform configuration, access, and permissions",
      "Ensure compliance with insurance and contractual requirements",
      "Reduce administrative bottlenecks during project execution",
    ],
    painPoints: [
      "Manual contract routing and approval cycles",
      "Insurance certificate tracking across many vendors",
      "Bid leveling and scope gap identification",
      "Slow onboarding of new contractors and consultants",
    ],
    tools: ["DocuSign", "Procore Admin", "Procore Contracts", "Procore Compliance"],
  },

  // ── GC ────────────────────────────────────────────────────────────────────

  "gc-superintendent": {
    role: "GC Superintendent",
    summary:
      "The boots-on-the-ground leader responsible for daily field operations, subcontractor coordination, and safety compliance. Owns the site from mobilization through substantial completion.",
    personas: ["Superintendent", "Field Engineer", "Site Safety Manager"],
    goals: [
      "Keep daily field operations running smoothly",
      "Coordinate subcontractor work without schedule conflicts",
      "Maintain safety compliance and zero incidents",
      "Close punch list items efficiently at project end",
    ],
    painPoints: [
      "Subcontractors not showing up or falling behind",
      "RFI and submittal delays blocking installation work",
      "Too much paperwork detracting from field time",
      "Last-minute scope changes disrupting sequencing",
    ],
    tools: ["Procore Daily Logs", "Procore RFIs", "Procore Schedule", "Procore Inspections"],
  },

  "gc-project-manager": {
    role: "GC Project Manager",
    summary:
      "Manages the full project delivery — budget, schedule, contracts, and owner relationship. Bridges field operations and business management, ensuring the project is profitable and compliant.",
    personas: ["Project Manager", "Senior Project Manager", "Project Executive"],
    goals: [
      "Deliver project on time and within budget",
      "Manage subcontract buyout and change order exposure",
      "Maintain positive owner and design team relationships",
      "Ensure timely pay application approvals and cash flow",
    ],
    painPoints: [
      "Scope gaps and subcontractor underbidding exposing the GC",
      "Owner approval delays cascading to schedule slippage",
      "Tight project margins with limited contingency",
      "Closeout documentation volume at project end",
    ],
    tools: ["Procore Financials", "Procore Contracts", "Procore Schedule", "Procore Documents"],
  },

  "gc-preconstruction": {
    role: "Preconstruction Manager / Estimator",
    summary:
      "Leads the bid and preconstruction phase — pursuing work, developing estimates, managing subcontractor bids, and transitioning awarded projects to the field team.",
    personas: ["Preconstruction Manager", "Chief Estimator", "Estimator", "Business Development"],
    goals: [
      "Win the right projects at competitive and profitable margins",
      "Develop accurate and thorough cost estimates",
      "Identify and mitigate scope and risk early",
      "Enable a smooth transition from bid to build",
    ],
    painPoints: [
      "Insufficient bid documents leading to estimate uncertainty",
      "Subcontractor non-response during bidding",
      "Short bid timelines with high documentation volume",
      "Handoff gaps between preconstruction and operations teams",
    ],
    tools: ["Procore Bidding", "Procore Financials", "Bluebeam", "Procore Documents"],
  },

  // ── SC ────────────────────────────────────────────────────────────────────

  "sc-foreman": {
    role: "Specialty Trade Foreman",
    summary:
      "Leads the specialty trade crew on site. Responsible for daily production, crew coordination, and first-line quality and safety compliance.",
    personas: ["Foreman", "Lead Carpenter", "Crew Lead"],
    goals: [
      "Hit daily production targets and stay on schedule",
      "Coordinate crew and material logistics with GC superintendent",
      "Maintain safety and quality standards for specialty scope",
      "Close punch list items quickly at project end",
    ],
    painPoints: [
      "Material delivery delays stopping field work",
      "GC schedule changes disrupting crew sequencing",
      "Unclear scope boundaries with other trades",
      "Inspection and approval delays holding up the next phase",
    ],
    tools: ["Procore Daily Logs", "Procore Inspections", "Procore Schedule"],
  },

  "sc-estimator": {
    role: "Specialty Trade Estimator",
    summary:
      "Develops detailed quantity takeoffs and pricing for specialty scope. Manages the bid process from invitation through submission.",
    personas: ["Estimator", "Senior Estimator", "Bid Coordinator"],
    goals: [
      "Win work at competitive and sustainable margins",
      "Develop accurate material and labor estimates",
      "Respond to bid invitations efficiently",
      "Identify scope gaps and risks before submitting",
    ],
    painPoints: [
      "Incomplete or late-issuing bid documents",
      "Short bid windows with high takeoff complexity",
      "Material price volatility impacting estimate accuracy",
      "Scope ambiguity between GC-issued packages",
    ],
    tools: ["Bluebeam", "Procore Drawings", "Procore Financials"],
  },

  "sc-project-manager": {
    role: "Specialty Trade Project Manager",
    summary:
      "Manages the specialty subcontract from award through final payment. Coordinates with GC, tracks schedule and budget, and handles submittals, RFIs, and pay applications.",
    personas: ["Project Manager", "Project Coordinator", "Contract Administrator"],
    goals: [
      "Deliver specialty scope on schedule and within budget",
      "Get submittals approved without schedule impact",
      "Ensure timely pay application approvals and cash flow",
      "Collect final payment and retainage promptly",
    ],
    painPoints: [
      "Long submittal and RFI response cycles from architect",
      "GC-initiated change orders without clear pricing",
      "Late or disputed pay application approvals",
      "Retainage held beyond contract terms",
    ],
    tools: ["Procore RFIs", "Procore Submittals", "Procore Financials", "Procore Documents"],
  },
}

export function PersonaDetailDrawer({ persona, onClose }: PersonaDetailDrawerProps) {
  const details = ARCHETYPE_DETAILS[persona.id]

  // Count nodes for this archetype in the seed data
  const nodeCount = journeyNodes.filter((n: JourneyNode) => n.personaId === persona.id).length

  return (
    <div
      className="absolute top-0 right-0 h-full z-30 flex flex-col bg-background border-l border-border/40 shadow-xl"
      style={{ width: 384 }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-start justify-between border-b border-border/40 shrink-0"
        style={{ borderTop: `3px solid ${persona.color}` }}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: persona.color }}
            />
            <span className="text-sm font-semibold text-foreground">{persona.label}</span>
          </div>
          {details && (
            <span className="text-xs text-muted-foreground pl-[18px]">{details.role}</span>
          )}
          <span
            className="text-[10px] font-medium uppercase tracking-widest pl-[18px] mt-0.5"
            style={{ color: persona.color }}
          >
            {nodeCount} task{nodeCount !== 1 ? "s" : ""} in journey
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground text-lg leading-none mt-0.5"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {details ? (
          <>
            {/* Summary */}
            <div className="px-5 py-4 border-b border-border/40">
              <p className="text-xs text-muted-foreground leading-relaxed">{details.summary}</p>
            </div>

            {/* Quote */}
            {details.quote && (
              <div
                className="px-5 py-4 border-b border-border/40"
                style={{ background: `${persona.color}08` }}
              >
                <p
                  className="text-xs italic leading-relaxed"
                  style={{ color: persona.color }}
                >
                  &ldquo;{details.quote}&rdquo;
                </p>
              </div>
            )}

            {/* Personas (job titles) */}
            {details.personas && details.personas.length > 0 && (
              <div className="px-5 py-4 border-b border-border/40">
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-3">
                  Includes
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {details.personas.map((p) => (
                    <span
                      key={p}
                      className="text-xs px-2 py-0.5 rounded-full border font-medium"
                      style={{
                        borderColor: `${persona.color}50`,
                        backgroundColor: `${persona.color}10`,
                        color: persona.color,
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Goals */}
            <div className="px-5 py-4 border-b border-border/40">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-3">
                Goals
              </p>
              <ul className="flex flex-col gap-2">
                {details.goals.map((g, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-xs" style={{ color: persona.color }}>›</span>
                    <span className="text-xs text-muted-foreground leading-relaxed">{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pain points */}
            <div className="px-5 py-4 border-b border-border/40">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-3">
                Pain Points
              </p>
              <ul className="flex flex-col gap-2">
                {details.painPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-xs text-destructive">›</span>
                    <span className="text-xs text-muted-foreground leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools */}
            <div className="px-5 py-4">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-3">
                Key Tools
              </p>
              <div className="flex flex-wrap gap-1.5">
                {details.tools.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded border border-border/40 bg-muted/30 text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="px-5 py-8 text-center">
            <p className="text-xs text-muted-foreground">No details available for this archetype.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type AudienceType = 'owners' | 'gc' | 'sc'

export type Phase = {
  id: string
  label: string
  audienceType: AudienceType
  stages: Stage[]
  stakeholders: string[]
  goals: string[]
}

export type Stage = {
  id: string
  phaseId: string
  label: string
  description: string
}

export type Persona = {
  id: string
  label: string
  audienceType: AudienceType
  color: string
}

export type JourneyNode = {
  id: string
  stepNumber: number
  label: string
  description: string
  phaseId: string
  stageId: string
  personaId: string
  isMilestone: boolean
  milestoneLabel?: string
  dataTypes: string[]
  tools: string[]
  relatedNodeIds: string[]
}

export type JourneyEdge = {
  id: string
  sourceNodeId: string
  targetNodeId: string
  crossLane: boolean
}

// ─── Personas ────────────────────────────────────────────────────────────────

export const personas: Persona[] = [
  // Owners
  {
    id: 'profit-protectors',
    label: 'Profit Protectors',
    audienceType: 'owners',
    color: '#7C3AED',
  },
  {
    id: 'performance-optimizers',
    label: 'Performance Optimizers',
    audienceType: 'owners',
    color: '#1D4ED8',
  },
  {
    id: 'detail-detectives',
    label: 'Detail Detectives',
    audienceType: 'owners',
    color: '#065F46',
  },
  {
    id: 'process-facilitators',
    label: 'Process Facilitators',
    audienceType: 'owners',
    color: '#B45309',
  },
  // GC
  {
    id: 'gc-superintendent',
    label: 'Superintendent',
    audienceType: 'gc',
    color: '#0369A1',
  },
  {
    id: 'gc-project-manager',
    label: 'Project Manager',
    audienceType: 'gc',
    color: '#065F46',
  },
  {
    id: 'gc-preconstruction',
    label: 'Preconstruction',
    audienceType: 'gc',
    color: '#B45309',
  },
  // SC
  {
    id: 'sc-foreman',
    label: 'Foreman',
    audienceType: 'sc',
    color: '#7C3AED',
  },
  {
    id: 'sc-estimator',
    label: 'Estimator',
    audienceType: 'sc',
    color: '#0369A1',
  },
  {
    id: 'sc-project-manager',
    label: 'Project Manager',
    audienceType: 'sc',
    color: '#065F46',
  },
]

// ─── Phase colors (single source of truth) ───────────────────────────────────

export const phaseColors: Record<string, string> = {
  plan:    "#1D4ED8",
  build:   "#065F46",
  operate: "#7C3AED",
}

// ─── Shared stage definitions ─────────────────────────────────────────────────
// Each audience gets its own stage objects (same ids per phase context)

// OWNERS stages
const ownersInvestigateStage: Stage = {
  id: 'investigate',
  phaseId: 'plan',
  label: 'Investigate',
  description: 'Initial site assessment, market research, and opportunity identification.',
}
const ownersFeasibilityStage: Stage = {
  id: 'feasibility',
  phaseId: 'plan',
  label: 'Feasibility',
  description: 'Financial modeling, risk analysis, and go/no-go decision gates.',
}
const ownersPreDevelopmentStage: Stage = {
  id: 'pre-development',
  phaseId: 'plan',
  label: 'Pre-Development',
  description: 'Entitlements, design development, permitting, and procurement.',
}
const ownersConstructionStage: Stage = {
  id: 'construction',
  phaseId: 'build',
  label: 'Construction',
  description: 'Active site work from mobilization through substantial completion.',
}
const ownersCloseoutStage: Stage = {
  id: 'closeout',
  phaseId: 'operate',
  label: 'Closeout',
  description: 'Punch lists, inspections, certificate of occupancy, and final documentation.',
}
const ownersHandoverStage: Stage = {
  id: 'handover',
  phaseId: 'operate',
  label: 'Handover',
  description: 'Asset transfer, warranty period, and operational commissioning.',
}

// GC stages (prefixed IDs to avoid collision with owners stages)
const gcInvestigateStage: Stage = {
  id: 'gc-investigate',
  phaseId: 'gc-plan',
  label: 'Investigate',
  description: 'Identify bid opportunities, assess project fit, and evaluate pursuit risk.',
}
const gcFeasibilityStage: Stage = {
  id: 'gc-feasibility',
  phaseId: 'gc-plan',
  label: 'Feasibility',
  description: 'Develop cost estimates, evaluate constructability, and prepare bid strategy.',
}
const gcPreDevelopmentStage: Stage = {
  id: 'gc-pre-development',
  phaseId: 'gc-plan',
  label: 'Pre-Development',
  description: 'Finalize subcontractor scopes, execute contracts, and mobilize teams.',
}
const gcConstructionStage: Stage = {
  id: 'gc-construction',
  phaseId: 'gc-build',
  label: 'Construction',
  description: 'Active site work from mobilization through substantial completion.',
}
const gcCloseoutStage: Stage = {
  id: 'gc-closeout',
  phaseId: 'gc-operate',
  label: 'Closeout',
  description: 'Punch lists, final inspections, as-builts, and owner turnover.',
}
const gcHandoverStage: Stage = {
  id: 'gc-handover',
  phaseId: 'gc-operate',
  label: 'Handover',
  description: 'Warranty activation, retainage release, and project close-out.',
}

// SC stages
const scInvestigateStage: Stage = {
  id: 'sc-investigate',
  phaseId: 'sc-plan',
  label: 'Investigate',
  description: 'Identify bid opportunities and evaluate project fit for specialty scope.',
}
const scFeasibilityStage: Stage = {
  id: 'sc-feasibility',
  phaseId: 'sc-plan',
  label: 'Feasibility',
  description: 'Develop detailed takeoffs, pricing, and bid strategy.',
}
const scPreDevelopmentStage: Stage = {
  id: 'sc-pre-development',
  phaseId: 'sc-plan',
  label: 'Pre-Development',
  description: 'Execute subcontract, submit material approvals, and mobilize crew.',
}
const scConstructionStage: Stage = {
  id: 'sc-construction',
  phaseId: 'sc-build',
  label: 'Construction',
  description: 'Perform specialty scope, coordinate with GC, and document progress.',
}
const scCloseoutStage: Stage = {
  id: 'sc-closeout',
  phaseId: 'sc-operate',
  label: 'Closeout',
  description: 'Complete punch items, submit as-builts, and pass final inspections.',
}
const scHandoverStage: Stage = {
  id: 'sc-handover',
  phaseId: 'sc-operate',
  label: 'Handover',
  description: 'Warranty documentation, training, and final payment collection.',
}

// ─── Phases ──────────────────────────────────────────────────────────────────

export const ownerPhases: Phase[] = [
  {
    id: 'plan',
    label: 'Plan',
    audienceType: 'owners',
    stages: [ownersInvestigateStage, ownersFeasibilityStage, ownersPreDevelopmentStage],
    stakeholders: ['Owner', 'Development Manager', 'Broker', 'Financial Analyst', 'Architect'],
    goals: [
      'Identify viable development opportunity',
      'Validate financial returns',
      'Secure entitlements and permits',
      'Award contracts and lock budget',
    ],
  },
  {
    id: 'build',
    label: 'Build',
    audienceType: 'owners',
    stages: [ownersConstructionStage],
    stakeholders: ['Owner', 'GC', 'Subcontractors', 'Project Manager', 'Inspector', 'Lender'],
    goals: [
      'Maintain schedule and budget',
      'Manage change orders proactively',
      'Ensure quality and safety compliance',
      'Facilitate timely lender draws',
    ],
  },
  {
    id: 'operate',
    label: 'Operate',
    audienceType: 'owners',
    stages: [ownersCloseoutStage, ownersHandoverStage],
    stakeholders: ['Owner', 'GC', 'Facility Manager', 'Tenant', 'Inspector', 'Legal'],
    goals: [
      'Achieve Certificate of Occupancy',
      'Complete punch list and inspections',
      'Transfer asset with full documentation',
      'Activate warranties and operations',
    ],
  },
]

export const gcPhases: Phase[] = [
  {
    id: 'gc-plan',
    label: 'Plan',
    audienceType: 'gc',
    stages: [gcInvestigateStage, gcFeasibilityStage, gcPreDevelopmentStage],
    stakeholders: ['Preconstruction Manager', 'Estimator', 'Business Development', 'Owner', 'Architect'],
    goals: [
      'Identify and pursue right-fit projects',
      'Develop competitive and accurate cost estimates',
      'Win work and execute contracts',
      'Onboard subcontractors and prepare for mobilization',
    ],
  },
  {
    id: 'gc-build',
    label: 'Build',
    audienceType: 'gc',
    stages: [gcConstructionStage],
    stakeholders: ['Superintendent', 'Project Manager', 'Subcontractors', 'Owner', 'Inspector', 'Safety Officer'],
    goals: [
      'Deliver on schedule and within budget',
      'Coordinate subcontractor scopes efficiently',
      'Process RFIs and submittals without schedule impact',
      'Maintain safety and quality standards',
    ],
  },
  {
    id: 'gc-operate',
    label: 'Operate',
    audienceType: 'gc',
    stages: [gcCloseoutStage, gcHandoverStage],
    stakeholders: ['Project Manager', 'Superintendent', 'Owner', 'Architect', 'Inspector', 'Legal'],
    goals: [
      'Complete punch list efficiently',
      'Deliver complete closeout documentation',
      'Collect retainage and final payment',
      'Activate warranties and close project',
    ],
  },
]

export const scPhases: Phase[] = [
  {
    id: 'sc-plan',
    label: 'Plan',
    audienceType: 'sc',
    stages: [scInvestigateStage, scFeasibilityStage, scPreDevelopmentStage],
    stakeholders: ['Estimator', 'Business Development', 'GC', 'Owner'],
    goals: [
      'Identify and bid on right-fit subcontracts',
      'Develop accurate specialty scope pricing',
      'Win work and finalize subcontract terms',
      'Prepare materials, crew, and mobilization plan',
    ],
  },
  {
    id: 'sc-build',
    label: 'Build',
    audienceType: 'sc',
    stages: [scConstructionStage],
    stakeholders: ['Foreman', 'Project Manager', 'GC Superintendent', 'Inspector'],
    goals: [
      'Execute specialty scope on schedule',
      'Coordinate daily with GC superintendent',
      'Process submittals and RFI responses',
      'Track labor and material costs against budget',
    ],
  },
  {
    id: 'sc-operate',
    label: 'Operate',
    audienceType: 'sc',
    stages: [scCloseoutStage, scHandoverStage],
    stakeholders: ['Project Manager', 'GC', 'Owner', 'Inspector'],
    goals: [
      'Complete punch list and final inspections',
      'Submit as-built documentation',
      'Collect final payment and retainage',
      'Activate product warranties',
    ],
  },
]

/** All phases across all audiences — use this for full lookups */
export const phases: Phase[] = [...ownerPhases, ...gcPhases, ...scPhases]

// ─── Journey Nodes ───────────────────────────────────────────────────────────

// ── OWNERS ────────────────────────────────────────────────────────────────────

const ownerNodes: JourneyNode[] = [
  // ── Investigate Stage ────────────────────────────────────────────────────

  {
    id: 'node-1',
    stepNumber: 1,
    label: 'Market & Site Evaluation',
    description:
      'Assess market demand, comparable transactions, and candidate site characteristics including zoning and infrastructure.',
    phaseId: 'plan',
    stageId: 'investigate',
    personaId: 'profit-protectors',
    isMilestone: false,
    dataTypes: ['Reports', 'Budgets'],
    tools: ['Procore Documents', 'Bluebeam'],
    relatedNodeIds: ['node-2', 'node-3'],
  },
  {
    id: 'node-2',
    stepNumber: 2,
    label: 'Preliminary Budget Assembly',
    description:
      'Build a rough order-of-magnitude budget from benchmarks and early design assumptions to test viability.',
    phaseId: 'plan',
    stageId: 'investigate',
    personaId: 'profit-protectors',
    isMilestone: false,
    dataTypes: ['Budgets'],
    tools: ['Procore Financials', 'Sage'],
    relatedNodeIds: ['node-1', 'node-4'],
  },
  {
    id: 'node-3',
    stepNumber: 1,
    label: 'Schedule Benchmarking',
    description:
      'Establish high-level schedule assumptions based on comparable projects and known regulatory timelines.',
    phaseId: 'plan',
    stageId: 'investigate',
    personaId: 'performance-optimizers',
    isMilestone: false,
    dataTypes: ['Schedules'],
    tools: ['Procore Schedule', 'Primavera P6'],
    relatedNodeIds: ['node-1', 'node-5'],
  },
  {
    id: 'node-4',
    stepNumber: 2,
    label: 'Due Diligence Checklist',
    description:
      'Compile legal, environmental, and title due diligence items. Track completion status across advisors.',
    phaseId: 'plan',
    stageId: 'investigate',
    personaId: 'detail-detectives',
    isMilestone: false,
    dataTypes: ['Reports', 'Contracts'],
    tools: ['Procore Documents', 'DocuSign'],
    relatedNodeIds: ['node-2', 'node-6'],
  },
  {
    id: 'node-5',
    stepNumber: 2,
    label: 'Stakeholder Alignment',
    description:
      'Coordinate with internal stakeholders, capital partners, and advisors to align on project parameters.',
    phaseId: 'plan',
    stageId: 'investigate',
    personaId: 'process-facilitators',
    isMilestone: false,
    dataTypes: ['Reports'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['node-3', 'node-7'],
  },
  {
    id: 'node-6',
    stepNumber: 3,
    label: 'LOI Signed',
    description: 'Letter of Intent executed with landowner or seller, locking key economic terms.',
    phaseId: 'plan',
    stageId: 'investigate',
    personaId: 'profit-protectors',
    isMilestone: true,
    milestoneLabel: 'LOI Signed',
    dataTypes: ['Contracts'],
    tools: ['DocuSign'],
    relatedNodeIds: ['node-4', 'node-8'],
  },

  // ── Feasibility Stage ────────────────────────────────────────────────────

  {
    id: 'node-7',
    stepNumber: 4,
    label: 'Pro Forma Modeling',
    description:
      'Develop detailed financial model covering returns, IRR, equity waterfall, and debt service coverage.',
    phaseId: 'plan',
    stageId: 'feasibility',
    personaId: 'profit-protectors',
    isMilestone: false,
    dataTypes: ['Budgets', 'Reports'],
    tools: ['Procore Financials', 'Sage'],
    relatedNodeIds: ['node-6', 'node-9'],
  },
  {
    id: 'node-8',
    stepNumber: 4,
    label: 'Design Concept Review',
    description:
      'Evaluate schematic design options against program requirements and cost targets.',
    phaseId: 'plan',
    stageId: 'feasibility',
    personaId: 'detail-detectives',
    isMilestone: false,
    dataTypes: ['Reports'],
    tools: ['Bluebeam', 'Procore Documents'],
    relatedNodeIds: ['node-6', 'node-10'],
  },
  {
    id: 'node-9',
    stepNumber: 5,
    label: 'Risk Register Creation',
    description:
      'Identify project risks, assign owners, and quantify financial exposure for each risk item.',
    phaseId: 'plan',
    stageId: 'feasibility',
    personaId: 'detail-detectives',
    isMilestone: false,
    dataTypes: ['Reports'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['node-7', 'node-11'],
  },
  {
    id: 'node-10',
    stepNumber: 5,
    label: 'Schedule Refinement',
    description:
      'Develop detailed pre-construction and construction schedule tied to financing milestones.',
    phaseId: 'plan',
    stageId: 'feasibility',
    personaId: 'performance-optimizers',
    isMilestone: false,
    dataTypes: ['Schedules'],
    tools: ['Procore Schedule', 'Primavera P6'],
    relatedNodeIds: ['node-8', 'node-12'],
  },
  {
    id: 'node-11',
    stepNumber: 6,
    label: 'Project Approved',
    description: 'Investment committee or board approval received. Project moves to active development.',
    phaseId: 'plan',
    stageId: 'feasibility',
    personaId: 'profit-protectors',
    isMilestone: true,
    milestoneLabel: 'Project Approved',
    dataTypes: ['Reports', 'Contracts'],
    tools: ['DocuSign', 'Procore Documents'],
    relatedNodeIds: ['node-9', 'node-13'],
  },

  // ── Pre-Development Stage ────────────────────────────────────────────────

  {
    id: 'node-12',
    stepNumber: 7,
    label: 'Entitlement & Permitting',
    description:
      'Navigate zoning approvals, variance hearings, and building permit applications.',
    phaseId: 'plan',
    stageId: 'pre-development',
    personaId: 'process-facilitators',
    isMilestone: false,
    dataTypes: ['Reports', 'Contracts'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['node-11', 'node-13'],
  },
  {
    id: 'node-13',
    stepNumber: 7,
    label: 'Design Development',
    description:
      'Advance construction documents from design development through 100% CDs with full coordination.',
    phaseId: 'plan',
    stageId: 'pre-development',
    personaId: 'detail-detectives',
    isMilestone: false,
    dataTypes: ['Reports'],
    tools: ['Bluebeam', 'Procore Drawings', 'Procore Documents'],
    relatedNodeIds: ['node-11', 'node-14'],
  },
  {
    id: 'node-14',
    stepNumber: 8,
    label: 'GMP Negotiation',
    description:
      'Negotiate Guaranteed Maximum Price with general contractor. Validate against budget and pro forma.',
    phaseId: 'plan',
    stageId: 'pre-development',
    personaId: 'profit-protectors',
    isMilestone: false,
    dataTypes: ['Budgets', 'Contracts'],
    tools: ['Procore Financials', 'DocuSign'],
    relatedNodeIds: ['node-13', 'node-15'],
  },
  {
    id: 'node-15',
    stepNumber: 9,
    label: 'Contracts Awarded',
    description: 'GC and major trade contracts executed. Project team finalized.',
    phaseId: 'plan',
    stageId: 'pre-development',
    personaId: 'process-facilitators',
    isMilestone: true,
    milestoneLabel: 'Contracts Awarded',
    dataTypes: ['Contracts'],
    tools: ['DocuSign', 'Procore Documents'],
    relatedNodeIds: ['node-14', 'node-16'],
  },
  {
    id: 'node-16',
    stepNumber: 10,
    label: 'Funding Secured + NTP',
    description:
      'Construction loan closed. Notice to Proceed issued to general contractor.',
    phaseId: 'plan',
    stageId: 'pre-development',
    personaId: 'profit-protectors',
    isMilestone: true,
    milestoneLabel: 'Funding Secured + NTP',
    dataTypes: ['Contracts', 'Budgets'],
    tools: ['Procore Financials', 'DocuSign', 'Sage'],
    relatedNodeIds: ['node-15', 'node-17'],
  },

  // ── Construction Stage ───────────────────────────────────────────────────

  {
    id: 'node-17',
    stepNumber: 11,
    label: 'Mobilization + Groundbreaking',
    description:
      'GC mobilizes on site. Groundbreaking ceremony. Site logistics and safety plans activated.',
    phaseId: 'build',
    stageId: 'construction',
    personaId: 'performance-optimizers',
    isMilestone: true,
    milestoneLabel: 'Mobilization + Groundbreaking',
    dataTypes: ['Schedules'],
    tools: ['Procore Schedule'],
    relatedNodeIds: ['node-16', 'node-18'],
  },
  {
    id: 'node-18',
    stepNumber: 12,
    label: 'Budget Tracking & Draw Management',
    description:
      'Monitor committed costs, approve pay applications, and submit draw requests to construction lender.',
    phaseId: 'build',
    stageId: 'construction',
    personaId: 'profit-protectors',
    isMilestone: false,
    dataTypes: ['Budgets', 'Reports'],
    tools: ['Procore Financials', 'Sage'],
    relatedNodeIds: ['node-17', 'node-19'],
  },
  {
    id: 'node-19',
    stepNumber: 13,
    label: 'Schedule Performance Review',
    description:
      'Weekly look-ahead review. Identify float erosion and critical path risks. Approve recovery plans.',
    phaseId: 'build',
    stageId: 'construction',
    personaId: 'performance-optimizers',
    isMilestone: false,
    dataTypes: ['Schedules', 'Reports'],
    tools: ['Procore Schedule', 'Primavera P6'],
    relatedNodeIds: ['node-18', 'node-20'],
  },
  {
    id: 'node-20',
    stepNumber: 14,
    label: 'Change Order Management',
    description:
      'Review and approve/reject change order proposals. Validate against contingency. Update budget forecast.',
    phaseId: 'build',
    stageId: 'construction',
    personaId: 'detail-detectives',
    isMilestone: false,
    dataTypes: ['Change Orders', 'Budgets'],
    tools: ['Procore Financials'],
    relatedNodeIds: ['node-19', 'node-21'],
  },
  {
    id: 'node-21',
    stepNumber: 15,
    label: 'Quality & Safety Inspections',
    description:
      'Conduct owner quality inspections and review safety audit reports. Track open non-conformances.',
    phaseId: 'build',
    stageId: 'construction',
    personaId: 'process-facilitators',
    isMilestone: false,
    dataTypes: ['Inspections', 'Reports'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['node-20', 'node-22'],
  },

  // ── Closeout Stage ───────────────────────────────────────────────────────

  {
    id: 'node-22',
    stepNumber: 16,
    label: 'Punch List Compilation',
    description:
      'Compile and distribute punch list items to GC. Track completion rates against closeout schedule.',
    phaseId: 'operate',
    stageId: 'closeout',
    personaId: 'detail-detectives',
    isMilestone: false,
    dataTypes: ['Inspections', 'Reports'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['node-21', 'node-23'],
  },
  {
    id: 'node-23',
    stepNumber: 17,
    label: 'Final Inspections',
    description:
      'Coordinate building department, fire marshal, and specialty inspections. Track approval statuses.',
    phaseId: 'operate',
    stageId: 'closeout',
    personaId: 'process-facilitators',
    isMilestone: false,
    dataTypes: ['Inspections'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['node-22', 'node-24'],
  },
  {
    id: 'node-24',
    stepNumber: 18,
    label: 'Certificate of Occupancy',
    description: 'Certificate of Occupancy obtained from the authority having jurisdiction.',
    phaseId: 'operate',
    stageId: 'closeout',
    personaId: 'performance-optimizers',
    isMilestone: true,
    milestoneLabel: 'Certificate of Occupancy',
    dataTypes: ['Inspections', 'Contracts'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['node-23', 'node-25'],
  },
  {
    id: 'node-25',
    stepNumber: 19,
    label: 'Substantial Completion',
    description:
      'Architect issues certificate of substantial completion. Retainage release clock starts.',
    phaseId: 'operate',
    stageId: 'closeout',
    personaId: 'profit-protectors',
    isMilestone: true,
    milestoneLabel: 'Substantial Completion',
    dataTypes: ['Contracts', 'Budgets'],
    tools: ['Procore Financials', 'DocuSign'],
    relatedNodeIds: ['node-24', 'node-26'],
  },

  // ── Handover Stage ───────────────────────────────────────────────────────

  {
    id: 'node-26',
    stepNumber: 20,
    label: 'As-Built Documentation',
    description:
      'Collect, review, and archive as-built drawings, O&M manuals, and warranty documentation.',
    phaseId: 'operate',
    stageId: 'handover',
    personaId: 'detail-detectives',
    isMilestone: false,
    dataTypes: ['Reports', 'Contracts'],
    tools: ['Procore Documents', 'Procore Drawings'],
    relatedNodeIds: ['node-25', 'node-27'],
  },
  {
    id: 'node-27',
    stepNumber: 20,
    label: 'Warranty Activation',
    description:
      'Register equipment warranties. Set up maintenance schedules and service contracts.',
    phaseId: 'operate',
    stageId: 'handover',
    personaId: 'process-facilitators',
    isMilestone: false,
    dataTypes: ['Contracts'],
    tools: ['Procore Documents', 'DocuSign'],
    relatedNodeIds: ['node-26', 'node-28'],
  },
  {
    id: 'node-28',
    stepNumber: 21,
    label: 'Project Handover',
    description:
      'Formal handover of asset to operations team or new owner. Final project cost reconciliation completed.',
    phaseId: 'operate',
    stageId: 'handover',
    personaId: 'profit-protectors',
    isMilestone: true,
    milestoneLabel: 'Project Handover',
    dataTypes: ['Reports', 'Contracts', 'Budgets'],
    tools: ['Procore Financials', 'Procore Documents', 'DocuSign'],
    relatedNodeIds: ['node-26', 'node-27'],
  },
]

// ── GC NODES ──────────────────────────────────────────────────────────────────

const gcNodes: JourneyNode[] = [
  // ── GC Investigate ───────────────────────────────────────────────────────
  {
    id: 'gc-node-1',
    stepNumber: 1,
    label: 'Project Pursuit Screening',
    description: 'Review bid opportunities, evaluate project fit against core competencies and capacity, and make go/no-go pursuit decision.',
    phaseId: 'gc-plan',
    stageId: 'gc-investigate',
    personaId: 'gc-preconstruction',
    isMilestone: false,
    dataTypes: ['Reports'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['gc-node-2'],
  },
  {
    id: 'gc-node-2',
    stepNumber: 2,
    label: 'Scope & Risk Assessment',
    description: 'Evaluate project scope complexity, identify construction risks, and assess owner and design team track record.',
    phaseId: 'gc-plan',
    stageId: 'gc-investigate',
    personaId: 'gc-project-manager',
    isMilestone: false,
    dataTypes: ['Reports'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['gc-node-1', 'gc-node-3'],
  },
  {
    id: 'gc-node-3',
    stepNumber: 3,
    label: 'Pursuit Decision',
    description: 'Leadership approves pursuit. Assigns estimating and preconstruction resources to the bid.',
    phaseId: 'gc-plan',
    stageId: 'gc-investigate',
    personaId: 'gc-preconstruction',
    isMilestone: true,
    milestoneLabel: 'Pursuit Decision',
    dataTypes: ['Reports'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['gc-node-2', 'gc-node-4'],
  },

  // ── GC Feasibility ───────────────────────────────────────────────────────
  {
    id: 'gc-node-4',
    stepNumber: 4,
    label: 'Conceptual Estimate',
    description: 'Develop order-of-magnitude cost estimate from available design documents or square-foot benchmarks.',
    phaseId: 'gc-plan',
    stageId: 'gc-feasibility',
    personaId: 'gc-preconstruction',
    isMilestone: false,
    dataTypes: ['Budgets'],
    tools: ['Procore Financials'],
    relatedNodeIds: ['gc-node-3', 'gc-node-5'],
  },
  {
    id: 'gc-node-5',
    stepNumber: 5,
    label: 'Constructability Review',
    description: 'Assess design documents for buildability issues, coordination conflicts, and schedule risk items.',
    phaseId: 'gc-plan',
    stageId: 'gc-feasibility',
    personaId: 'gc-superintendent',
    isMilestone: false,
    dataTypes: ['Reports'],
    tools: ['Bluebeam', 'Procore Drawings'],
    relatedNodeIds: ['gc-node-4', 'gc-node-6'],
  },
  {
    id: 'gc-node-6',
    stepNumber: 6,
    label: 'Bid Submitted',
    description: 'Final bid package assembled and submitted. GMP or lump-sum proposal delivered to owner.',
    phaseId: 'gc-plan',
    stageId: 'gc-feasibility',
    personaId: 'gc-preconstruction',
    isMilestone: true,
    milestoneLabel: 'Bid Submitted',
    dataTypes: ['Budgets', 'Contracts'],
    tools: ['Procore Financials', 'DocuSign'],
    relatedNodeIds: ['gc-node-5', 'gc-node-7'],
  },

  // ── GC Pre-Development ───────────────────────────────────────────────────
  {
    id: 'gc-node-7',
    stepNumber: 7,
    label: 'Contract Execution',
    description: 'GC and owner negotiate and execute prime contract. Insurance, bonds, and schedule of values finalized.',
    phaseId: 'gc-plan',
    stageId: 'gc-pre-development',
    personaId: 'gc-project-manager',
    isMilestone: true,
    milestoneLabel: 'Contract Executed',
    dataTypes: ['Contracts'],
    tools: ['DocuSign', 'Procore Documents'],
    relatedNodeIds: ['gc-node-6', 'gc-node-8'],
  },
  {
    id: 'gc-node-8',
    stepNumber: 8,
    label: 'Subcontractor Buyout',
    description: 'Solicit bids from specialty trades, evaluate proposals, negotiate scopes, and execute subcontracts.',
    phaseId: 'gc-plan',
    stageId: 'gc-pre-development',
    personaId: 'gc-project-manager',
    isMilestone: false,
    dataTypes: ['Contracts', 'Budgets'],
    tools: ['Procore Financials', 'Procore Documents'],
    relatedNodeIds: ['gc-node-7', 'gc-node-9'],
  },
  {
    id: 'gc-node-9',
    stepNumber: 9,
    label: 'Mobilization Readiness',
    description: 'Site logistics plan finalized, permits obtained, safety plan approved, and project kickoff completed.',
    phaseId: 'gc-plan',
    stageId: 'gc-pre-development',
    personaId: 'gc-superintendent',
    isMilestone: true,
    milestoneLabel: 'Ready to Mobilize',
    dataTypes: ['Reports', 'Schedules'],
    tools: ['Procore Schedule', 'Procore Documents'],
    relatedNodeIds: ['gc-node-8', 'gc-node-10'],
  },

  // ── GC Construction ──────────────────────────────────────────────────────
  // Migrated from owners journey
  {
    id: 'gc-node-10',
    stepNumber: 10,
    label: 'Site Setup & Logistics',
    description:
      'GC establishes site office, safety protocols, material staging areas, and subcontractor coordination.',
    phaseId: 'gc-build',
    stageId: 'gc-construction',
    personaId: 'gc-superintendent',
    isMilestone: false,
    dataTypes: ['Schedules', 'Reports'],
    tools: ['Procore Schedule', 'Procore Documents'],
    relatedNodeIds: ['gc-node-9', 'gc-node-11'],
  },
  {
    id: 'gc-node-11',
    stepNumber: 11,
    label: 'Subcontractor Coordination',
    description:
      'GC manages subcontractor schedules, submittals, and daily field coordination.',
    phaseId: 'gc-build',
    stageId: 'gc-construction',
    personaId: 'gc-superintendent',
    isMilestone: false,
    dataTypes: ['Schedules', 'RFIs'],
    tools: ['Procore RFIs', 'Procore Schedule'],
    relatedNodeIds: ['gc-node-10', 'gc-node-12'],
  },
  {
    id: 'gc-node-12',
    stepNumber: 12,
    label: 'RFI & Submittal Processing',
    description:
      'GC issues RFIs and submittals for architect review. Tracks responses against schedule impact.',
    phaseId: 'gc-build',
    stageId: 'gc-construction',
    personaId: 'gc-project-manager',
    isMilestone: false,
    dataTypes: ['RFIs'],
    tools: ['Procore RFIs', 'Procore Documents'],
    relatedNodeIds: ['gc-node-11', 'gc-node-13'],
  },
  {
    id: 'gc-node-13',
    stepNumber: 13,
    label: 'Pay Application Processing',
    description: 'Prepare and submit monthly pay applications. Track owner approval and lender draw status.',
    phaseId: 'gc-build',
    stageId: 'gc-construction',
    personaId: 'gc-project-manager',
    isMilestone: false,
    dataTypes: ['Budgets'],
    tools: ['Procore Financials'],
    relatedNodeIds: ['gc-node-12', 'gc-node-14'],
  },
  {
    id: 'gc-node-14',
    stepNumber: 14,
    label: 'Substantial Completion Walkthrough',
    description: 'Conduct owner and architect walkthrough. Document punch list items and confirm completion criteria.',
    phaseId: 'gc-build',
    stageId: 'gc-construction',
    personaId: 'gc-superintendent',
    isMilestone: true,
    milestoneLabel: 'Substantial Completion',
    dataTypes: ['Inspections', 'Reports'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['gc-node-13', 'gc-node-15'],
  },

  // ── GC Closeout ──────────────────────────────────────────────────────────
  {
    id: 'gc-node-15',
    stepNumber: 15,
    label: 'Punch List Resolution',
    description: 'Assign and track all punch list items to subcontractors. Confirm completion with architect.',
    phaseId: 'gc-operate',
    stageId: 'gc-closeout',
    personaId: 'gc-superintendent',
    isMilestone: false,
    dataTypes: ['Inspections', 'Reports'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['gc-node-14', 'gc-node-16'],
  },
  {
    id: 'gc-node-16',
    stepNumber: 16,
    label: 'Closeout Document Package',
    description: 'Compile as-builts, O&M manuals, warranties, and attic stock. Deliver complete package to owner.',
    phaseId: 'gc-operate',
    stageId: 'gc-closeout',
    personaId: 'gc-project-manager',
    isMilestone: false,
    dataTypes: ['Reports', 'Contracts'],
    tools: ['Procore Documents', 'Procore Drawings'],
    relatedNodeIds: ['gc-node-15', 'gc-node-17'],
  },
  {
    id: 'gc-node-17',
    stepNumber: 17,
    label: 'Certificate of Occupancy',
    description: 'CO obtained. Owner accepts building. Substantial completion certificate issued.',
    phaseId: 'gc-operate',
    stageId: 'gc-closeout',
    personaId: 'gc-project-manager',
    isMilestone: true,
    milestoneLabel: 'Certificate of Occupancy',
    dataTypes: ['Inspections', 'Contracts'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['gc-node-16', 'gc-node-18'],
  },

  // ── GC Handover ──────────────────────────────────────────────────────────
  {
    id: 'gc-node-18',
    stepNumber: 18,
    label: 'Warranty Activation',
    description: 'Register equipment and system warranties. Schedule training sessions for owner facility team.',
    phaseId: 'gc-operate',
    stageId: 'gc-handover',
    personaId: 'gc-project-manager',
    isMilestone: false,
    dataTypes: ['Contracts'],
    tools: ['Procore Documents', 'DocuSign'],
    relatedNodeIds: ['gc-node-17', 'gc-node-19'],
  },
  {
    id: 'gc-node-19',
    stepNumber: 19,
    label: 'Final Payment & Retainage Release',
    description: 'Submit final application for payment. Lien releases collected from all subs. Retainage released.',
    phaseId: 'gc-operate',
    stageId: 'gc-handover',
    personaId: 'gc-project-manager',
    isMilestone: true,
    milestoneLabel: 'Final Payment',
    dataTypes: ['Budgets', 'Contracts'],
    tools: ['Procore Financials', 'DocuSign'],
    relatedNodeIds: ['gc-node-18'],
  },
]

// ── SC NODES (stub) ───────────────────────────────────────────────────────────

const scNodes: JourneyNode[] = [
  // ── SC Investigate ───────────────────────────────────────────────────────
  {
    id: 'sc-node-1',
    stepNumber: 1,
    label: 'Bid Opportunity Review',
    description: 'Review invitation to bid, evaluate project scope fit, and decide whether to pursue.',
    phaseId: 'sc-plan',
    stageId: 'sc-investigate',
    personaId: 'sc-estimator',
    isMilestone: false,
    dataTypes: ['Reports'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['sc-node-2'],
  },
  {
    id: 'sc-node-2',
    stepNumber: 2,
    label: 'Scope Clarification',
    description: 'Review bid documents, issue RFIs to GC, and attend pre-bid site walk.',
    phaseId: 'sc-plan',
    stageId: 'sc-investigate',
    personaId: 'sc-estimator',
    isMilestone: false,
    dataTypes: ['RFIs'],
    tools: ['Procore RFIs', 'Procore Documents'],
    relatedNodeIds: ['sc-node-1', 'sc-node-3'],
  },
  {
    id: 'sc-node-3',
    stepNumber: 3,
    label: 'Pursuit Decision',
    description: 'Leadership approves pursuit and assigns estimating resources.',
    phaseId: 'sc-plan',
    stageId: 'sc-investigate',
    personaId: 'sc-project-manager',
    isMilestone: true,
    milestoneLabel: 'Pursuit Decision',
    dataTypes: ['Reports'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['sc-node-2', 'sc-node-4'],
  },

  // ── SC Feasibility ───────────────────────────────────────────────────────
  {
    id: 'sc-node-4',
    stepNumber: 4,
    label: 'Quantity Takeoff',
    description: 'Perform detailed material and labor takeoffs for specialty scope.',
    phaseId: 'sc-plan',
    stageId: 'sc-feasibility',
    personaId: 'sc-estimator',
    isMilestone: false,
    dataTypes: ['Budgets'],
    tools: ['Bluebeam', 'Procore Drawings'],
    relatedNodeIds: ['sc-node-3', 'sc-node-5'],
  },
  {
    id: 'sc-node-5',
    stepNumber: 5,
    label: 'Bid Assembly',
    description: 'Price materials, labor, equipment, and subcontractors. Apply markup and finalize bid.',
    phaseId: 'sc-plan',
    stageId: 'sc-feasibility',
    personaId: 'sc-estimator',
    isMilestone: false,
    dataTypes: ['Budgets'],
    tools: ['Procore Financials'],
    relatedNodeIds: ['sc-node-4', 'sc-node-6'],
  },
  {
    id: 'sc-node-6',
    stepNumber: 6,
    label: 'Bid Submitted to GC',
    description: 'Final bid proposal submitted to general contractor.',
    phaseId: 'sc-plan',
    stageId: 'sc-feasibility',
    personaId: 'sc-estimator',
    isMilestone: true,
    milestoneLabel: 'Bid Submitted',
    dataTypes: ['Budgets', 'Contracts'],
    tools: ['Procore Financials'],
    relatedNodeIds: ['sc-node-5', 'sc-node-7'],
  },

  // ── SC Pre-Development ───────────────────────────────────────────────────
  {
    id: 'sc-node-7',
    stepNumber: 7,
    label: 'Subcontract Execution',
    description: 'Negotiate and execute subcontract with GC. Review scope, schedule, and payment terms.',
    phaseId: 'sc-plan',
    stageId: 'sc-pre-development',
    personaId: 'sc-project-manager',
    isMilestone: true,
    milestoneLabel: 'Subcontract Executed',
    dataTypes: ['Contracts'],
    tools: ['DocuSign', 'Procore Documents'],
    relatedNodeIds: ['sc-node-6', 'sc-node-8'],
  },
  {
    id: 'sc-node-8',
    stepNumber: 8,
    label: 'Material Procurement',
    description: 'Place material orders, track lead times, and coordinate delivery schedule with GC.',
    phaseId: 'sc-plan',
    stageId: 'sc-pre-development',
    personaId: 'sc-project-manager',
    isMilestone: false,
    dataTypes: ['Schedules'],
    tools: ['Procore Schedule', 'Procore Documents'],
    relatedNodeIds: ['sc-node-7', 'sc-node-9'],
  },
  {
    id: 'sc-node-9',
    stepNumber: 9,
    label: 'Submittal Package',
    description: 'Prepare and submit product data, shop drawings, and samples for architect approval.',
    phaseId: 'sc-plan',
    stageId: 'sc-pre-development',
    personaId: 'sc-project-manager',
    isMilestone: false,
    dataTypes: ['RFIs'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['sc-node-8', 'sc-node-10'],
  },

  // ── SC Construction ──────────────────────────────────────────────────────
  {
    id: 'sc-node-10',
    stepNumber: 10,
    label: 'Crew Mobilization',
    description: 'Deploy crew to site. Conduct safety orientation and review site logistics with GC superintendent.',
    phaseId: 'sc-build',
    stageId: 'sc-construction',
    personaId: 'sc-foreman',
    isMilestone: true,
    milestoneLabel: 'Mobilized',
    dataTypes: ['Schedules'],
    tools: ['Procore Schedule'],
    relatedNodeIds: ['sc-node-9', 'sc-node-11'],
  },
  {
    id: 'sc-node-11',
    stepNumber: 11,
    label: 'Scope Execution',
    description: 'Perform specialty scope per approved drawings and specifications. Document daily progress.',
    phaseId: 'sc-build',
    stageId: 'sc-construction',
    personaId: 'sc-foreman',
    isMilestone: false,
    dataTypes: ['Reports', 'Schedules'],
    tools: ['Procore Documents', 'Procore Schedule'],
    relatedNodeIds: ['sc-node-10', 'sc-node-12'],
  },
  {
    id: 'sc-node-12',
    stepNumber: 12,
    label: 'RFI Response Tracking',
    description: 'Monitor open RFIs and submittal reviews. Escalate delays impacting installation schedule.',
    phaseId: 'sc-build',
    stageId: 'sc-construction',
    personaId: 'sc-project-manager',
    isMilestone: false,
    dataTypes: ['RFIs'],
    tools: ['Procore RFIs'],
    relatedNodeIds: ['sc-node-11', 'sc-node-13'],
  },
  {
    id: 'sc-node-13',
    stepNumber: 13,
    label: 'Pay Application Submission',
    description: 'Submit monthly pay applications to GC. Track approval status and payment receipt.',
    phaseId: 'sc-build',
    stageId: 'sc-construction',
    personaId: 'sc-project-manager',
    isMilestone: false,
    dataTypes: ['Budgets'],
    tools: ['Procore Financials'],
    relatedNodeIds: ['sc-node-12', 'sc-node-14'],
  },

  // ── SC Closeout ──────────────────────────────────────────────────────────
  {
    id: 'sc-node-14',
    stepNumber: 14,
    label: 'Punch List Completion',
    description: 'Resolve all punch list items within specialty scope. Obtain GC sign-off.',
    phaseId: 'sc-operate',
    stageId: 'sc-closeout',
    personaId: 'sc-foreman',
    isMilestone: false,
    dataTypes: ['Inspections'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['sc-node-13', 'sc-node-15'],
  },
  {
    id: 'sc-node-15',
    stepNumber: 15,
    label: 'As-Built Submission',
    description: 'Deliver marked-up as-built drawings and product data to GC for owner package.',
    phaseId: 'sc-operate',
    stageId: 'sc-closeout',
    personaId: 'sc-project-manager',
    isMilestone: false,
    dataTypes: ['Reports'],
    tools: ['Procore Drawings', 'Procore Documents'],
    relatedNodeIds: ['sc-node-14', 'sc-node-16'],
  },
  {
    id: 'sc-node-16',
    stepNumber: 16,
    label: 'Final Inspection Passed',
    description: 'Specialty scope passes final inspection. GC issues acceptance.',
    phaseId: 'sc-operate',
    stageId: 'sc-closeout',
    personaId: 'sc-project-manager',
    isMilestone: true,
    milestoneLabel: 'Final Inspection Passed',
    dataTypes: ['Inspections'],
    tools: ['Procore Documents'],
    relatedNodeIds: ['sc-node-15', 'sc-node-17'],
  },

  // ── SC Handover ──────────────────────────────────────────────────────────
  {
    id: 'sc-node-17',
    stepNumber: 17,
    label: 'Warranty Documentation',
    description: 'Compile and submit product warranties and O&M documentation to GC.',
    phaseId: 'sc-operate',
    stageId: 'sc-handover',
    personaId: 'sc-project-manager',
    isMilestone: false,
    dataTypes: ['Contracts'],
    tools: ['Procore Documents', 'DocuSign'],
    relatedNodeIds: ['sc-node-16', 'sc-node-18'],
  },
  {
    id: 'sc-node-18',
    stepNumber: 18,
    label: 'Final Payment Collection',
    description: 'Submit lien releases. Collect final payment and retainage from GC.',
    phaseId: 'sc-operate',
    stageId: 'sc-handover',
    personaId: 'sc-project-manager',
    isMilestone: true,
    milestoneLabel: 'Final Payment',
    dataTypes: ['Budgets', 'Contracts'],
    tools: ['Procore Financials', 'DocuSign'],
    relatedNodeIds: ['sc-node-17'],
  },
]

/** All nodes across all audiences */
export const journeyNodes: JourneyNode[] = [...ownerNodes, ...gcNodes, ...scNodes]

// ─── Journey Edges ───────────────────────────────────────────────────────────

const ownerEdges: JourneyEdge[] = [
  // Investigate: within lanes
  { id: 'e-1-2', sourceNodeId: 'node-1', targetNodeId: 'node-2', crossLane: false },
  { id: 'e-3-5', sourceNodeId: 'node-3', targetNodeId: 'node-5', crossLane: false },
  { id: 'e-4-6', sourceNodeId: 'node-4', targetNodeId: 'node-6', crossLane: false },

  // Investigate: cross-lane
  { id: 'e-1-3', sourceNodeId: 'node-1', targetNodeId: 'node-3', crossLane: true },
  { id: 'e-2-4', sourceNodeId: 'node-2', targetNodeId: 'node-4', crossLane: true },
  { id: 'e-5-6', sourceNodeId: 'node-5', targetNodeId: 'node-6', crossLane: true },
  { id: 'e-2-6', sourceNodeId: 'node-2', targetNodeId: 'node-6', crossLane: false },

  // Feasibility: within lanes
  { id: 'e-7-11', sourceNodeId: 'node-7', targetNodeId: 'node-11', crossLane: false },
  { id: 'e-9-11', sourceNodeId: 'node-9', targetNodeId: 'node-11', crossLane: false },
  { id: 'e-10-12', sourceNodeId: 'node-10', targetNodeId: 'node-12', crossLane: false },

  // Feasibility: cross-lane
  { id: 'e-6-7', sourceNodeId: 'node-6', targetNodeId: 'node-7', crossLane: false },
  { id: 'e-6-8', sourceNodeId: 'node-6', targetNodeId: 'node-8', crossLane: true },
  { id: 'e-7-9', sourceNodeId: 'node-7', targetNodeId: 'node-9', crossLane: true },
  { id: 'e-8-10', sourceNodeId: 'node-8', targetNodeId: 'node-10', crossLane: true },

  // Pre-Development: within lanes
  { id: 'e-11-12', sourceNodeId: 'node-11', targetNodeId: 'node-12', crossLane: false },
  { id: 'e-13-14', sourceNodeId: 'node-13', targetNodeId: 'node-14', crossLane: true },
  { id: 'e-14-15', sourceNodeId: 'node-14', targetNodeId: 'node-15', crossLane: true },
  { id: 'e-15-16', sourceNodeId: 'node-15', targetNodeId: 'node-16', crossLane: false },

  // Pre-Dev cross-lane
  { id: 'e-11-13', sourceNodeId: 'node-11', targetNodeId: 'node-13', crossLane: true },

  // Construction: within lanes
  { id: 'e-16-17', sourceNodeId: 'node-16', targetNodeId: 'node-17', crossLane: false },
  { id: 'e-17-18', sourceNodeId: 'node-17', targetNodeId: 'node-18', crossLane: false },
  { id: 'e-18-19', sourceNodeId: 'node-18', targetNodeId: 'node-19', crossLane: true },
  { id: 'e-19-20', sourceNodeId: 'node-19', targetNodeId: 'node-20', crossLane: true },
  { id: 'e-20-21', sourceNodeId: 'node-20', targetNodeId: 'node-21', crossLane: true },

  // Closeout
  { id: 'e-21-22', sourceNodeId: 'node-21', targetNodeId: 'node-22', crossLane: false },
  { id: 'e-22-23', sourceNodeId: 'node-22', targetNodeId: 'node-23', crossLane: true },
  { id: 'e-23-24', sourceNodeId: 'node-23', targetNodeId: 'node-24', crossLane: true },
  { id: 'e-24-25', sourceNodeId: 'node-24', targetNodeId: 'node-25', crossLane: true },

  // Handover
  { id: 'e-25-26', sourceNodeId: 'node-25', targetNodeId: 'node-26', crossLane: false },
  { id: 'e-26-27', sourceNodeId: 'node-26', targetNodeId: 'node-27', crossLane: true },
  { id: 'e-27-28', sourceNodeId: 'node-27', targetNodeId: 'node-28', crossLane: true },
  { id: 'e-26-28', sourceNodeId: 'node-26', targetNodeId: 'node-28', crossLane: false },
]

const gcEdges: JourneyEdge[] = [
  // GC Investigate
  { id: 'gc-e-1-2', sourceNodeId: 'gc-node-1', targetNodeId: 'gc-node-2', crossLane: false },
  { id: 'gc-e-2-3', sourceNodeId: 'gc-node-2', targetNodeId: 'gc-node-3', crossLane: true },

  // GC Feasibility
  { id: 'gc-e-3-4', sourceNodeId: 'gc-node-3', targetNodeId: 'gc-node-4', crossLane: false },
  { id: 'gc-e-4-5', sourceNodeId: 'gc-node-4', targetNodeId: 'gc-node-5', crossLane: true },
  { id: 'gc-e-5-6', sourceNodeId: 'gc-node-5', targetNodeId: 'gc-node-6', crossLane: true },

  // GC Pre-Development
  { id: 'gc-e-6-7', sourceNodeId: 'gc-node-6', targetNodeId: 'gc-node-7', crossLane: false },
  { id: 'gc-e-7-8', sourceNodeId: 'gc-node-7', targetNodeId: 'gc-node-8', crossLane: false },
  { id: 'gc-e-8-9', sourceNodeId: 'gc-node-8', targetNodeId: 'gc-node-9', crossLane: true },

  // GC Construction
  { id: 'gc-e-9-10', sourceNodeId: 'gc-node-9', targetNodeId: 'gc-node-10', crossLane: false },
  { id: 'gc-e-10-11', sourceNodeId: 'gc-node-10', targetNodeId: 'gc-node-11', crossLane: false },
  { id: 'gc-e-11-12', sourceNodeId: 'gc-node-11', targetNodeId: 'gc-node-12', crossLane: true },
  { id: 'gc-e-12-13', sourceNodeId: 'gc-node-12', targetNodeId: 'gc-node-13', crossLane: true },
  { id: 'gc-e-13-14', sourceNodeId: 'gc-node-13', targetNodeId: 'gc-node-14', crossLane: true },

  // GC Closeout
  { id: 'gc-e-14-15', sourceNodeId: 'gc-node-14', targetNodeId: 'gc-node-15', crossLane: false },
  { id: 'gc-e-15-16', sourceNodeId: 'gc-node-15', targetNodeId: 'gc-node-16', crossLane: true },
  { id: 'gc-e-16-17', sourceNodeId: 'gc-node-16', targetNodeId: 'gc-node-17', crossLane: true },

  // GC Handover
  { id: 'gc-e-17-18', sourceNodeId: 'gc-node-17', targetNodeId: 'gc-node-18', crossLane: false },
  { id: 'gc-e-18-19', sourceNodeId: 'gc-node-18', targetNodeId: 'gc-node-19', crossLane: false },
]

const scEdges: JourneyEdge[] = [
  // SC Investigate
  { id: 'sc-e-1-2', sourceNodeId: 'sc-node-1', targetNodeId: 'sc-node-2', crossLane: false },
  { id: 'sc-e-2-3', sourceNodeId: 'sc-node-2', targetNodeId: 'sc-node-3', crossLane: true },

  // SC Feasibility
  { id: 'sc-e-3-4', sourceNodeId: 'sc-node-3', targetNodeId: 'sc-node-4', crossLane: false },
  { id: 'sc-e-4-5', sourceNodeId: 'sc-node-4', targetNodeId: 'sc-node-5', crossLane: false },
  { id: 'sc-e-5-6', sourceNodeId: 'sc-node-5', targetNodeId: 'sc-node-6', crossLane: false },

  // SC Pre-Development
  { id: 'sc-e-6-7', sourceNodeId: 'sc-node-6', targetNodeId: 'sc-node-7', crossLane: false },
  { id: 'sc-e-7-8', sourceNodeId: 'sc-node-7', targetNodeId: 'sc-node-8', crossLane: false },
  { id: 'sc-e-8-9', sourceNodeId: 'sc-node-8', targetNodeId: 'sc-node-9', crossLane: false },

  // SC Construction
  { id: 'sc-e-9-10', sourceNodeId: 'sc-node-9', targetNodeId: 'sc-node-10', crossLane: false },
  { id: 'sc-e-10-11', sourceNodeId: 'sc-node-10', targetNodeId: 'sc-node-11', crossLane: true },
  { id: 'sc-e-11-12', sourceNodeId: 'sc-node-11', targetNodeId: 'sc-node-12', crossLane: true },
  { id: 'sc-e-12-13', sourceNodeId: 'sc-node-12', targetNodeId: 'sc-node-13', crossLane: true },

  // SC Closeout
  { id: 'sc-e-13-14', sourceNodeId: 'sc-node-13', targetNodeId: 'sc-node-14', crossLane: true },
  { id: 'sc-e-14-15', sourceNodeId: 'sc-node-14', targetNodeId: 'sc-node-15', crossLane: true },
  { id: 'sc-e-15-16', sourceNodeId: 'sc-node-15', targetNodeId: 'sc-node-16', crossLane: false },

  // SC Handover
  { id: 'sc-e-16-17', sourceNodeId: 'sc-node-16', targetNodeId: 'sc-node-17', crossLane: false },
  { id: 'sc-e-17-18', sourceNodeId: 'sc-node-17', targetNodeId: 'sc-node-18', crossLane: false },
]

/** All edges across all audiences */
export const journeyEdges: JourneyEdge[] = [...ownerEdges, ...gcEdges, ...scEdges]

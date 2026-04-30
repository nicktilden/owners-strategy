export type TierType = "Net New" | "Enhancement" | "Extension"
export type DependencyTeam = "UIF" | "Hubs" | "Platform" | "Connect"
export type RiskLevel = "Low" | "Medium" | "High"
export type ValueLevel = "Low" | "Medium" | "High"

export type RaciValue = "R" | "A" | "C" | "I" | null
export type RaciTeam = "Owner Strat" | "Owner Team" | "UIF" | "Hubs" | "Procore Connect" | "Assist" | "Tool Teams"

export type CapabilityStatus = "Not Started" | "Discovery" | "In Progress" | "Complete" | "Blocked" | "On Hold"

export type LevelOfEffort = "Small" | "Medium" | "Large" | "X-Large"

export interface Timeline {
  startDate: string // ISO date string
  endDate: string // ISO date string
  status: CapabilityStatus
}

export interface CapabilityLinks {
  onePager?: string
  figma?: string
  prototype?: string
}

export interface RaciAssignment {
  [team: string]: RaciValue
}

export interface Capability {
  id: string
  name: string
  description: string
  ownerValue: ValueLevel
  platformReadiness: ValueLevel
  businessValue: ValueLevel
  dependencies: RiskLevel
  dependencyTeams: DependencyTeam[]
  tier: TierType
  risks: string[]
  assumptions: string[]
  raci?: RaciAssignment
  timeline?: Timeline // Adding optional timeline for roadmap
  levelOfEffort?: LevelOfEffort
  links?: CapabilityLinks
  thumbnailQuery?: string
  thumbnail?: string // Added optional thumbnail URL field
}

export interface Weights {
  ownerValue: number
  platformReadiness: number
  businessValue: number
  dependencies: number
}

export interface Filters {
  teams: DependencyTeam[]
  tiers: TierType[]
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Capability, ValueLevel, RiskLevel, Weights } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueToNumber(value: ValueLevel | RiskLevel): number {
  switch (value) {
    case "Low":
      return 1
    case "Medium":
      return 2
    case "High":
      return 3
    default:
      return 2
  }
}

export function getDependencyColor(risk: RiskLevel): string {
  switch (risk) {
    case "Low":
      return "var(--success)"
    case "Medium":
      return "var(--warning)"
    case "High":
      return "var(--danger)"
    default:
      return "var(--muted-foreground)"
  }
}

export function getBubbleSize(businessValue: ValueLevel): number {
  switch (businessValue) {
    case "Low":
      return 25
    case "Medium":
      return 40
    case "High":
      return 55
    default:
      return 40
  }
}

export function calculateWeightedScore(cap: Capability, weights: Weights): number {
  const ownerScore = valueToNumber(cap.ownerValue) * (weights.ownerValue / 100)
  const platformScore = valueToNumber(cap.platformReadiness) * (weights.platformReadiness / 100)
  const businessScore = valueToNumber(cap.businessValue) * (weights.businessValue / 100)
  // For dependencies, lower is better, so we invert the score
  const dependencyScore = (4 - valueToNumber(cap.dependencies)) * (weights.dependencies / 100)

  return (ownerScore + platformScore + businessScore + dependencyScore) * 33.33
}

export function getQuadrant(ownerValue: number, platformReadiness: number): string {
  if (ownerValue >= 2 && platformReadiness >= 2) {
    return "Build Now"
  } else if (ownerValue >= 2 && platformReadiness < 2) {
    return "Sequence Carefully"
  } else if (ownerValue < 2 && platformReadiness >= 2) {
    return "Platform Investment"
  } else {
    return "Defer / Optimize"
  }
}

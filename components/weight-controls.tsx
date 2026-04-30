"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { Weights } from "@/lib/types"

interface WeightControlsProps {
  weights: Weights
  onWeightsChange: (weights: Weights) => void
}

export function WeightControls({ weights, onWeightsChange }: WeightControlsProps) {
  const handleWeightChange = (key: keyof Weights, value: number[]) => {
    onWeightsChange({ ...weights, [key]: value[0] })
  }

  const total = weights.ownerValue + weights.platformReadiness + weights.businessValue + weights.dependencies

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-1">Factor Weights</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Adjust weights to see how priorities shift. Total: {total}%
        </p>
      </div>

      <WeightSlider
        label="Owner Value"
        description="How strongly it solves customer needs"
        value={weights.ownerValue}
        onChange={(v) => handleWeightChange("ownerValue", v)}
        color="var(--primary)"
      />

      <WeightSlider
        label="Platform Readiness"
        description="Maturity of underlying platform"
        value={weights.platformReadiness}
        onChange={(v) => handleWeightChange("platformReadiness", v)}
        color="var(--chart-4)"
      />

      <WeightSlider
        label="Business Value"
        description="Impact on revenue and growth"
        value={weights.businessValue}
        onChange={(v) => handleWeightChange("businessValue", v)}
        color="var(--chart-2)"
      />

      <WeightSlider
        label="Dependencies"
        description="Cross-team coordination required"
        value={weights.dependencies}
        onChange={(v) => handleWeightChange("dependencies", v)}
        color="var(--chart-3)"
      />

      {total !== 100 && <p className="text-xs text-warning">Note: Weights sum to {total}%, not 100%</p>}
    </div>
  )
}

function WeightSlider({
  label,
  description,
  value,
  onChange,
  color,
}: {
  label: string
  description: string
  value: number
  onChange: (value: number[]) => void
  color: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm font-mono text-muted-foreground">{value}%</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={onChange}
        max={50}
        min={0}
        step={5}
        className="[&_[role=slider]]:bg-primary"
        style={{ "--slider-track-color": color } as React.CSSProperties}
      />
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

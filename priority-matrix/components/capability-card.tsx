"use client"

import Image from "next/image"
import type { Capability, CapabilityStatus, TierType, LevelOfEffort } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { FileText, Figma, Play, ExternalLink, ChevronUp, ChevronDown } from "lucide-react"

interface CapabilityCardProps {
  capability: Capability
  index: number
  thumbnailUrl: string
  expandedUrl: string
  effortData: { label: string; bars: number }
  effort: LevelOfEffort
  status: CapabilityStatus
  tierColors: Record<TierType, string>
  statusColors: Record<CapabilityStatus, string>
  dependencyColors: Record<string, string>
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function CapabilityCard({
  capability,
  index,
  thumbnailUrl,
  expandedUrl,
  effortData,
  effort,
  status,
  tierColors,
  statusColors,
  dependencyColors,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}: CapabilityCardProps) {
  return (
    <div className="group relative rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-border/80 hover:shadow-lg">
      <div className="flex">
        {/* Reorder Controls */}
        <div className="flex flex-col items-center justify-center gap-0.5 px-2 py-2 border-r border-border bg-muted/30">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={onMoveUp}
            disabled={!canMoveUp}
          >
            <ChevronUp className="h-4 w-4" />
            <span className="sr-only">Move up</span>
          </Button>
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
            {index}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={onMoveDown}
            disabled={!canMoveDown}
          >
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Move down</span>
          </Button>
        </div>
        {/* Thumbnail */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="shrink-0 w-48 h-32 relative overflow-hidden bg-muted cursor-pointer group/thumb">
              <Image
                src={thumbnailUrl || "/placeholder.svg"}
                alt={capability.name}
                fill
                className="object-cover transition-transform group-hover/thumb:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/20 transition-colors flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="p-4" style={{ maxWidth: "50rem" }}>
            <div className="relative w-full h-[80vh]">
              <Image
                src={expandedUrl || "/placeholder.svg"}
                alt={capability.name}
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">{capability.name}</p>
          </DialogContent>
        </Dialog>

        {/* Content */}
        <div className="flex-1 p-4 pl-6">
          <div className="flex items-start justify-between gap-4">
            {/* Name and Description */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-lg leading-tight">{capability.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{capability.description}</p>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {/* Tier */}
                <Badge variant="outline" className={`${tierColors[capability.tier]} text-xs`}>
                  {capability.tier}
                </Badge>

                {/* Status */}
                <Badge variant="outline" className={`${statusColors[status]} text-xs`}>
                  {status}
                </Badge>

                {/* Level of Effort */}
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-3 rounded-sm ${i <= effortData.bars ? "bg-foreground" : "bg-muted"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{effort}</span>
                </div>

                {/* Dependency Level */}
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-medium ${dependencyColors[capability.dependencies]}`}>
                    {capability.dependencies} Dependency
                  </span>
                </div>
              </div>

              {/* Dependency Teams */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-muted-foreground">Teams:</span>
                <div className="flex flex-wrap gap-1.5">
                  {capability.dependencyTeams.map((team) => (
                    <Badge key={team} variant="secondary" className="text-xs font-normal">
                      {team}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Link Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <TooltipProvider>
                {capability.links?.onePager && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-foreground"
                        asChild
                      >
                        <a href={capability.links.onePager} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">One-pager</span>
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>One-pager</TooltipContent>
                  </Tooltip>
                )}
                {capability.links?.figma && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-foreground"
                        asChild
                      >
                        <a href={capability.links.figma} target="_blank" rel="noopener noreferrer">
                          <Figma className="h-4 w-4" />
                          <span className="sr-only">Figma</span>
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Figma</TooltipContent>
                  </Tooltip>
                )}
                {capability.links?.prototype && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-foreground"
                        asChild
                      >
                        <a href={capability.links.prototype} target="_blank" rel="noopener noreferrer">
                          <Play className="h-4 w-4" />
                          <span className="sr-only">Prototype</span>
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Prototype</TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

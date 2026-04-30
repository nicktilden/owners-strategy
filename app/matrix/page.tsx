"use client"

import { useState } from "react"
import { PriorityMatrix } from "@/components/priority-matrix"
import { RaciMap } from "@/components/raci-map"
import { Sequencing } from "@/components/sequencing"
import { initialCapabilities } from "@/lib/data"
import type { Capability } from "@/lib/types"

type Tab = "priority-matrix" | "raci-map" | "sequencing"

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("priority-matrix")
  const [capabilities, setCapabilities] = useState<Capability[]>(initialCapabilities)

  const handleUpdateCapability = (updated: Capability) => {
    setCapabilities((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  }

  const tabs = [
    { id: "priority-matrix" as Tab, label: "Priority Matrix" },
    { id: "raci-map" as Tab, label: "RACI Map" },
    { id: "sequencing" as Tab, label: "Sequencing" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Ideal Owner Experience</h1>
          <p className="mt-2 text-lg text-muted-foreground text-pretty max-w-2xl">
            How owner value, business impact, and platform readiness shape what we build next.
          </p>

          <nav className="mt-6 flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {activeTab === "priority-matrix" && (
        <PriorityMatrix capabilities={capabilities} onCapabilitiesChange={setCapabilities} />
      )}
      {activeTab === "raci-map" && <RaciMap capabilities={capabilities} onUpdateCapability={handleUpdateCapability} />}
      {activeTab === "sequencing" && (
        <Sequencing capabilities={capabilities} onUpdateCapability={handleUpdateCapability} />
      )}
    </div>
  )
}

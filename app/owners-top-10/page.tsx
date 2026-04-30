"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"

// ─── Data ────────────────────────────────────────────────────────────────────

const items = [
  {
    number: "01",
    title: "Owners Think Top-Down, Not Bottom-Up",
    insight:
      "Owners live at the portfolio level. They do not care about individual project mechanics — they care about how their portfolio is performing against budget, schedule, and risk. Procore's project-centric architecture forces them to do the opposite of how they naturally think.",
    quotes: [
      {
        text: "Everything being project-based in Procore is definitely not a delightful experience for an owner, because they live and operate out of a portfolio or program-level world.",
        attribution: null,
      },
      {
        text: "I like to see the big picture and then whittle it down from there.",
        attribution: "Steve VanBrussel, National Dir., Trinity Health",
      },
    ],
    stat: { value: "10–20", unit: "hrs/month", label: "spent manually aggregating portfolio reports" },
    goal: "Manage, monitor, and compare the entire portfolio from a single rolled-up view — without navigating to the project level unless absolutely necessary.",
    solutions: [
      "Build persistent Portfolio Hubs with global page-level filters that aggregate data across regions, programs, or project types instantly",
      "Default Owner-facing views to portfolio-level, with clear drill-in paths — not the reverse",
      "Rollup KPIs: Total Budget, Schedule Performance, Pending Change Orders, Average Risk Severity",
      "Enable top-down interaction: surface context and detail to the user rather than sending them into the product",
    ],
  },
  {
    number: "02",
    title: "Unlike GCs, Owners Are Not Just Construction People",
    insight:
      "Construction is a means to an end. For Owners, the goal is a performing asset — a hospital that saves lives, a data center that processes transactions, a retail store that sells coffee. The build itself is often described as a \"necessary evil.\"",
    quotes: [
      {
        text: "Owners don't make profit on these projects. That's just fundamentally untrue.",
        attribution: "Owner interview",
      },
      {
        text: "I care most about cost and schedule because they are directly correlated with my investment and potential profit.",
        attribution: "Marcy Phillips, Managing Dir., Crescent",
      },
    ],
    stat: { value: "6", unit: "roles", label: "Translator, Advisor, Chief of Staff, Mediator, Record-Keeper, Detective — none are construction roles" },
    goal: "Get the asset operational as quickly and safely as possible so it can start generating revenue or serving its purpose.",
    solutions: [
      "Reframe product language and UX hierarchy around \"Time to Market,\" \"ROI,\" and \"Asset Performance\" — not field productivity",
      "Shift navigation from tool-centric to business-centric (Cost Management, Risk Summary, Funding)",
      "Avoid surfacing GC jargon (Prime Contracts, Subcontractor, SSOV) as default Owner terminology",
      "Treat Owners as investment managers, not project administrators",
    ],
  },
  {
    number: "03",
    title: "Owners Are Not a Monolith",
    insight:
      "\"Owner\" is not a single persona. There are meaningful differences in how Owners structure their organizations, how much construction expertise they have, and what they need from a product. One experience cannot serve all of them equally.",
    quotes: [],
    archetypes: [
      { name: "Profit Protectors", who: "CFO, VP Ops, Managing Director", cares: "ROI, financial health, board reporting", x: 25, y: 28 },
      { name: "Performance Optimizers", who: "Dir. of Construction, Portfolio Dir.", cares: "Portfolio health, risk", x: 72, y: 32 },
      { name: "Detail Detectives", who: "Portfolio Mgr., Ops Controller", cares: "Variances, change orders", x: 68, y: 72 },
      { name: "Process Facilitators", who: "IT Director, System Admin", cares: "Governance, integrations", x: 28, y: 70 },
    ],
    stat: { value: "4", unit: "archetypes", label: "distinct Owner personas — each needing a different default experience" },
    goal: "A product experience that feels purpose-built and role-specific from the moment of login.",
    solutions: [
      "Build pre-configured hub templates offering customized starting places per archetype",
      "Surface different default KPIs based on role (executives get signals; PMs get details)",
      "Allow company-level configuration of navigation, KPI thresholds, and views",
      "Use archetype data to guide what gets built first — not just what the loudest voices request",
    ],
  },
  {
    number: "04",
    title: "Health & Risk Is the #1 Priority",
    insight:
      "The most important thing an Owner needs to see is what's on track and what isn't. They want to open Procore and immediately know where to focus — not hunt for it.",
    quotes: [
      {
        text: "Owners are very high level, and so they want to know how we are doing against budget, how we are doing on schedule, and how we are doing on risks.",
        attribution: "Jennifer Whittington, Dir. of Corporate Operations, COBALT",
      },
      {
        text: "What's green is green. What's red is red.",
        attribution: "Owner interview",
      },
    ],
    stat: { value: "50+", unit: "projects", label: "executives review weekly — with no reliable single source of truth" },
    goal: "Proactively identify risk before it escalates. Know where to focus without digging.",
    solutions: [
      "Build exception-based dashboards that automatically surface projects with negative schedule variance, blown contingencies, or critical overdue items",
      "\"Spotlight\" the most important signals — don't make users find them",
      "Customizable Health & Risk scoring: let organizations define what \"healthy\" means for their portfolio",
      "AI-generated summaries: \"Safety risk increased significantly due to 2 high-severity incidents in the past 10 days\"",
    ],
  },
  {
    number: "05",
    title: "Owners Expect Procore to Match Their Business Structure",
    insight:
      "Owners have complex organizational hierarchies — portfolios contain programs, programs contain projects, projects contain phases. Procore's flat project-list model does not reflect how they actually operate.",
    quotes: [
      {
        text: "I think it's good to start from the lobby… take the door left or right… cost, schedule, risk.",
        attribution: "Nicolas Rbeiz, Principal, Data Center Delivery Strategy, Microsoft",
      },
    ],
    stat: { value: "4", unit: "levels", label: "Company → Portfolio → Program → Project — Procore only supports one" },
    goal: "Software that mirrors the way their business is actually organized, not a workaround they have to configure from scratch.",
    solutions: [
      "Support true portfolio hierarchy: Company → Portfolio → Program → Project",
      "Enable funding source management at the company level: create named buckets (bonds, grants, equity), allocate to projects, track drawdowns",
      "Group and filter across the hierarchy by region, program type, stage, or PM",
      "Object model should reflect how Owners think about assets — not how GCs think about jobs",
    ],
  },
  {
    number: "06",
    title: "The Project Lifecycle Starts Way Before Construction and Extends Way After",
    insight:
      "Owners manage capital assets across three major phases: Plan, Build, Operate. Most of what Procore does today covers the \"Build\" phase only. But for Owners, that's a small window in a 30-year asset lifecycle.",
    quotes: [
      {
        text: "A typical project starts 3 years before it enters Procore.",
        attribution: null,
      },
      {
        text: "We need to get those pipes, or those roads... into a system, because then we're gonna do our own asset management... replace it in 30 years.",
        attribution: "Owner interview",
      },
    ],
    stat: { value: "30", unit: "year lifespan", label: "of a capital asset — Procore currently covers a fraction of it" },
    goal: "Complete data continuity from idea conception through 30-year operations. No data left behind at handover.",
    solutions: [
      "Create a lightweight \"Concept Project\" intake that bypasses heavy required fields",
      "Support lifecycle stage-based navigation: Plan mode → Build mode → Operate mode",
      "Enable seamless asset handover: link submittals, warranties, O&M manuals to a digital asset profile during build",
      "Avoid ACV pricing penalties for Concept and Operate-phase projects",
    ],
  },
  {
    number: "07",
    title: "Owners Want to Be the Detective, Not Do the Detective Work",
    insight:
      "Owners don't want to hunt for insights — they want Procore to surface them. Many Owners lack the time or deep construction expertise to conduct detailed analyses. They need the \"so what\" served up, not raw data tables.",
    quotes: [
      {
        text: "I'm about to jump into this meeting, what's the biggest things that need to come to my attention before I join there?",
        attribution: "Owner interview",
      },
      {
        text: "I'm basically going in every day and trying to spot the error or variance.",
        attribution: "McKenzie Clarke, Project Mgr, PETCO",
      },
    ],
    stat: { value: "3", unit: "bullets", label: "is all an executive needs — a weekly AI briefing, not a data dump" },
    goal: "Instantly grasp the state of the portfolio. Identify what requires attention without opening a single project.",
    solutions: [
      "AI-generated portfolio summaries: 3-bullet \"what happened this week\" briefings tailored by role",
      "\"Spotlighting\" — surface anomalies, outliers, and trend changes proactively inside hub views",
      "Replace raw data tables with visual signals (risk scores, trend arrows, color-coded status) as defaults",
      "Cross-project comparisons: \"Soft costs for this project are 100% higher than projects of similar scale\"",
    ],
  },
  {
    number: "08",
    title: "Owners Think in Business Outcomes, Not Tools",
    insight:
      "Owners don't organize their work around \"Budget\" or \"RFIs.\" They think in terms of cost, schedule, risk, and performance. When Procore is organized around 40+ tools, it creates cognitive load and feels wrong from the start.",
    quotes: [
      {
        text: "I don't give a shit about RFIs. I don't want them, I don't want my whole dashboard plugged up... All I care about is the final submittal.",
        attribution: "Owner interview",
      },
    ],
    stat: { value: "40+", unit: "tools", label: "in default Procore navigation — Owners need 5 business facets" },
    goal: "Use software that feels purpose-built for how Owners think — not a GC tool adjusted around the edges.",
    solutions: [
      "Reorganize navigation around business facets: Cost Management, Risk & Health, Funding, Procurement, Documents",
      "Make content strategy a product investment: automatically serve Owner-centric language upon login",
      "Avoid GC language as defaults: \"Prime Contract\" → \"Funding Agreement,\" \"Subcontractor\" → \"Contractor\"",
      "Content should prioritize actionable insights, anticipate knowledge gaps, and lean toward simplicity",
    ],
  },
  {
    number: "09",
    title: "Lessons Learned Are Foundational, Not a Bonus Feature",
    insight:
      "Owners build the same types of assets over and over. Each project is an opportunity to get better at the next one — if the data is structured and accessible. Right now, it isn't.",
    quotes: [
      {
        text: "We got one that went really well and one that didn't, and we're comparing and contrasting, and let's talk about what lessons learned from one and what went really well on the other.",
        attribution: "Jeff Thornton, EVP, Head of Central Region, CenterPoint Properties",
      },
    ],
    stat: { value: "12", unit: "projects", label: "manually cross-referenced to spot a single vendor performance trend" },
    goal: "Build an institutional knowledge base from each completed project. Use that data to improve vendor selection, cost estimating, and risk management across future projects.",
    solutions: [
      "Build cross-project comparison tools: surface how a project performs against similar past projects",
      "Vendor scorecard dashboards that auto-aggregate RFI response times, change order rates, and schedule delays by GC",
      "Structured Lessons Learned templates tied to specific project phases and auto-prompted at key milestones",
      "Feed historical actuals back into capital planning",
    ],
  },
  {
    number: "10",
    title: "Owners Need Procore to Connect the Dots, Not Create More Silos",
    insight:
      "Owners cite \"single source of truth\" as one of the primary reasons they choose Procore. But the current experience forces them to manually connect data across tools, projects, and external systems — defeating the purpose.",
    quotes: [
      {
        text: "Similar to a slicer in Power BI. You've got separate screens you move across in Power BI, but you can set slicers that follow across from one screen to the next.",
        attribution: "Daniel Lee, Procore Senior Analyst, Marathon Petroleum",
      },
    ],
    stat: { value: "0", unit: "automation", label: "between tools today — every workflow handoff is manual" },
    goal: "One system of record. Data that flows automatically between construction, finance, and operations — without a human in the middle.",
    solutions: [
      "Cross-tool automation engine: \"when a change order is approved, automatically draft a budget amendment\"",
      "Procore Connect: enable secure sharing of health and risk signals from GC-managed projects into the Owner's portfolio view",
      "Granular role-based access: decouple reporting rights from administrative rights",
      "API-first integrations with SAP, Maximo, Esri ArcGIS — built for Owner data flows, not GC data flows",
    ],
  },
]

const summary = [
  { number: "01", insight: "Top-Down, Not Bottom-Up", need: "Portfolio visibility without project-level navigation" },
  { number: "02", insight: "Not Just Construction People", need: "Business-oriented language, lens, and goals" },
  { number: "03", insight: "Not a Monolith", need: "Archetype-based, role-specific experiences" },
  { number: "04", insight: "Health & Risk First", need: "Proactive, exception-based risk surfacing" },
  { number: "05", insight: "Match the Business Structure", need: "Portfolio hierarchy, programs, funding sources" },
  { number: "06", insight: "Lifecycle Beyond Construction", need: "Plan, Build, Operate — not just Course of Construction" },
  { number: "07", insight: "Be the Detective", need: "Surfaced insights, not raw data to analyze" },
  { number: "08", insight: "Business Outcomes, Not Tools", need: "Business-facet navigation and Owner-first language" },
  { number: "09", insight: "Lessons Learned Are Strategic", need: "Cross-project comparison and vendor performance data" },
  { number: "10", insight: "Connect the Dots", need: "Single source of truth with real data connectivity" },
]

const TOTAL_SLIDES = 12

// ─── Icons ────────────────────────────────────────────────────────────────────

const icons: Record<string, React.ReactNode> = {
  "01": (
    // Portfolio layers / top-down view
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="4" y="4" width="28" height="6" rx="1.5" fill="#3E5268"/>
      <rect x="8" y="14" width="20" height="5" rx="1.5" fill="#3E5268" opacity="0.7"/>
      <rect x="12" y="23" width="12" height="4" rx="1.5" fill="#3E5268" opacity="0.45"/>
      <line x1="18" y1="10" x2="18" y2="14" stroke="#FF5200" strokeWidth="1.5"/>
      <line x1="18" y1="19" x2="18" y2="23" stroke="#FF5200" strokeWidth="1.5" opacity="0.6"/>
    </svg>
  ),
  "02": (
    // Building with dollar sign
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="6" y="10" width="18" height="20" rx="1.5" fill="#3E5268"/>
      <rect x="9" y="14" width="4" height="4" rx="0.5" fill="#0E1821"/>
      <rect x="16" y="14" width="4" height="4" rx="0.5" fill="#0E1821"/>
      <rect x="9" y="21" width="4" height="4" rx="0.5" fill="#0E1821"/>
      <rect x="16" y="21" width="4" height="4" rx="0.5" fill="#0E1821"/>
      <text x="27" y="15" fill="#FF5200" fontSize="11" fontWeight="700" fontFamily="sans-serif">$</text>
    </svg>
  ),
  "03": (
    // Four people / personas
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="10" cy="13" r="4" fill="#3E5268"/>
      <path d="M4 26c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#3E5268" strokeWidth="1.5" fill="none"/>
      <circle cx="26" cy="13" r="4" fill="#3E5268" opacity="0.65"/>
      <path d="M20 26c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#3E5268" strokeWidth="1.5" fill="none" opacity="0.65"/>
      <line x1="18" y1="6" x2="18" y2="30" stroke="#FF5200" strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  "04": (
    // Warning / risk triangle
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M18 5L32 29H4L18 5Z" fill="#3E5268"/>
      <line x1="18" y1="14" x2="18" y2="22" stroke="#FF5200" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="18" cy="25.5" r="1.5" fill="#FF5200"/>
    </svg>
  ),
  "05": (
    // Hierarchy tree
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="13" y="4" width="10" height="6" rx="1.5" fill="#3E5268"/>
      <rect x="2" y="16" width="8" height="5" rx="1.5" fill="#3E5268" opacity="0.8"/>
      <rect x="14" y="16" width="8" height="5" rx="1.5" fill="#3E5268" opacity="0.8"/>
      <rect x="26" y="16" width="8" height="5" rx="1.5" fill="#3E5268" opacity="0.8"/>
      <rect x="8" y="27" width="6" height="4" rx="1" fill="#3E5268" opacity="0.5"/>
      <rect x="22" y="27" width="6" height="4" rx="1" fill="#3E5268" opacity="0.5"/>
      <line x1="18" y1="10" x2="6" y2="16" stroke="#FF5200" strokeWidth="1.2" opacity="0.7"/>
      <line x1="18" y1="10" x2="18" y2="16" stroke="#FF5200" strokeWidth="1.2" opacity="0.7"/>
      <line x1="18" y1="10" x2="30" y2="16" stroke="#FF5200" strokeWidth="1.2" opacity="0.7"/>
    </svg>
  ),
  "06": (
    // Timeline arrow
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <line x1="4" y1="18" x2="30" y2="18" stroke="#3E5268" strokeWidth="2"/>
      <polyline points="26,13 32,18 26,23" fill="none" stroke="#FF5200" strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="8" cy="18" r="2.5" fill="#3E5268"/>
      <circle cx="18" cy="18" r="2.5" fill="#FF5200"/>
      <circle cx="28" cy="18" r="2.5" fill="#3E5268" opacity="0.5"/>
    </svg>
  ),
  "07": (
    // Magnifier / spotlight
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="15" cy="15" r="9" stroke="#3E5268" strokeWidth="2" fill="none"/>
      <circle cx="15" cy="15" r="5" fill="#3E5268" opacity="0.5"/>
      <line x1="21.5" y1="21.5" x2="30" y2="30" stroke="#FF5200" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  "08": (
    // Navigation / compass
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="4" y="8" width="28" height="4" rx="2" fill="#3E5268"/>
      <rect x="4" y="16" width="20" height="4" rx="2" fill="#3E5268" opacity="0.6"/>
      <rect x="4" y="24" width="14" height="4" rx="2" fill="#3E5268" opacity="0.35"/>
      <circle cx="30" cy="26" r="5" fill="#FF5200" opacity="0.15" stroke="#FF5200" strokeWidth="1.5"/>
      <polyline points="28,26 30,23 32,26" fill="none" stroke="#FF5200" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  "09": (
    // Document stack / compare
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="5" y="8" width="11" height="20" rx="1.5" fill="#3E5268"/>
      <rect x="20" y="8" width="11" height="20" rx="1.5" fill="#3E5268" opacity="0.65"/>
      <line x1="8" y1="13" x2="13" y2="13" stroke="#0E1821" strokeWidth="1.2"/>
      <line x1="8" y1="17" x2="13" y2="17" stroke="#0E1821" strokeWidth="1.2"/>
      <line x1="8" y1="21" x2="13" y2="21" stroke="#0E1821" strokeWidth="1.2"/>
      <line x1="23" y1="13" x2="28" y2="13" stroke="#0E1821" strokeWidth="1.2"/>
      <line x1="23" y1="17" x2="28" y2="17" stroke="#0E1821" strokeWidth="1.2" opacity="0.4"/>
      <line x1="23" y1="21" x2="28" y2="21" stroke="#0E1821" strokeWidth="1.2"/>
      <line x1="17" y1="6" x2="17" y2="30" stroke="#FF5200" strokeWidth="1" strokeDasharray="2 2"/>
    </svg>
  ),
  "10": (
    // Connected nodes
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="10" r="4" fill="#3E5268"/>
      <circle cx="8" cy="26" r="4" fill="#3E5268" opacity="0.7"/>
      <circle cx="28" cy="26" r="4" fill="#3E5268" opacity="0.7"/>
      <line x1="18" y1="14" x2="10" y2="22" stroke="#FF5200" strokeWidth="1.5" opacity="0.8"/>
      <line x1="18" y1="14" x2="26" y2="22" stroke="#FF5200" strokeWidth="1.5" opacity="0.8"/>
      <line x1="12" y1="26" x2="24" y2="26" stroke="#FF5200" strokeWidth="1.5" opacity="0.5"/>
    </svg>
  ),
}

// ─── Diagrams ─────────────────────────────────────────────────────────────────

function ArchetypeQuadrant({ archetypes }: { archetypes: { name: string; who: string; x: number; y: number }[] }) {
  return (
    <div className="relative w-full mt-4" style={{ aspectRatio: "1 / 0.75" }}>
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Background quadrants */}
        <rect x="0" y="0" width="198" height="148" rx="4" fill="rgba(62,82,104,0.15)"/>
        <rect x="202" y="0" width="198" height="148" rx="4" fill="rgba(62,82,104,0.2)"/>
        <rect x="0" y="152" width="198" height="148" rx="4" fill="rgba(62,82,104,0.2)"/>
        <rect x="202" y="152" width="198" height="148" rx="4" fill="rgba(62,82,104,0.15)"/>

        {/* Axis lines */}
        <line x1="200" y1="0" x2="200" y2="300" stroke="rgba(62,82,104,0.5)" strokeWidth="1" strokeDasharray="4 3"/>
        <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(62,82,104,0.5)" strokeWidth="1" strokeDasharray="4 3"/>

        {/* Axis labels */}
        <text x="200" y="14" textAnchor="middle" fill="#B5C4D4" fontSize="10" fontFamily="'Inter Tight', sans-serif" letterSpacing="1">HIGH-LEVEL VIEW</text>
        <text x="200" y="294" textAnchor="middle" fill="#B5C4D4" fontSize="10" fontFamily="'Inter Tight', sans-serif" letterSpacing="1">DETAILED VIEW</text>
        <text x="8" y="153" fill="#B5C4D4" fontSize="10" fontFamily="'Inter Tight', sans-serif" letterSpacing="1">SERVED UP</text>
        <text x="316" y="153" fill="#B5C4D4" fontSize="10" fontFamily="'Inter Tight', sans-serif" letterSpacing="1">SELF-CONFIGURED</text>

        {/* Archetype dots */}
        {archetypes.map((a) => {
          const cx = (a.x / 100) * 400
          const cy = (a.y / 100) * 300
          return (
            <g key={a.name}>
              <circle cx={cx} cy={cy} r="6" fill="#FF5200" opacity="0.9"/>
              <circle cx={cx} cy={cy} r="12" fill="#FF5200" opacity="0.12"/>
              <text x={cx} y={cy - 14} textAnchor="middle" fill="#EDE8DF" fontSize="11" fontWeight="600" fontFamily="'Inter Tight', sans-serif">{a.name}</text>
              <text x={cx} y={cy - 3} textAnchor="middle" fill="#B5C4D4" fontSize="9" fontFamily="'Inter Tight', sans-serif">{a.who}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function HierarchyTree() {
  const INDENT = 48
  const BOX_H = 44
  const BOX_W = 200
  const ROW = 62
  const GAP = 16  // space between box right edge and label

  const nodes = [
    { label: "Portfolio",   depth: 0, sub: "All capital assets",         procore: false },
    { label: "Region",      depth: 1, sub: "West / East / Central",      procore: false },
    { label: "Program",     depth: 2, sub: "Healthcare Expansion '26",   procore: false },
    { label: "Project",     depth: 3, sub: "Sacramento Medical Center",  procore: true  },
    { label: "Sub-Project", depth: 4, sub: "Phase 2 — ICU Wing",         procore: false },
  ]

  // Total canvas width: deepest box right edge + badge + some padding
  const maxDepth = 4
  const W = maxDepth * INDENT + BOX_W + 120
  const H = nodes.length * ROW + 12

  return (
    <div className="mt-6 w-full">
      <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#B5C4D4" }}>Hierarchy model</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 320 }}>
        {nodes.map((node, i) => {
          const x = node.depth * INDENT
          const y = i * ROW + 8
          const isTop = i === 0
          const alpha = 1 - i * 0.1
          const parentX = i > 0 ? nodes[i - 1].depth * INDENT + 14 : 0
          const parentY = i > 0 ? (i - 1) * ROW + 8 + BOX_H : 0

          return (
            <g key={node.label}>
              {/* L-shaped connector */}
              {i > 0 && (
                <>
                  <line x1={parentX} y1={parentY} x2={parentX} y2={y + BOX_H / 2}
                    stroke="rgba(62,82,104,0.55)" strokeWidth="1.5"/>
                  <line x1={parentX} y1={y + BOX_H / 2} x2={x} y2={y + BOX_H / 2}
                    stroke="rgba(62,82,104,0.55)" strokeWidth="1.5"/>
                </>
              )}

              {/* Box */}
              <rect x={x} y={y} width={BOX_W} height={BOX_H} rx="6"
                fill={isTop ? "rgba(255,82,0,0.13)" : "rgba(62,82,104,0.28)"}
                stroke={isTop ? "rgba(255,82,0,0.5)" : `rgba(62,82,104,${alpha * 0.8})`}
                strokeWidth="1.2"/>

              {/* Node label */}
              <text x={x + 13} y={y + 17}
                fill={isTop ? "#FF5200" : "#EDE8DF"}
                fontSize="14" fontWeight="700"
                fontFamily="'Procore Sans', 'Inter Tight', sans-serif">
                {node.label}
              </text>

              {/* Sub-label */}
              <text x={x + 13} y={y + 33}
                fill="#B5C4D4" fontSize="11"
                fontFamily="'Inter Tight', sans-serif">
                {node.sub}
              </text>

              {/* "no visibility today" — positioned right of this box + gap */}
              {!node.procore && i < 3 && (
                <text
                  x={x + BOX_W + GAP}
                  y={y + BOX_H / 2 + 4}
                  fill="rgba(181,196,212,0.75)"
                  fontSize="11"
                  fontStyle="italic"
                  fontFamily="'Inter Tight', sans-serif"
                >
                  no visibility today
                </text>
              )}

              {/* Procore badge — right of box */}
              {node.procore && (
                <g>
                  <rect x={x + BOX_W + GAP} y={y + 6} width={88} height={BOX_H - 12} rx="5"
                    fill="rgba(255,82,0,0.15)" stroke="rgba(255,82,0,0.5)" strokeWidth="1.2"/>
                  <text x={x + BOX_W + GAP + 44} y={y + 21} textAnchor="middle"
                    fill="#FF5200" fontSize="11" fontWeight="700"
                    fontFamily="'Inter Tight', sans-serif" letterSpacing="0.8">
                    PROCORE
                  </text>
                  <text x={x + BOX_W + GAP + 44} y={y + 34} textAnchor="middle"
                    fill="#FF5200" fontSize="10" opacity="0.75"
                    fontFamily="'Inter Tight', sans-serif">
                    today
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function LifecycleBar() {
  const phases = [
    { label: "Plan", sub: "Feasibility, design, funding", years: "Yrs 1–3", covered: false },
    { label: "Build", sub: "Construction & delivery", years: "Yrs 3–5", covered: true },
    { label: "Operate", sub: "Maintenance & asset mgmt", years: "Yrs 5–35", covered: false },
  ]
  return (
    <div className="mt-6 w-full">
      <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#B5C4D4" }}>Asset lifecycle coverage</p>
      <div className="flex gap-1.5 w-full">
        {phases.map((p) => (
          <div
            key={p.label}
            className="flex-1 rounded-md px-3 py-3 flex flex-col gap-1 relative overflow-hidden"
            style={{
              background: p.covered ? "rgba(255,82,0,0.12)" : "rgba(62,82,104,0.3)",
              border: p.covered ? "1px solid rgba(255,82,0,0.4)" : "1px solid rgba(62,82,104,0.4)",
            }}
          >
            {p.covered && (
              <span
                className="absolute top-2 right-2 text-[9px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded"
                style={{ background: "rgba(255,82,0,0.2)", color: "#FF5200" }}
              >
                Today
              </span>
            )}
            <p className="text-sm font-bold" style={{ color: p.covered ? "#FF5200" : "#B5C4D4", fontFamily: "'Procore Sans', sans-serif" }}>
              {p.label}
            </p>
            <p className="text-xs leading-snug" style={{ color: p.covered ? "#EDE8DF" : "#3E5268" }}>{p.sub}</p>
            <p className="text-xs mt-1 font-medium" style={{ color: p.covered ? "rgba(255,82,0,0.7)" : "rgba(62,82,104,0.7)" }}>{p.years}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(62,82,104,0.3)" }}>
          <div className="h-full rounded-full" style={{ width: "20%", background: "#FF5200", opacity: 0.7 }}/>
        </div>
        <p className="text-xs whitespace-nowrap" style={{ color: "#3E5268" }}>~20% of lifecycle covered</p>
      </div>
    </div>
  )
}

// ─── Slide components ─────────────────────────────────────────────────────────

function SlideCover() {
  return (
    <div className="slide flex-shrink-0 w-screen h-screen flex flex-col relative snap-start" style={{ background: "#0E1821" }}>
      <div className="flex flex-col justify-between h-full px-20 py-16 max-w-5xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-10" style={{ color: "#FF5200" }}>
            Owners Strategy
          </p>
          <h1
            className="text-8xl font-bold leading-[1.05] tracking-tight mb-8"
            style={{ fontFamily: "'Procore Sans', 'Inter Tight', sans-serif", color: "#EDE8DF" }}
          >
            Owners
            <br />
            <span style={{ color: "#B5C4D4" }}>Top 10</span>
          </h1>
          <p className="text-2xl leading-relaxed max-w-xl" style={{ color: "#EDE8DF", opacity: 0.7 }}>
            What every product team needs to know about the Owners segment
          </p>
        </div>
        <div className="border-l-2 pl-6 py-2 max-w-2xl" style={{ borderColor: "#FF5200" }}>
          <p className="text-lg leading-relaxed italic" style={{ color: "#EDE8DF", opacity: 0.75 }}>
            Distilled from 30+ Owner interviews, the Owner Experience Strategy Phase Two Shareout, and the Capital
            Owner's Blueprint for Lifecycle Asset Management.
          </p>
        </div>
      </div>
      <div className="absolute bottom-16 right-20 text-right">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#3E5268" }}>The Big Idea</p>
        <p className="text-base max-w-sm leading-relaxed" style={{ color: "#3E5268" }}>
          Owners are not construction people. They are business people who happen to be building things.
        </p>
      </div>
    </div>
  )
}

function QuoteCard({ text, attribution }: { text: string; attribution: string | null }) {
  return (
    <div className="border-l-2 pl-4 py-1" style={{ borderColor: "#FF5200" }}>
      <p className="text-base italic leading-relaxed" style={{ color: "#EDE8DF", opacity: 0.8 }}>
        "{text}"
      </p>
      {attribution && (
        <p className="text-sm mt-2 font-medium" style={{ color: "#B5C4D4" }}>
          — {attribution}
        </p>
      )}
    </div>
  )
}

function SolutionPill({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 px-3 rounded-md" style={{ background: "rgba(62,82,104,0.6)" }}>
      <span className="text-sm mt-0.5 flex-shrink-0 font-bold" style={{ color: "#FF5200" }}>→</span>
      <p className="text-sm leading-relaxed" style={{ color: "#EDE8DF" }}>{text}</p>
    </div>
  )
}

function StatCallout({ stat }: { stat: { value: string; unit: string; label: string } }) {
  return (
    <div className="mb-8 pb-7 border-b" style={{ borderColor: "rgba(62,82,104,0.35)" }}>
      <div className="flex items-baseline gap-3 mb-1">
        <span
          className="text-6xl font-bold leading-none"
          style={{ fontFamily: "'Procore Sans', 'Inter Tight', sans-serif", color: "#FF5200" }}
        >
          {stat.value}
        </span>
        <span className="text-xl font-semibold" style={{ color: "#B5C4D4" }}>{stat.unit}</span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "#EDE8DF", opacity: 0.55 }}>{stat.label}</p>
    </div>
  )
}

type Archetype = { name: string; who: string; cares: string; x: number; y: number }
type Item = {
  number: string
  title: string
  insight: string
  quotes: { text: string; attribution: string | null }[]
  stat: { value: string; unit: string; label: string }
  goal: string
  solutions: string[]
  archetypes?: Archetype[]
}

function SlideItem({ item }: { item: Item }) {
  const showLifecycle = item.number === "06"
  const showQuadrant = item.number === "03"
  const showHierarchy = item.number === "05"

  return (
    <div
      className="slide flex-shrink-0 w-screen h-screen snap-start grid"
      style={{ background: "#0E1821", gridTemplateColumns: "1fr 1.1fr" }}
    >
      {/* Left column */}
      <div
        className="h-full overflow-y-auto px-16 py-14 flex flex-col border-r"
        style={{ borderColor: "rgba(62,82,104,0.35)" }}
      >
        <div className="flex items-start justify-between mb-5">
          <span
            className="text-7xl font-bold leading-none"
            style={{ fontFamily: "'Procore Sans', 'Inter Tight', sans-serif", color: "#FF5200" }}
          >
            {item.number}
          </span>
          <div className="mt-2 opacity-80">{icons[item.number]}</div>
        </div>
        <h2
          className="text-3xl font-bold leading-tight mb-6"
          style={{ fontFamily: "'Procore Sans', 'Inter Tight', sans-serif", color: "#EDE8DF" }}
        >
          {item.title}
        </h2>
        <p className="text-base leading-relaxed mb-6" style={{ color: "#EDE8DF", opacity: 0.72 }}>
          {item.insight}
        </p>

        {item.quotes.length > 0 && (
          <div className="flex flex-col gap-4">
            {item.quotes.map((q, i) => (
              <QuoteCard key={i} text={q.text} attribution={q.attribution} />
            ))}
          </div>
        )}

        {showHierarchy && <HierarchyTree />}
        {showLifecycle && <LifecycleBar />}

        {showQuadrant && item.archetypes && (
          <ArchetypeQuadrant archetypes={item.archetypes} />
        )}
      </div>

      {/* Right column */}
      <div className="h-full overflow-y-auto px-16 py-14 flex flex-col">
        <StatCallout stat={item.stat} />

        <div className="mb-8 pb-8 border-b" style={{ borderColor: "rgba(62,82,104,0.35)" }}>
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#B5C4D4" }}>Goal</p>
          <p className="text-lg leading-relaxed" style={{ color: "#EDE8DF", opacity: 0.8 }}>{item.goal}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#B5C4D4" }}>How to solve</p>
          <div className="flex flex-col gap-2.5">
            {item.solutions.map((s, i) => (
              <SolutionPill key={i} text={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SlideSummary({ onBackToStart }: { onBackToStart: () => void }) {
  return (
    <div
      className="slide flex-shrink-0 w-screen h-screen snap-start flex flex-col px-20 py-16"
      style={{ background: "#0E1821" }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: "#FF5200" }}>
        Summary
      </p>
      <h2
        className="text-5xl font-bold mb-10"
        style={{ fontFamily: "'Procore Sans', 'Inter Tight', sans-serif", color: "#EDE8DF" }}
      >
        10 things. One direction.
      </h2>

      <div className="grid grid-cols-2 gap-x-16 flex-1">
        {summary.map((row) => (
          <div
            key={row.number}
            className="flex items-start gap-4 py-3 border-b"
            style={{ borderColor: "rgba(62,82,104,0.4)" }}
          >
            <span
              className="text-base font-bold w-7 flex-shrink-0 mt-0.5"
              style={{ color: "#FF5200", fontFamily: "'Procore Sans', 'Inter Tight', sans-serif" }}
            >
              {row.number}
            </span>
            <div className="min-w-0">
              <p className="text-base font-medium leading-snug" style={{ color: "#EDE8DF" }}>{row.insight}</p>
              <p className="text-sm mt-0.5 leading-relaxed" style={{ color: "#B5C4D4" }}>{row.need}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={onBackToStart}
          className="text-sm uppercase tracking-widest transition-colors px-5 py-2.5 rounded-md"
          style={{ background: "rgba(62,82,104,0.5)", color: "#EDE8DF" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(62,82,104,0.85)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(62,82,104,0.5)")}
        >
          ← Back to start
        </button>
      </div>
    </div>
  )
}

// ─── Magazine shell ───────────────────────────────────────────────────────────

export default function OwnersTop10() {
  const [current, setCurrent] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, index))
    setCurrent(clamped)
    const track = trackRef.current
    if (!track) return
    const slide = track.children[clamped] as HTMLElement
    if (slide) track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" })
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(current + 1)
      if (e.key === "ArrowLeft") goTo(current - 1)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [current, goTo])

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#0E1821", fontFamily: "'Inter Tight', sans-serif" }}
    >
      <div
        ref={trackRef}
        className="flex h-full overflow-x-hidden snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        <SlideCover />
        {items.map((item) => (
          <SlideItem key={item.number} item={item as Item} />
        ))}
        <SlideSummary onBackToStart={() => goTo(0)} />
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-200"
            style={{
              width: i === current ? "16px" : "6px",
              height: "6px",
              background: i === current ? "#FF5200" : "#3E5268",
            }}
          />
        ))}
      </div>

      {/* Arrow buttons */}
      <button
        onClick={() => goTo(current - 1)}
        disabled={current === 0}
        className="absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full transition-all"
        style={{
          background: current === 0 ? "transparent" : "rgba(62,82,104,0.5)",
          color: current === 0 ? "#3E5268" : "#EDE8DF",
          cursor: current === 0 ? "default" : "pointer",
        }}
      >
        ←
      </button>
      <button
        onClick={() => goTo(current + 1)}
        disabled={current === TOTAL_SLIDES - 1}
        className="absolute right-5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full transition-all"
        style={{
          background: current === TOTAL_SLIDES - 1 ? "transparent" : "rgba(62,82,104,0.5)",
          color: current === TOTAL_SLIDES - 1 ? "#3E5268" : "#EDE8DF",
          cursor: current === TOTAL_SLIDES - 1 ? "default" : "pointer",
        }}
      >
        →
      </button>

      {/* Slide counter */}
      <div className="absolute top-6 right-16 text-xs tabular-nums" style={{ color: "#3E5268" }}>
        {current + 1} / {TOTAL_SLIDES}
      </div>

      {/* Back link */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-xs uppercase tracking-widest transition-colors"
        style={{ color: "#3E5268" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#EDE8DF")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#3E5268")}
      >
        ← Owners Strategy
      </Link>
    </div>
  )
}

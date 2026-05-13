"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Link from "next/link"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Node,
  type Edge,
  type Connection,
  type NodeProps,
  Handle,
  Position,
  Panel,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { supabase } from "@/lib/supabase"

// ─── Types ────────────────────────────────────────────────────────────────────

type LayerType = "procore-object" | "risk-type" | "risk-register" | "risk-signal"

type Attribute = {
  name: string
  type: string
  required: boolean
}

type Rule = {
  kind: "cascade" | "aggregate" | "lifecycle" | "cardinality" | "permission"
  description: string
}

type ObjectData = {
  label: string
  layer: LayerType
  description?: string
  attributes: Attribute[]
  rules: Rule[]
}

type ModelMeta = {
  id: string
  name: string
  description: string
  object_count?: number
}

type ValidationError = {
  path: string
  message: string
}

// ─── Layer config ─────────────────────────────────────────────────────────────

const LAYER_CONFIG: Record<LayerType, { color: string; bg: string; border: string; label: string }> = {
  "procore-object": { color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE", label: "Procore Object" },
  "risk-type":      { color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", label: "Risk Type" },
  "risk-register":  { color: "#B45309", bg: "#FFFBEB", border: "#FDE68A", label: "Risk Register" },
  "risk-signal":    { color: "#065F46", bg: "#ECFDF5", border: "#A7F3D0", label: "Risk Signal" },
}

const RULE_KINDS = ["cascade", "aggregate", "lifecycle", "cardinality", "permission"] as const
type RuleKind = typeof RULE_KINDS[number]

const RULE_COLORS: Record<RuleKind, string> = {
  cascade:     "#1D4ED8",
  aggregate:   "#7C3AED",
  lifecycle:   "#065F46",
  cardinality: "#B45309",
  permission:  "#9F1239",
}

const LAYER_OPTIONS: { value: LayerType; label: string }[] = [
  { value: "procore-object", label: "Procore Object" },
  { value: "risk-type",      label: "Risk Type" },
  { value: "risk-register",  label: "Risk Register" },
  { value: "risk-signal",    label: "Risk Signal" },
]

const ATTR_TYPES = [
  "string", "number", "boolean", "date", "enum", "object",
  "string[]", "number[]", "RiskTag[]", "RiskItem[]", "Record<RiskType, number>",
]

// ─── H&R Seed data (used only when seeding fresh DB) ─────────────────────────

const HR_NODES: Node<ObjectData>[] = [
  {
    id: "change-event", type: "object-node", position: { x: 60, y: 80 },
    data: {
      label: "Change Event", layer: "procore-object",
      description: "A change to contract scope, cost, or schedule.",
      attributes: [
        { name: "id", type: "string", required: true },
        { name: "title", type: "string", required: true },
        { name: "status", type: "enum", required: true },
        { name: "risk_tags", type: "RiskTag[]", required: false },
        { name: "risk_severity", type: "enum", required: false },
        { name: "risk_confidence", type: "number", required: false },
        { name: "risk_source", type: "enum", required: false },
      ],
      rules: [
        { kind: "aggregate", description: "Risk tags aggregate up to Risk Register" },
        { kind: "cardinality", description: "One Change Event → many Risk Types" },
      ],
    },
  },
  {
    id: "schedule-task", type: "object-node", position: { x: 60, y: 280 },
    data: {
      label: "Schedule Task", layer: "procore-object",
      description: "A task in the project schedule.",
      attributes: [
        { name: "id", type: "string", required: true },
        { name: "name", type: "string", required: true },
        { name: "start_date", type: "date", required: true },
        { name: "end_date", type: "date", required: true },
        { name: "risk_tags", type: "RiskTag[]", required: false },
        { name: "risk_severity", type: "enum", required: false },
        { name: "risk_source", type: "enum", required: false },
      ],
      rules: [
        { kind: "aggregate", description: "Risk tags aggregate up to Risk Register" },
        { kind: "cardinality", description: "One Schedule Task → many Risk Types" },
      ],
    },
  },
  {
    id: "submittal", type: "object-node", position: { x: 60, y: 460 },
    data: {
      label: "Submittal", layer: "procore-object",
      description: "A document submitted for review and approval.",
      attributes: [
        { name: "id", type: "string", required: true },
        { name: "title", type: "string", required: true },
        { name: "status", type: "enum", required: true },
        { name: "due_date", type: "date", required: false },
        { name: "risk_tags", type: "RiskTag[]", required: false },
        { name: "risk_severity", type: "enum", required: false },
        { name: "risk_source", type: "enum", required: false },
      ],
      rules: [
        { kind: "aggregate", description: "Risk tags aggregate up to Risk Register" },
        { kind: "cardinality", description: "One Submittal → many Risk Types" },
      ],
    },
  },
  {
    id: "cost-risk", type: "object-node", position: { x: 380, y: 80 },
    data: {
      label: "Cost Risk", layer: "risk-type",
      description: "Risks related to budget overruns and cost variance.",
      attributes: [
        { name: "id", type: "string", required: true },
        { name: "name", type: "string", required: true },
        { name: "threshold", type: "number", required: true },
        { name: "lifecycle_state", type: "enum", required: true },
        { name: "owner", type: "string", required: false },
      ],
      rules: [
        { kind: "lifecycle", description: "States: active → flagged → resolved → dismissed" },
        { kind: "cardinality", description: "Many Procore Objects → one Risk Type" },
        { kind: "cascade", description: "Threshold cascades down to scoring rules" },
      ],
    },
  },
  {
    id: "schedule-risk", type: "object-node", position: { x: 380, y: 280 },
    data: {
      label: "Schedule Risk", layer: "risk-type",
      description: "Risks related to timeline delays and critical path.",
      attributes: [
        { name: "id", type: "string", required: true },
        { name: "name", type: "string", required: true },
        { name: "threshold", type: "number", required: true },
        { name: "lifecycle_state", type: "enum", required: true },
        { name: "owner", type: "string", required: false },
      ],
      rules: [
        { kind: "lifecycle", description: "States: active → flagged → resolved → dismissed" },
        { kind: "cardinality", description: "Many Procore Objects → one Risk Type" },
        { kind: "cascade", description: "Threshold cascades down to scoring rules" },
      ],
    },
  },
  {
    id: "delivery-risk", type: "object-node", position: { x: 380, y: 460 },
    data: {
      label: "Delivery Risk", layer: "risk-type",
      description: "Risks related to quality, approvals, and delivery.",
      attributes: [
        { name: "id", type: "string", required: true },
        { name: "name", type: "string", required: true },
        { name: "threshold", type: "number", required: true },
        { name: "lifecycle_state", type: "enum", required: true },
        { name: "owner", type: "string", required: false },
      ],
      rules: [
        { kind: "lifecycle", description: "States: active → flagged → resolved → dismissed" },
        { kind: "cardinality", description: "Many Procore Objects → one Risk Type" },
        { kind: "cascade", description: "Threshold cascades down to scoring rules" },
      ],
    },
  },
  {
    id: "risk-register", type: "object-node", position: { x: 680, y: 270 },
    data: {
      label: "Risk Register", layer: "risk-register",
      description: "Project-level aggregation of all tagged risk objects.",
      attributes: [
        { name: "id", type: "string", required: true },
        { name: "project_id", type: "string", required: true },
        { name: "owner", type: "string", required: true },
        { name: "status", type: "enum", required: true },
        { name: "last_reviewed_at", type: "date", required: false },
        { name: "thresholds", type: "Record<RiskType, number>", required: true },
        { name: "risk_count", type: "number", required: false },
      ],
      rules: [
        { kind: "aggregate", description: "Aggregates risk tags from all Procore Objects in project" },
        { kind: "cardinality", description: "One project → one Risk Register" },
        { kind: "permission", description: "Owner can set thresholds; viewers read-only" },
      ],
    },
  },
  {
    id: "signal-hub-card", type: "object-node", position: { x: 960, y: 100 },
    data: {
      label: "Signal: Hub Card", layer: "risk-signal",
      description: "Summary risk signal surfaced on the project hub.",
      attributes: [
        { name: "id", type: "string", required: true },
        { name: "register_id", type: "string", required: true },
        { name: "health_status", type: "enum", required: true },
        { name: "risk_count", type: "number", required: true },
        { name: "dismissed", type: "boolean", required: false },
      ],
      rules: [
        { kind: "lifecycle", description: "States: healthy → at-risk → critical" },
        { kind: "aggregate", description: "Derives from Risk Register aggregation" },
      ],
    },
  },
  {
    id: "signal-kpi", type: "object-node", position: { x: 960, y: 290 },
    data: {
      label: "Signal: KPI", layer: "risk-signal",
      description: "KPI-style risk score for dashboards.",
      attributes: [
        { name: "id", type: "string", required: true },
        { name: "register_id", type: "string", required: true },
        { name: "score", type: "number", required: true },
        { name: "trend", type: "enum", required: false },
        { name: "snoozed_until", type: "date", required: false },
      ],
      rules: [
        { kind: "lifecycle", description: "Can be snoozed, escalated, or dismissed" },
        { kind: "aggregate", description: "Score computed from weighted register data" },
      ],
    },
  },
  {
    id: "signal-list", type: "object-node", position: { x: 960, y: 460 },
    data: {
      label: "Signal: List", layer: "risk-signal",
      description: "Detailed list view of all active risk items.",
      attributes: [
        { name: "id", type: "string", required: true },
        { name: "register_id", type: "string", required: true },
        { name: "items", type: "RiskItem[]", required: true },
        { name: "filter_state", type: "object", required: false },
      ],
      rules: [
        { kind: "aggregate", description: "Items sourced from tagged Procore Objects" },
        { kind: "cardinality", description: "One Register → one List signal" },
      ],
    },
  },
]

const HR_EDGES: Edge[] = [
  { id: "e-ce-cost",   source: "change-event",  target: "cost-risk",       label: "tagged as",       style: { stroke: "#94A3B8" }, labelStyle: { fontSize: 10, fill: "#64748B" }, labelBgStyle: { fill: "#F8FAFC" } },
  { id: "e-ce-sched",  source: "change-event",  target: "schedule-risk",   label: "tagged as",       style: { stroke: "#94A3B8" }, labelStyle: { fontSize: 10, fill: "#64748B" }, labelBgStyle: { fill: "#F8FAFC" } },
  { id: "e-st-sched",  source: "schedule-task", target: "schedule-risk",   label: "tagged as",       style: { stroke: "#94A3B8" }, labelStyle: { fontSize: 10, fill: "#64748B" }, labelBgStyle: { fill: "#F8FAFC" } },
  { id: "e-sub-del",   source: "submittal",     target: "delivery-risk",   label: "tagged as",       style: { stroke: "#94A3B8" }, labelStyle: { fontSize: 10, fill: "#64748B" }, labelBgStyle: { fill: "#F8FAFC" } },
  { id: "e-sub-sched", source: "submittal",     target: "schedule-risk",   label: "tagged as",       style: { stroke: "#94A3B8" }, labelStyle: { fontSize: 10, fill: "#64748B" }, labelBgStyle: { fill: "#F8FAFC" } },
  { id: "e-cost-reg",  source: "cost-risk",     target: "risk-register",   label: "aggregates into", style: { stroke: "#94A3B8" }, labelStyle: { fontSize: 10, fill: "#64748B" }, labelBgStyle: { fill: "#F8FAFC" } },
  { id: "e-sched-reg", source: "schedule-risk", target: "risk-register",   label: "aggregates into", style: { stroke: "#94A3B8" }, labelStyle: { fontSize: 10, fill: "#64748B" }, labelBgStyle: { fill: "#F8FAFC" } },
  { id: "e-del-reg",   source: "delivery-risk", target: "risk-register",   label: "aggregates into", style: { stroke: "#94A3B8" }, labelStyle: { fontSize: 10, fill: "#64748B" }, labelBgStyle: { fill: "#F8FAFC" } },
  { id: "e-reg-hub",   source: "risk-register", target: "signal-hub-card", label: "surfaces as",     style: { stroke: "#94A3B8" }, labelStyle: { fontSize: 10, fill: "#64748B" }, labelBgStyle: { fill: "#F8FAFC" } },
  { id: "e-reg-kpi",   source: "risk-register", target: "signal-kpi",      label: "surfaces as",     style: { stroke: "#94A3B8" }, labelStyle: { fontSize: 10, fill: "#64748B" }, labelBgStyle: { fill: "#F8FAFC" } },
  { id: "e-reg-list",  source: "risk-register", target: "signal-list",     label: "surfaces as",     style: { stroke: "#94A3B8" }, labelStyle: { fontSize: 10, fill: "#64748B" }, labelBgStyle: { fill: "#F8FAFC" } },
]

const SEED_MODELS = [
  { id: "health-risk",        name: "Health & Risk",       description: "Portfolio-level risk signals across cost, schedule, and delivery.", nodes: HR_NODES, edges: HR_EDGES },
  { id: "project-hierarchy",  name: "Project Hierarchy",   description: "Platform folders and projects with hierarchical attribute inheritance.", nodes: [], edges: [] },
]

// ─── Supabase helpers ─────────────────────────────────────────────────────────

async function dbLoadModels(): Promise<ModelMeta[]> {
  const { data, error } = await supabase
    .from("models")
    .select("id, name, description")
    .order("created_at", { ascending: true })
  if (error) throw error
  return data ?? []
}

async function dbLoadCanvas(modelId: string): Promise<{ nodes: Node<ObjectData>[]; edges: Edge[] }> {
  const [{ data: objs, error: e1 }, { data: rels, error: e2 }] = await Promise.all([
    supabase.from("objects").select("*").eq("model_id", modelId),
    supabase.from("relationships").select("*").eq("model_id", modelId),
  ])
  if (e1) throw e1
  if (e2) throw e2

  const nodes: Node<ObjectData>[] = (objs ?? []).map((o) => ({
    id: o.id,
    type: "object-node",
    position: { x: o.position_x, y: o.position_y },
    data: {
      label:       o.label,
      layer:       o.layer as LayerType,
      description: o.description ?? undefined,
      attributes:  o.attributes ?? [],
      rules:       o.rules ?? [],
    },
  }))

  const edges: Edge[] = (rels ?? []).map((r) => ({
    id:     r.id,
    source: r.source,
    target: r.target,
    label:  r.label ?? "",
    style:  { stroke: "#94A3B8" },
    labelStyle:   { fontSize: 10, fill: "#64748B" },
    labelBgStyle: { fill: "#F8FAFC" },
  }))

  return { nodes, edges }
}

async function dbSaveCanvas(
  modelId: string,
  nodes: Node<ObjectData>[],
  edges: Edge[]
): Promise<void> {
  // Upsert objects
  const objRows = nodes.map((n) => ({
    id:          n.id,
    model_id:    modelId,
    label:       (n.data as ObjectData).label,
    layer:       (n.data as ObjectData).layer,
    description: (n.data as ObjectData).description ?? null,
    attributes:  (n.data as ObjectData).attributes,
    rules:       (n.data as ObjectData).rules,
    position_x:  n.position.x,
    position_y:  n.position.y,
  }))

  // Upsert relationships
  const relRows = edges.map((e) => ({
    id:       e.id,
    model_id: modelId,
    source:   e.source,
    target:   e.target,
    label:    (e.label as string) ?? null,
  }))

  // Delete removed nodes/edges then upsert current ones
  const nodeIds = nodes.map((n) => n.id)
  const edgeIds = edges.map((e) => e.id)

  await Promise.all([
    nodeIds.length > 0
      ? supabase.from("objects").delete().eq("model_id", modelId).not("id", "in", `(${nodeIds.map((id) => `"${id}"`).join(",")})`)
      : supabase.from("objects").delete().eq("model_id", modelId),
    edgeIds.length > 0
      ? supabase.from("relationships").delete().eq("model_id", modelId).not("id", "in", `(${edgeIds.map((id) => `"${id}"`).join(",")})`)
      : supabase.from("relationships").delete().eq("model_id", modelId),
  ])

  if (objRows.length > 0) {
    const { error } = await supabase.from("objects").upsert(objRows)
    if (error) throw error
  }
  if (relRows.length > 0) {
    const { error } = await supabase.from("relationships").upsert(relRows)
    if (error) throw error
  }
}

async function dbCreateModel(model: ModelMeta): Promise<void> {
  const { error } = await supabase.from("models").insert({
    id:          model.id,
    name:        model.name,
    description: model.description,
  })
  if (error) throw error
}

async function dbDuplicateModel(source: ModelMeta): Promise<ModelMeta> {
  const newId   = `${source.id}-copy-${Date.now()}`
  const newName = `${source.name} (copy)`

  // Create the model record
  const { error: modelErr } = await supabase.from("models").insert({
    id: newId, name: newName, description: source.description,
  })
  if (modelErr) throw modelErr

  // Copy objects
  const { data: objs, error: objsErr } = await supabase
    .from("objects").select("*").eq("model_id", source.id)
  if (objsErr) throw objsErr

  if (objs && objs.length > 0) {
    const { error } = await supabase.from("objects").insert(
      objs.map((o) => ({ ...o, id: `${o.id}-${Date.now()}`, model_id: newId }))
    )
    if (error) throw error
  }

  // Copy relationships
  const { data: rels, error: relsErr } = await supabase
    .from("relationships").select("*").eq("model_id", source.id)
  if (relsErr) throw relsErr

  if (rels && rels.length > 0) {
    // Build old→new id map for objects
    const idMap: Record<string, string> = {}
    if (objs) {
      objs.forEach((o) => { idMap[o.id] = `${o.id}-${Date.now()}` })
    }
    const { error } = await supabase.from("relationships").insert(
      rels.map((r) => ({
        ...r,
        id: `${r.id}-${Date.now()}`,
        model_id: newId,
        source: idMap[r.source] ?? r.source,
        target: idMap[r.target] ?? r.target,
      }))
    )
    if (error) throw error
  }

  return { id: newId, name: newName, description: source.description }
}

async function dbSeedIfEmpty(): Promise<void> {
  const { data } = await supabase.from("models").select("id").limit(1)
  if (data && data.length > 0) return

  for (const seed of SEED_MODELS) {
    await supabase.from("models").upsert({ id: seed.id, name: seed.name, description: seed.description })
    const objRows = seed.nodes.map((n) => ({
      id: n.id, model_id: seed.id,
      label: (n.data as ObjectData).label,
      layer: (n.data as ObjectData).layer,
      description: (n.data as ObjectData).description ?? null,
      attributes: (n.data as ObjectData).attributes,
      rules: (n.data as ObjectData).rules,
      position_x: n.position.x,
      position_y: n.position.y,
    }))
    const relRows = seed.edges.map((e) => ({
      id: e.id, model_id: seed.id,
      source: e.source, target: e.target,
      label: (e.label as string) ?? null,
    }))
    if (objRows.length > 0) await supabase.from("objects").upsert(objRows)
    if (relRows.length > 0) await supabase.from("relationships").upsert(relRows)
  }
}

// ─── Schema validation ────────────────────────────────────────────────────────

function validateSchema(raw: string): { valid: boolean; errors: ValidationError[]; parsed?: Record<string, unknown> } {
  const errors: ValidationError[] = []
  let parsed: unknown

  try { parsed = JSON.parse(raw) } catch {
    return { valid: false, errors: [{ path: "root", message: "Invalid JSON — check syntax and try again." }] }
  }

  if (typeof parsed !== "object" || parsed === null)
    return { valid: false, errors: [{ path: "root", message: "Schema must be a JSON object." }] }

  const obj = parsed as Record<string, unknown>
  if (!obj.model)                      errors.push({ path: "model",         message: "Missing required field: model" })
  if (!Array.isArray(obj.objects))     errors.push({ path: "objects",       message: "Missing required field: objects (must be array)" })
  if (!Array.isArray(obj.relationships)) errors.push({ path: "relationships", message: "Missing required field: relationships (must be array)" })

  if (Array.isArray(obj.objects)) {
    ;(obj.objects as Record<string, unknown>[]).forEach((o, i) => {
      if (!o.id)    errors.push({ path: `objects[${i}].id`,    message: `Object at index ${i} missing id` })
      if (!o.label) errors.push({ path: `objects[${i}].label`, message: `Object at index ${i} missing label` })
      if (!o.layer) errors.push({ path: `objects[${i}].layer`, message: `Object at index ${i} missing layer` })
      if (o.layer && !Object.keys(LAYER_CONFIG).includes(o.layer as string))
        errors.push({ path: `objects[${i}].layer`, message: `Invalid layer "${o.layer}"` })
    })
  }

  if (errors.length > 0) return { valid: false, errors }
  return { valid: true, errors: [], parsed: obj }
}

// ─── Custom Node ──────────────────────────────────────────────────────────────

function ObjectNode({ data, selected }: NodeProps) {
  const objectData = data as ObjectData
  const config = LAYER_CONFIG[objectData.layer]
  return (
    <div style={{ background: config.bg, border: `1.5px solid ${selected ? config.color : config.border}`, borderRadius: 8, minWidth: 200, boxShadow: selected ? `0 0 0 2px ${config.color}33` : "0 1px 3px rgba(0,0,0,0.08)", transition: "box-shadow 0.15s, border-color 0.15s" }}>
      <Handle type="target" position={Position.Left}  style={{ background: config.color, width: 8, height: 8 }} />
      <div style={{ background: config.color, borderRadius: "6px 6px 0 0", padding: "6px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", letterSpacing: "0.02em" }}>{objectData.label}</span>
        <span style={{ fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{config.label}</span>
      </div>
      <div style={{ padding: "8px 10px 10px" }}>
        {objectData.description && <p style={{ fontSize: 10, color: "#64748B", marginBottom: 8, lineHeight: 1.4 }}>{objectData.description}</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {objectData.attributes.slice(0, 4).map((attr) => (
            <div key={attr.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 500, color: config.color, fontFamily: "monospace" }}>{attr.required ? "●" : "○"}</span>
              <span style={{ fontSize: 10, color: "#374151", fontFamily: "monospace" }}>{attr.name}</span>
              <span style={{ fontSize: 9, color: "#9CA3AF", marginLeft: "auto" }}>{attr.type}</span>
            </div>
          ))}
          {objectData.attributes.length > 4 && <p style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2 }}>+{objectData.attributes.length - 4} more</p>}
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: config.color, width: 8, height: 8 }} />
    </div>
  )
}

const nodeTypes = { "object-node": ObjectNode }

// ─── Object Form ──────────────────────────────────────────────────────────────

function ObjectForm({ initial, onSave, onCancel, onDelete, mode }: {
  initial?: Node<ObjectData>
  onSave: (data: ObjectData, id?: string) => void
  onCancel: () => void
  onDelete?: () => void
  mode: "add" | "edit"
}) {
  const initData = initial?.data as ObjectData | undefined
  const [label, setLabel]      = useState(initData?.label ?? "")
  const [layer, setLayer]      = useState<LayerType>(initData?.layer ?? "procore-object")
  const [description, setDesc] = useState(initData?.description ?? "")
  const [attributes, setAttrs] = useState<Attribute[]>(initData?.attributes ?? [])
  const [rules, setRules]      = useState<Rule[]>(initData?.rules ?? [])
  const [attrName, setAttrName]    = useState("")
  const [attrType, setAttrType]    = useState("string")
  const [attrRequired, setAttrReq] = useState(true)
  const [ruleKind, setRuleKind]    = useState<RuleKind>("cardinality")
  const [ruleDesc, setRuleDesc]    = useState("")
  const [errors, setErrors]        = useState<string[]>([])

  const config = LAYER_CONFIG[layer]

  function validate() {
    const e: string[] = []
    if (!label.trim()) e.push("Label is required.")
    setErrors(e)
    return e.length === 0
  }

  function handleSave() {
    if (!validate()) return
    onSave({ label: label.trim(), layer, description: description.trim(), attributes, rules }, initial?.id)
  }

  function addAttribute() {
    if (!attrName.trim()) return
    setAttrs((p) => [...p, { name: attrName.trim(), type: attrType, required: attrRequired }])
    setAttrName(""); setAttrType("string"); setAttrReq(true)
  }

  function addRule() {
    if (!ruleDesc.trim()) return
    setRules((p) => [...p, { kind: ruleKind, description: ruleDesc.trim() }])
    setRuleDesc(""); setRuleKind("cardinality")
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between shrink-0" style={{ borderTop: `3px solid ${config.color}` }}>
        <span className="text-sm font-medium text-foreground">{mode === "add" ? "New Object" : `Edit: ${initData?.label}`}</span>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">
        {errors.length > 0 && (
          <div className="rounded bg-red-50 border border-red-200 px-3 py-2">
            {errors.map((e, i) => <p key={i} className="text-xs text-red-600">{e}</p>)}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Label *</label>
            <input autoFocus value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Change Event" className="text-sm bg-background border border-border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Layer *</label>
            <select value={layer} onChange={(e) => setLayer(e.target.value as LayerType)} className="text-sm bg-background border border-border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-ring" style={{ color: config.color }}>
              {LAYER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Description</label>
            <textarea value={description} onChange={(e) => setDesc(e.target.value)} placeholder="What does this object represent?" rows={2} className="text-sm bg-background border border-border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground resize-none" />
          </div>
        </div>

        {/* Attributes */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Attributes</span>
          {attributes.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {attributes.map((attr, i) => (
                <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded border border-border/40 bg-muted/20 group">
                  <span className="text-[10px]" style={{ color: config.color }}>{attr.required ? "●" : "○"}</span>
                  <span className="text-xs font-mono text-foreground flex-1">{attr.name}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{attr.type}</span>
                  <button onClick={() => setAttrs((p) => p.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-red-500 text-xs opacity-0 group-hover:opacity-100 ml-1">×</button>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-2 pt-1 border-t border-border/30">
            <div className="flex gap-2">
              <input value={attrName} onChange={(e) => setAttrName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addAttribute()} placeholder="Attribute name" className="flex-1 text-xs font-mono bg-background border border-border rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground" />
              <select value={attrType} onChange={(e) => setAttrType(e.target.value)} className="text-xs bg-background border border-border rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-ring">
                {ATTR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={attrRequired} onChange={(e) => setAttrReq(e.target.checked)} className="rounded" />
                <span className="text-xs text-muted-foreground">Required</span>
              </label>
              <button onClick={addAttribute} disabled={!attrName.trim()} className="text-xs font-medium border border-border/60 rounded px-2.5 py-1 hover:bg-muted/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">+ Add</button>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Rules</span>
          {rules.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {rules.map((rule, i) => (
                <div key={i} className="flex gap-2 px-2.5 py-2 rounded border border-border/40 bg-muted/20 group">
                  <span className="text-[9px] font-semibold uppercase tracking-widest rounded px-1.5 py-0.5 shrink-0 h-fit mt-0.5" style={{ background: `${RULE_COLORS[rule.kind]}15`, color: RULE_COLORS[rule.kind], border: `1px solid ${RULE_COLORS[rule.kind]}30` }}>{rule.kind}</span>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">{rule.description}</p>
                  <button onClick={() => setRules((p) => p.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-red-500 text-xs opacity-0 group-hover:opacity-100 shrink-0">×</button>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-2 pt-1 border-t border-border/30">
            <select value={ruleKind} onChange={(e) => setRuleKind(e.target.value as RuleKind)} className="text-xs bg-background border border-border rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-ring" style={{ color: RULE_COLORS[ruleKind] }}>
              {RULE_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
            <div className="flex gap-2">
              <input value={ruleDesc} onChange={(e) => setRuleDesc(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addRule()} placeholder="Describe this rule" className="flex-1 text-xs bg-background border border-border rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground" />
              <button onClick={addRule} disabled={!ruleDesc.trim()} className="text-xs font-medium border border-border/60 rounded px-2.5 py-1 hover:bg-muted/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">+ Add</button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-border/40 flex items-center gap-2 shrink-0">
        {mode === "edit" && onDelete && (
          <button onClick={onDelete} className="text-xs font-medium text-red-500 border border-red-200 rounded px-3 py-1.5 hover:bg-red-50 transition-colors mr-auto">Delete</button>
        )}
        <button onClick={onCancel} className="text-xs font-medium border border-border/60 rounded px-3 py-1.5 hover:bg-muted/40 transition-colors ml-auto">Cancel</button>
        <button onClick={handleSave} className="text-xs font-medium bg-foreground text-background rounded px-3 py-1.5 hover:opacity-80 transition-opacity">
          {mode === "add" ? "Add to Canvas" : "Save Changes"}
        </button>
      </div>
    </div>
  )
}

// ─── Object Viewer ────────────────────────────────────────────────────────────

function ObjectViewer({ node, onEdit, onClose }: { node: Node<ObjectData>; onEdit: () => void; onClose: () => void }) {
  const data = node.data as ObjectData
  const config = LAYER_CONFIG[data.layer]
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between shrink-0" style={{ borderTop: `3px solid ${config.color}` }}>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{data.label}</span>
          <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: config.color }}>{config.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="text-xs font-medium border border-border/60 rounded px-2.5 py-1 hover:bg-muted/40 transition-colors">Edit</button>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {data.description && <div className="px-4 py-3 border-b border-border/40"><p className="text-xs text-muted-foreground leading-relaxed">{data.description}</p></div>}
        <div className="px-4 py-3 border-b border-border/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Attributes</span>
            <span className="text-[10px] text-muted-foreground">● required &nbsp; ○ optional</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {data.attributes.map((attr) => (
              <div key={attr.name} className="flex items-center gap-2 py-1.5 px-2 rounded bg-muted/30 border border-border/30">
                <span className="text-[10px]" style={{ color: config.color }}>{attr.required ? "●" : "○"}</span>
                <span className="text-xs font-mono text-foreground flex-1">{attr.name}</span>
                <span className="text-[10px] font-mono text-muted-foreground">{attr.type}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground block mb-3">Rules</span>
          <div className="flex flex-col gap-2">
            {data.rules.map((rule, i) => (
              <div key={i} className="flex gap-2 py-2 px-2.5 rounded border border-border/30 bg-muted/20">
                <span className="text-[9px] font-semibold uppercase tracking-widest rounded px-1.5 py-0.5 shrink-0 h-fit mt-0.5" style={{ background: `${RULE_COLORS[rule.kind]}15`, color: RULE_COLORS[rule.kind], border: `1px solid ${RULE_COLORS[rule.kind]}30` }}>{rule.kind}</span>
                <p className="text-xs text-muted-foreground leading-relaxed">{rule.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Schema Drawer ────────────────────────────────────────────────────────────

function SchemaDrawer({ nodes, edges, model, onApply, onClose }: {
  nodes: Node<ObjectData>[]; edges: Edge[]; model: ModelMeta
  onApply: (updated: { nodes: Node<ObjectData>[]; edges: Edge[] }) => void
  onClose: () => void
}) {
  const schema = {
    model: { id: model.id, name: model.name, description: model.description },
    objects: nodes.map((n) => ({ id: n.id, label: (n.data as ObjectData).label, layer: (n.data as ObjectData).layer, description: (n.data as ObjectData).description, attributes: (n.data as ObjectData).attributes, rules: (n.data as ObjectData).rules })),
    relationships: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, label: e.label })),
  }
  const [raw, setRaw]         = useState(JSON.stringify(schema, null, 2))
  const [errors, setErrors]   = useState<ValidationError[]>([])
  const [isDirty, setIsDirty] = useState(false)
  const [applied, setApplied] = useState(false)

  function handleApply() {
    const result = validateSchema(raw)
    if (!result.valid) { setErrors(result.errors); return }
    const parsed = result.parsed!
    const updatedNodes: Node<ObjectData>[] = (parsed.objects as Record<string, unknown>[]).map((obj, i) => {
      const existing = nodes.find((n) => n.id === obj.id)
      return { id: obj.id as string, type: "object-node", position: existing?.position ?? { x: 100 + i * 220, y: 100 }, data: { label: obj.label as string, layer: obj.layer as LayerType, description: obj.description as string | undefined, attributes: (obj.attributes as Attribute[]) ?? [], rules: (obj.rules as Rule[]) ?? [] } }
    })
    const updatedEdges: Edge[] = (parsed.relationships as Record<string, unknown>[]).map((r) => ({ id: r.id as string, source: r.source as string, target: r.target as string, label: r.label as string, style: { stroke: "#94A3B8" }, labelStyle: { fontSize: 10, fill: "#64748B" }, labelBgStyle: { fill: "#F8FAFC" } }))
    onApply({ nodes: updatedNodes, edges: updatedEdges })
    setIsDirty(false); setApplied(true); setErrors([])
  }

  return (
    <div className="absolute inset-0 z-20 flex justify-end" style={{ background: "rgba(0,0,0,0.15)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-[560px] max-w-full bg-background border-l border-border/40 flex flex-col h-full shadow-xl">
        <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between shrink-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">Schema View</span>
            <span className="text-[10px] text-muted-foreground">Edit JSON directly — validated before applying to canvas</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <textarea value={raw} onChange={(e) => { setRaw(e.target.value); setIsDirty(true); setApplied(false); setErrors([]) }} spellCheck={false} className="w-full h-full px-4 py-4 text-xs font-mono bg-muted/10 text-foreground outline-none resize-none border-0 leading-relaxed" style={{ fontFamily: "var(--font-mono, monospace)" }} />
        </div>
        {errors.length > 0 && (
          <div className="px-4 py-3 border-t border-red-200 bg-red-50 flex flex-col gap-1.5 max-h-36 overflow-y-auto">
            <span className="text-xs font-medium text-red-600 uppercase tracking-widest">Validation errors</span>
            {errors.map((e, i) => <div key={i} className="flex gap-2"><span className="text-[10px] font-mono text-red-400 shrink-0">{e.path}</span><span className="text-xs text-red-600">{e.message}</span></div>)}
          </div>
        )}
        <div className="px-4 py-3 border-t border-border/40 flex items-center gap-2 shrink-0">
          {applied && !isDirty && <span className="text-xs text-green-600 mr-auto">✓ Applied to canvas</span>}
          {isDirty && <span className="text-xs text-muted-foreground mr-auto">Unsaved changes</span>}
          <button onClick={onClose} className="text-xs font-medium border border-border/60 rounded px-3 py-1.5 hover:bg-muted/40 transition-colors ml-auto">Close</button>
          <button onClick={handleApply} disabled={!isDirty} className="text-xs font-medium bg-foreground text-background rounded px-3 py-1.5 hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">Validate & Apply</button>
        </div>
      </div>
    </div>
  )
}

// ─── Edge Editor ──────────────────────────────────────────────────────────────

function EdgeEditor({
  edge,
  onSave,
  onDelete,
  onClose,
}: {
  edge: Edge
  onSave: (id: string, label: string) => void
  onDelete: (id: string) => void
  onClose: () => void
}) {
  const [label, setLabel] = useState((edge.label as string) ?? "")

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between shrink-0"
        style={{ borderTop: "3px solid #94A3B8" }}>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">Relationship</span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {edge.source} → {edge.target}
          </span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Relationship Label
          </label>
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSave(edge.id, label)}
            placeholder="e.g. tagged as, aggregates into"
            className="text-sm bg-background border border-border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
          />
          <p className="text-[10px] text-muted-foreground">
            Describes the nature of the relationship between these two objects.
          </p>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-border/40 flex items-center gap-2 shrink-0">
        <button
          onClick={() => onDelete(edge.id)}
          className="text-xs font-medium text-red-500 border border-red-200 rounded px-3 py-1.5 hover:bg-red-50 transition-colors mr-auto"
        >
          Delete
        </button>
        <button
          onClick={onClose}
          className="text-xs font-medium border border-border/60 rounded px-3 py-1.5 hover:bg-muted/40 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(edge.id, label)}
          className="text-xs font-medium bg-foreground text-background rounded px-3 py-1.5 hover:opacity-80 transition-opacity"
        >
          Save
        </button>
      </div>
    </div>
  )
}

// ─── Model Canvas ─────────────────────────────────────────────────────────────

type PanelMode = "none" | "view" | "edit" | "add" | "edge"
type SaveStatus = "idle" | "saving" | "saved" | "error"

function ModelCanvas({ model, onObjectCountChange }: { model: ModelMeta; onObjectCountChange?: (id: string, count: number) => void }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<ObjectData>>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode]  = useState<Node<ObjectData> | null>(null)
  const [selectedEdge, setSelectedEdge]  = useState<Edge | null>(null)
  const [panelMode, setPanelMode]        = useState<PanelMode>("none")
  const [schemaOpen, setSchemaOpen]      = useState(false)
  const [loading, setLoading]            = useState(true)
  const [saveStatus, setSaveStatus]      = useState<SaveStatus>("idle")
  const reactFlowWrapper                 = useRef<HTMLDivElement>(null)
  const saveTimer                        = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load canvas on mount
  useEffect(() => {
    setLoading(true)
    dbLoadCanvas(model.id)
      .then(({ nodes: n, edges: e }) => { setNodes(n); setEdges(e) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [model.id])

  // Auto-save with 1.5s debounce
  const triggerSave = useCallback((currentNodes: Node<ObjectData>[], currentEdges: Edge[]) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaveStatus("saving")
    saveTimer.current = setTimeout(async () => {
      try {
        await dbSaveCanvas(model.id, currentNodes, currentEdges)
        setSaveStatus("saved")
        onObjectCountChange?.(model.id, currentNodes.length)
        setTimeout(() => setSaveStatus("idle"), 2000)
      } catch (err) {
        console.error(err)
        setSaveStatus("error")
      }
    }, 1500)
  }, [model.id, onObjectCountChange])

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => {
        const updated = addEdge({ ...connection, label: "relates to", style: { stroke: "#94A3B8" }, labelStyle: { fontSize: 10, fill: "#64748B" }, labelBgStyle: { fill: "#F8FAFC" } }, eds)
        triggerSave(nodes, updated)
        return updated
      })
    },
    [setEdges, nodes, triggerSave]
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as Node<ObjectData>)
    setPanelMode("view")
  }, [])

  const onPaneClick = useCallback(() => {
    if (panelMode !== "add") { setSelectedNode(null); setPanelMode("none") }
  }, [panelMode])

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge)
    setSelectedNode(null)
    setPanelMode("edge")
  }, [])

  function handleEdgeSave(id: string, label: string) {
    setEdges((eds) => {
      const updated = eds.map((e) =>
        e.id === id ? { ...e, label, labelStyle: { fontSize: 10, fill: "#64748B" }, labelBgStyle: { fill: "#F8FAFC" } } : e
      )
      triggerSave(nodes, updated)
      return updated
    })
    setPanelMode("none")
    setSelectedEdge(null)
  }

  function handleEdgeDelete(id: string) {
    setEdges((eds) => {
      const updated = eds.filter((e) => e.id !== id)
      triggerSave(nodes, updated)
      return updated
    })
    setPanelMode("none")
    setSelectedEdge(null)
  }

  // Trigger save on node position change (drag end)
  const onNodeDragStop = useCallback((_: React.MouseEvent, _node: Node, currentNodes: Node[]) => {
    triggerSave(currentNodes as Node<ObjectData>[], edges)
  }, [edges, triggerSave])

  function handleAddObject(data: ObjectData) {
    const id = `${data.label.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`
    const newNode: Node<ObjectData> = { id, type: "object-node", position: { x: 120 + Math.random() * 200, y: 120 + Math.random() * 200 }, data }
    setNodes((nds) => {
      const updated = [...nds, newNode]
      triggerSave(updated, edges)
      return updated
    })
    setPanelMode("none")
  }

  function handleEditObject(data: ObjectData, id?: string) {
    if (!id) return
    setNodes((nds) => {
      const updated = nds.map((n) => n.id === id ? { ...n, data } : n)
      triggerSave(updated, edges)
      return updated
    })
    setSelectedNode((prev) => prev ? { ...prev, data } : prev)
    setPanelMode("view")
  }

  function handleDeleteObject() {
    if (!selectedNode) return
    setNodes((nds) => {
      const updatedNodes = nds.filter((n) => n.id !== selectedNode.id)
      setEdges((eds) => {
        const updatedEdges = eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
        triggerSave(updatedNodes, updatedEdges)
        return updatedEdges
      })
      return updatedNodes
    })
    setSelectedNode(null); setPanelMode("none")
  }

  function handleSchemaApply({ nodes: newNodes, edges: newEdges }: { nodes: Node<ObjectData>[]; edges: Edge[] }) {
    setNodes(newNodes); setEdges(newEdges)
    triggerSave(newNodes, newEdges)
  }

  function handleExportSVG() {
    const svg = reactFlowWrapper.current?.querySelector(".react-flow__renderer svg")
    if (!svg) return
    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href = url; a.download = `${model.id}-model.svg`; a.click()
    URL.revokeObjectURL(url)
  }

  function handleCopyJSON() {
    const schema = {
      model: { id: model.id, name: model.name, description: model.description },
      objects: nodes.map((n) => ({ id: n.id, label: (n.data as ObjectData).label, layer: (n.data as ObjectData).layer, description: (n.data as ObjectData).description, attributes: (n.data as ObjectData).attributes, rules: (n.data as ObjectData).rules })),
      relationships: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, label: e.label })),
    }
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2))
  }

  if (loading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-muted/10">
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 border-2 border-border border-t-foreground rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground">Loading model…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="border-b border-border/40 px-4 py-2.5 flex items-center justify-between bg-background/95 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium text-foreground">{model.name}</h2>
          <span className="text-xs text-muted-foreground hidden sm:block">— {model.description}</span>
          {/* Save status */}
          <span className={`text-[10px] transition-opacity ${saveStatus === "idle" ? "opacity-0" : "opacity-100"} ${saveStatus === "saving" ? "text-muted-foreground" : saveStatus === "saved" ? "text-green-600" : "text-red-500"}`}>
            {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "✓ Saved" : saveStatus === "error" ? "Save failed" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-3 mr-3">
            {(Object.entries(LAYER_CONFIG) as [LayerType, typeof LAYER_CONFIG[LayerType]][]).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                <span className="text-[10px] text-muted-foreground">{cfg.label}</span>
              </div>
            ))}
          </div>
          <button onClick={() => { setSelectedNode(null); setPanelMode("add") }} className="text-xs font-medium bg-foreground text-background rounded px-3 py-1.5 hover:opacity-80 transition-opacity">+ Add Object</button>
          <button onClick={() => setSchemaOpen(true)} className="text-xs font-medium border border-border/60 rounded px-3 py-1.5 hover:bg-muted/40 transition-colors">Schema</button>
          <button onClick={handleExportSVG} className="text-xs font-medium border border-border/60 rounded px-3 py-1.5 hover:bg-muted/40 transition-colors">Export SVG</button>
          <button onClick={handleCopyJSON} className="text-xs font-medium border border-border/60 rounded px-3 py-1.5 hover:bg-muted/40 transition-colors">Copy JSON</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect} onNodeClick={onNodeClick}
            onPaneClick={onPaneClick} onNodeDragStop={onNodeDragStop}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.15 }}
            minZoom={0.25} maxZoom={1.5}
            defaultEdgeOptions={{ style: { stroke: "#94A3B8", strokeWidth: 1.5 } }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#E2E8F0" />
            <Controls style={{ button: { border: "1px solid #E2E8F0" } }} />
            <MiniMap nodeColor={(n) => LAYER_CONFIG[(n.data as ObjectData)?.layer]?.color ?? "#94A3B8"} style={{ border: "1px solid #E2E8F0", borderRadius: 8 }} />
            {nodes.length === 0 && (
              <Panel position="top-center">
                <div className="mt-20 flex flex-col items-center gap-2 text-center">
                  <p className="text-sm font-medium text-foreground">No objects yet</p>
                  <p className="text-xs text-muted-foreground">Click <strong>+ Add Object</strong> to start building this model.</p>
                </div>
              </Panel>
            )}
          </ReactFlow>
          {schemaOpen && <SchemaDrawer nodes={nodes as Node<ObjectData>[]} edges={edges} model={model} onApply={handleSchemaApply} onClose={() => setSchemaOpen(false)} />}
        </div>

        {panelMode !== "none" && (
          <div className="w-80 border-l border-border/40 bg-background flex flex-col h-full overflow-hidden shrink-0">
            {panelMode === "view"  && selectedNode && <ObjectViewer node={selectedNode} onEdit={() => setPanelMode("edit")} onClose={() => { setSelectedNode(null); setPanelMode("none") }} />}
            {panelMode === "edit"  && selectedNode && <ObjectForm mode="edit" initial={selectedNode} onSave={handleEditObject} onCancel={() => setPanelMode("view")} onDelete={handleDeleteObject} />}
            {panelMode === "add"   && <ObjectForm mode="add" onSave={handleAddObject} onCancel={() => setPanelMode("none")} />}
            {panelMode === "edge"  && selectedEdge && <EdgeEditor edge={selectedEdge} onSave={handleEdgeSave} onDelete={handleEdgeDelete} onClose={() => { setSelectedEdge(null); setPanelMode("none") }} />}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ModelStudioPage() {
  const [models, setModels]           = useState<ModelMeta[]>([])
  const [activeModel, setActiveModel] = useState<ModelMeta | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName]         = useState("")
  const [newDescription, setNewDesc]  = useState("")
  const [loadingModels, setLoadingModels] = useState(true)
  const [dbError, setDbError]         = useState<string | null>(null)

  // Load models + seed on mount
  useEffect(() => {
    dbSeedIfEmpty()
      .then(() => dbLoadModels())
      .then(setModels)
      .catch((err) => setDbError(err.message ?? "Failed to connect to database."))
      .finally(() => setLoadingModels(false))
  }, [])

  async function handleCreateModel() {
    if (!newName.trim()) return
    const model: ModelMeta = {
      id: `${newName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: newName.trim(),
      description: newDescription.trim(),
    }
    try {
      await dbCreateModel(model)
      setModels((prev) => [...prev, model])
      setNewName(""); setNewDesc(""); setShowNewForm(false)
      setActiveModel(model)
    } catch (err: unknown) {
      console.error(err)
    }
  }

  async function handleDuplicateModel(e: React.MouseEvent, model: ModelMeta) {
    e.stopPropagation()
    try {
      const copy = await dbDuplicateModel(model)
      setModels((prev) => [...prev, copy])
      setActiveModel(copy)
    } catch (err) {
      console.error(err)
    }
  }

  function handleObjectCountChange(modelId: string, count: number) {
    setModels((prev) => prev.map((m) => m.id === modelId ? { ...m, object_count: count } : m))
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-6">
          <Link href="/" className="text-xs font-medium uppercase tracking-widest text-[#FF5200] mb-2 inline-flex items-center gap-1.5 hover:opacity-70 transition-opacity">← Owners Strategy</Link>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mt-1">Model Studio</h1>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 89px)" }}>
        {/* Sidebar */}
        <aside className="w-64 border-r border-border/40 flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Models</span>
            <button onClick={() => setShowNewForm((v) => !v)} className="text-xs font-medium text-foreground border border-border/60 rounded px-2 py-1 hover:bg-muted/40 transition-colors">+ New</button>
          </div>

          {showNewForm && (
            <div className="px-4 py-3 border-b border-border/40 flex flex-col gap-3 bg-muted/20">
              <input autoFocus type="text" placeholder="Model name" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCreateModel()} className="text-sm bg-background border border-border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground w-full" />
              <textarea placeholder="Short description (optional)" value={newDescription} onChange={(e) => setNewDesc(e.target.value)} rows={2} className="text-sm bg-background border border-border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground w-full resize-none" />
              <div className="flex gap-2">
                <button onClick={handleCreateModel} className="flex-1 text-xs font-medium bg-foreground text-background rounded px-3 py-1.5 hover:opacity-80 transition-opacity">Create</button>
                <button onClick={() => setShowNewForm(false)} className="flex-1 text-xs font-medium border border-border/60 rounded px-3 py-1.5 hover:bg-muted/40 transition-colors">Cancel</button>
              </div>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto py-2">
            {loadingModels ? (
              <div className="px-4 py-6 flex justify-center">
                <div className="w-4 h-4 border-2 border-border border-t-foreground rounded-full animate-spin" />
              </div>
            ) : dbError ? (
              <div className="px-4 py-4">
                <p className="text-xs text-red-500 leading-relaxed">{dbError}</p>
              </div>
            ) : (
              models.map((model) => (
                <button key={model.id} onClick={() => setActiveModel(model)} className={`group w-full text-left px-4 py-3 transition-colors flex flex-col gap-1 border-b border-border/20 last:border-0 ${activeModel?.id === model.id ? "bg-muted/60" : "hover:bg-muted/30"}`}>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-medium text-foreground truncate">{model.name}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {model.object_count !== undefined && (
                        <span className="text-[10px] text-muted-foreground border border-border/40 rounded px-1.5 py-0.5">{model.object_count} obj</span>
                      )}
                      <button
                        onClick={(e) => handleDuplicateModel(e, model)}
                        title="Duplicate model"
                        className="text-[10px] text-muted-foreground hover:text-foreground border border-border/40 rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ⎘
                      </button>
                    </div>
                  </div>
                  {model.description && <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{model.description}</p>}
                </button>
              ))
            )}
          </nav>
        </aside>

        {/* Canvas */}
        <main className="flex-1 overflow-hidden">
          {activeModel ? (
            <ModelCanvas key={activeModel.id} model={activeModel} onObjectCountChange={handleObjectCountChange} />
          ) : (
            <div className="h-full flex items-center justify-center bg-muted/10">
              <div className="flex flex-col items-center gap-3 text-center max-w-xs px-6">
                <div className="w-12 h-12 rounded-lg border border-border/60 bg-background flex items-center justify-center text-xl">◻</div>
                <p className="text-sm font-medium text-foreground">No model selected</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Choose a model from the sidebar or create a new one.</p>
                <button onClick={() => setShowNewForm(true)} className="mt-1 text-xs font-medium bg-foreground text-background rounded px-4 py-2 hover:opacity-80 transition-opacity">+ New Model</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

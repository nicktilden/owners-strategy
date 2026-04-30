import Link from "next/link"

const workstreams = [
  {
    href: "/matrix",
    label: "Priority Matrix",
    description: "Weighted scoring of owner capabilities by value, impact, and readiness.",
  },
  {
    href: "/owners-top-10",
    label: "Owners Top 10",
    description: "The top 10 things every product team needs to know about the Owners segment.",
  },
  {
    href: "#",
    label: "The Loop",
    description: "Continuous feedback and signal tracking across the owner journey.",
    comingSoon: true,
  },
  {
    href: "#",
    label: "Owners Journey",
    description: "End-to-end mapping of the owner experience across key lifecycle stages.",
    comingSoon: true,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-10">
          <p className="text-xs font-medium uppercase tracking-widest text-[#FF5200] mb-3">
            Owners Strategy
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Owners Strategy
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl text-pretty">
            Strategic tools for understanding and prioritizing the owner segment. Select a workstream below.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 flex-1">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
          {workstreams.map((ws) => (
            <WorkstreamCard key={ws.label} {...ws} />
          ))}
        </div>
      </main>

      <footer className="border-t border-border/40">
        <div className="container mx-auto px-6 py-4 text-xs text-muted-foreground">
          Owners Strategy — Procore
        </div>
      </footer>
    </div>
  )
}

function WorkstreamCard({
  href,
  label,
  description,
  comingSoon,
}: {
  href: string
  label: string
  description: string
  comingSoon?: boolean
}) {
  const inner = (
    <div
      className={`group relative rounded-lg border p-6 transition-colors h-full flex flex-col gap-3 ${
        comingSoon
          ? "border-border/40 opacity-50 cursor-not-allowed"
          : "border-border/40 hover:border-border hover:bg-muted/40 cursor-pointer"
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-foreground">{label}</h2>
        {comingSoon && (
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground border border-border/60 rounded px-1.5 py-0.5">
            Soon
          </span>
        )}
        {!comingSoon && (
          <span className="text-muted-foreground group-hover:text-foreground transition-colors">→</span>
        )}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )

  if (comingSoon) return <div>{inner}</div>
  return <Link href={href}>{inner}</Link>
}

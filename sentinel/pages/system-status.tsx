import { SimplePage } from "@/components/layout/simple-page"

export default function SystemStatusPage() {
  return (
    <SimplePage
      title="System Status"
      description="Demo status page for Sentinel services."
    >
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#1D9E75]/10 text-[#1D9E75] px-3 py-1 text-[11px] font-black uppercase tracking-widest">
          All Systems Operational
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          This is a placeholder page in the demo build.
        </p>
      </div>
    </SimplePage>
  )
}


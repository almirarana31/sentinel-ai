import Link from "next/link"
import { SimplePage } from "@/components/layout/simple-page"

export default function ProtocolDocsPage() {
  return (
    <SimplePage
      title="Protocol Docs"
      description="Reference pages for training flows, compliance, and platform behavior (demo)."
    >
      <div className="space-y-2 text-sm font-medium">
        <div>
          <Link className="text-[#7F77DD] hover:underline" href="/learning-path">
            Learning Path
          </Link>
        </div>
        <div>
          <Link className="text-[#7F77DD] hover:underline" href="/certifications">
            Certifications
          </Link>
        </div>
        <div>
          <Link className="text-[#7F77DD] hover:underline" href="/compliance-api">
            Compliance API
          </Link>
        </div>
      </div>
    </SimplePage>
  )
}


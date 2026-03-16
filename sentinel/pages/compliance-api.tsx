import Link from "next/link"
import { SimplePage } from "@/components/layout/simple-page"

export default function ComplianceApiPage() {
  return (
    <SimplePage
      title="Compliance API"
      description="API documentation placeholder for compliance integrations."
    >
      <div className="space-y-2 text-sm text-muted-foreground font-medium">
        <p>
          This is a placeholder page. In a production build, this page would
          describe endpoints, auth, audit logs, and SCORM/xAPI integrations.
        </p>
        <p>
          For now, explore{" "}
          <Link className="text-[#7F77DD] hover:underline" href="/certifications">
            Certifications
          </Link>{" "}
          and{" "}
          <Link className="text-[#7F77DD] hover:underline" href="/admin-dashboard">
            Admin Dashboard
          </Link>
          .
        </p>
      </div>
    </SimplePage>
  )
}


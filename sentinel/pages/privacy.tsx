import { SimplePage } from "@/components/layout/simple-page"

export default function PrivacyPage() {
  return (
    <SimplePage
      title="Privacy Protocol"
      description="High-level privacy notes for the demo application."
    >
      <div className="space-y-2 text-sm text-muted-foreground font-medium">
        <p>
          This project is a demo UI and uses mock authentication state. Do not
          enter real personal or sensitive information.
        </p>
        <p>
          You can control optional consent (Marketing, Biometrik, Data Anak)
          anytime via the "Manage Consent" control in the UI.
        </p>
        <p>
          Any analytics, data retention, and security policies should be added
          here for a production deployment.
        </p>
      </div>
    </SimplePage>
  )
}


export type MockCourseStatus = "Assigned" | "In Progress" | "Completed"

export type MockCourse = {
  id: string
  title: string
  category: string
  image: string

  progress: number
  timeRemaining: string
  xpValue: number
  deadline: string | null
  assigned: boolean
  status: MockCourseStatus

  estTime: string
  prerequisites: string[]
  syllabus: string[]
}

export const mockCourses: MockCourse[] = [
  {
    id: "1",
    title: "Risk Assessment Fundamentals",
    category: "Compliance",
    progress: 72,
    timeRemaining: "45m left",
    xpValue: 1200,
    deadline: "2026-03-20",
    assigned: true,
    status: "In Progress",
    estTime: "2h 45m",
    prerequisites: ["Basic safety orientation", "Company policy overview"],
    syllabus: [
      "Threat modeling basics",
      "Risk scoring frameworks",
      "Incident response playbook",
      "Case study: near-miss analysis",
      "Knowledge check + reflection",
    ],
    image:
      "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "2",
    title: "Neural Network Architecture",
    category: "AI & ML",
    progress: 45,
    timeRemaining: "2h 10m left",
    xpValue: 2500,
    deadline: null,
    assigned: false,
    status: "In Progress",
    estTime: "4h 10m",
    prerequisites: ["Python fundamentals", "Linear algebra basics"],
    syllabus: [
      "Perceptrons and activation functions",
      "Backpropagation intuition",
      "CNNs in industrial vision",
      "RNNs and sequence data",
      "Knowledge check + mini assessment",
    ],
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "3",
    title: "Industrial Safety Protocols",
    category: "Safety",
    progress: 100,
    timeRemaining: "Completed",
    xpValue: 800,
    deadline: "2026-03-10",
    assigned: true,
    status: "Completed",
    estTime: "1h 30m",
    prerequisites: ["PPE checklist", "Site induction"],
    syllabus: [
      "High-risk work permits",
      "Lockout/tagout procedures",
      "Hazard communication",
      "Emergency escalation ladder",
      "Knowledge check + recap",
    ],
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "4",
    title: "Data Ethics & Governance",
    category: "Compliance",
    progress: 0,
    timeRemaining: "3h 30m",
    xpValue: 1500,
    deadline: "2026-04-01",
    assigned: true,
    status: "Assigned",
    estTime: "3h 05m",
    prerequisites: ["Privacy basics", "Company data classification policy"],
    syllabus: [
      "Data minimization principles",
      "Consent and lawful basis",
      "Retention and deletion policies",
      "Audit-ready documentation",
      "Knowledge check + mini assessment",
    ],
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
  },
]

export function getMockCourseById(courseId: string | undefined) {
  if (!courseId) return mockCourses[0]!
  return mockCourses.find((course) => course.id === courseId) ?? mockCourses[0]!
}


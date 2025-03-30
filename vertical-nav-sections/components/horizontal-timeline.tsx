import type React from "react"

interface TimelinePhase {
  name: string
  duration: number
  unit: "weeks" | "days"
}

const HorizontalTimeline: React.FC = () => {
  const phases: TimelinePhase[] = [
    { name: "Wireframe faza", duration: 2, unit: "weeks" },
    { name: "Art direkcija", duration: 1, unit: "weeks" },
    { name: "Faza dizajna", duration: 7, unit: "weeks" },
    { name: "Faza razvoja", duration: 24, unit: "weeks" },
    { name: "Testiranje", duration: 2, unit: "weeks" },
    { name: "Garantni period", duration: 30, unit: "days" },
  ]

  const totalWeeks = phases.reduce((total, phase) => {
    return total + (phase.unit === "weeks" ? phase.duration : phase.duration / 7)
  }, 0)

  return (
    <div className="mt-8 mb-12">
      <div className="relative">
        <div className="h-1 bg-secondary rounded-full"></div>
        {phases.map((phase, index) => {
          const startPercentage =
            (phases.slice(0, index).reduce((total, p) => {
              return total + (p.unit === "weeks" ? p.duration : p.duration / 7)
            }, 0) /
              totalWeeks) *
            100
          const widthPercentage = ((phase.unit === "weeks" ? phase.duration : phase.duration / 7) / totalWeeks) * 100

          return (
            <div
              key={phase.name}
              className="absolute top-0"
              style={{ left: `${startPercentage}%`, width: `${widthPercentage}%` }}
            >
              <div className="h-3 bg-primary rounded-full"></div>
              <div className="absolute top-4 left-0 transform -translate-x-1/2 w-24 text-center">
                <div className="text-xs font-medium">{phase.name}</div>
                <div className="text-xs text-muted-foreground">
                  {phase.duration} {phase.unit}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HorizontalTimeline


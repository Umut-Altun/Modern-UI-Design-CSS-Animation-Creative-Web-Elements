import type React from "react"

interface TimelinePhase {
  name: string
  duration: number
  unit: "weeks"
  color: string
}

const GanttTimeline: React.FC = () => {
  const phases: TimelinePhase[] = [
    { name: "Wireframe faza", duration: 2, unit: "weeks", color: "bg-blue-500" },
    { name: "Art direkcija", duration: 1, unit: "weeks", color: "bg-green-500" },
    { name: "Faza dizajna", duration: 7, unit: "weeks", color: "bg-yellow-500" },
    { name: "Faza razvoja", duration: 24, unit: "weeks", color: "bg-red-500" },
    { name: "Testiranje", duration: 2, unit: "weeks", color: "bg-purple-500" },
  ]

  const totalWeeks = phases.reduce((total, phase) => total + phase.duration, 0)

  return (
    <div className="mt-8 mb-12">
      <div className="w-full">
        {phases.map((phase, index) => {
          const startWeek = phases.slice(0, index).reduce((total, p) => total + p.duration, 0)
          const widthPercentage = (phase.duration / totalWeeks) * 100

          return (
            <div key={phase.name} className="mb-4 flex items-center">
              <div className="w-1/4 pr-4 text-sm font-medium">{phase.name}</div>
              <div className="w-3/4 relative">
                <div className="h-8 bg-secondary rounded-full"></div>
                <div
                  className={`absolute top-0 h-8 ${phase.color} rounded-full`}
                  style={{ left: `${(startWeek / totalWeeks) * 100}%`, width: `${widthPercentage}%` }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                    {phase.duration} {phase.unit}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GanttTimeline


import type React from "react"

interface TimelinePhase {
  name: string
  duration: string
}

const ProjectTimelineTable: React.FC = () => {
  const phases: TimelinePhase[] = [
    { name: "Wireframe faza (Wireframe)", duration: "2 nedelje" },
    { name: "Art direkcija", duration: "1 nedelja" },
    { name: "Faza dizajna", duration: "7 nedelja" },
    { name: "Faza razvoja", duration: "24 nedelje" },
    { name: "Testiranje", duration: "2 nedelje" },
    { name: "Garantni period", duration: "30 dana" },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-secondary text-secondary-foreground">
            <th className="py-3 px-4 text-left font-semibold w-2/3">Faza projekta</th>
            <th className="py-3 px-4 text-left font-semibold w-1/3">Trajanje</th>
          </tr>
        </thead>
        <tbody>
          {phases.map((phase, index) => (
            <tr key={phase.name} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="py-3 px-4 border-t">{phase.name}</td>
              <td className="py-3 px-4 border-t">{phase.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProjectTimelineTable


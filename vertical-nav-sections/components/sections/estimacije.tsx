import Section from "@/components/section"
import { Lorem } from "@/components/lorem"

export default function Estimacije() {
  return (
    <Section id="section8" title="Estimacije">
      <h3 className="text-xl font-semibold mb-4">Pregled Estimacija</h3>
      <Lorem paragraphs={2} />

      <h4 className="text-lg font-semibold mt-6 mb-2">Metodologija</h4>
      <Lorem paragraphs={1} />

      <h4 className="text-lg font-semibold mt-6 mb-2">Faktori Uticaja</h4>
      <Lorem paragraphs={2} />

      <h4 className="text-lg font-semibold mt-6 mb-2">Proces Estimacije</h4>
      <Lorem paragraphs={1} />

      <h4 className="text-lg font-semibold mt-6 mb-2">Zaključak</h4>
      <Lorem paragraphs={1} />
    </Section>
  )
}


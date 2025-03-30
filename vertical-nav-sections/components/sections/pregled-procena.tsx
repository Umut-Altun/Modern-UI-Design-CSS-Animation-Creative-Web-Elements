import Section from "@/components/section"
import PricingList from "@/components/pricing-list"
import ProjectTimelineTable from "@/components/project-timeline-table"

export default function PregledProcena() {
  return (
    <Section id="cost-overview" title="Pregled procena">
      <p className="mb-4">
        U svakom projektu, tačna procena je ključna kako bi se osigurao usklađenost između očekivanja klijenta i resursa
        potrebnih za ispunjenje uspešnog rezultata. U Builtt-u, pratimo strukturirani proces za procenu kako vremenskih
        okvira tako i troškova koji su uključeni u svaku fazu projekta, osiguravajući transparentnost i jasno
        razumevanje isporuka.
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-4">Proces procene podeljen je u sledeće faze:</h3>
      <h4 className="text-lg font-semibold mt-4 mb-2">Procena opsega projekta</h4>
      <p className="mb-4">
        Počinjemo analizom opsega projekta, uključujući sve zahteve, funkcionalnosti i specifikacije dizajna. Ovo nam
        pomaže da razumemo celokupan obim rada i identifikujemo potencijalne složenosti ili dodatne zahteve koji se mogu
        pojaviti.
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Cilj lansiranja: Oktobar 2025</li>
        <li>Trajanje projekta: 8-9 meseci</li>
        <li>Tokom trajanja projekta: Dvo-nedeljni sastanci; Mesečni izveštaji;</li>
      </ul>
      <h4 className="text-lg font-semibold mt-8 mb-4">Vremenske procene</h4>
      <p className="mb-4">
        Na osnovu opsega projekta, naš tim procenjuje vreme potrebno za završavanje svake faze projekta, od otkrivanja i
        strategije do dizajna, razvoja i lansiranja. Ove vremenske procene zasnivamo na našem prethodnom iskustvu,
        industrijskim standardima i složenosti rada koji je uključen.
      </p>
      <div className="mb-8">
        <ProjectTimelineTable />
      </div>

      <h4 className="text-lg font-semibold mt-8 mb-4">Troškovne procene</h4>
      <p className="mb-4">
        Kada su vremenske procene jasne, izračunavamo ukupne troškove projekta na osnovu naših satnica i vremena
        potrebnog za svaku fazu. Takođe, uzimamo u obzir bilo koje dodatne troškove, kao što su alati trećih strana,
        licence ili integracije koje će biti potrebne za završavanje projekta.
      </p>
      <div className="mb-8">
        <PricingList />
      </div>
      <h4 className="text-lg font-semibold mt-4 mb-2">Fleksibilnost i prilagođavanja</h4>
      <p className="mb-4">
        Iako su naše procene što tačnije, razumemo da se mogu pojaviti nepredviđeni izazovi. Ako bude potrebno bilo
        kakve promene ili dodatni rad, pružićemo ažurirane procene i vremenske okvire kako bi se osiguralo da projekat
        bude na pravom putu.
      </p>
      <h4 className="text-lg font-semibold mt-4 mb-2">Kontinuirana komunikacija</h4>
      <p className="mb-4">
        Tokom projekta, održavamo otvorenu komunikaciju sa našim klijentima kako bismo osigurali da projekat napreduje
        kako je planirano. Svaka odstupanja od početnih procena biće diskutovana, a revidirani vremenski okviri ili
        troškovi će biti blagovremeno saopšteni.
      </p>
      <p className="mt-6">
        Razbijanjem projekta u jasne faze i pružanjem detaljnih procena, naš cilj je da klijentima pružimo transparentan
        i predvidljiv put ka uspehu. Ovaj proces nam omogućava da upravljamo očekivanjima, efikasno raspodelimo resurse
        i osiguramo pravovremenu isporuku.
      </p>
    </Section>
  )
}


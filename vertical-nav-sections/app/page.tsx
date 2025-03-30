"use client"

import { useRef } from "react"
import TableOfContents from "@/components/table-of-contents"
import HeroSection from "@/components/hero-section"
import AboutBuiltt from "@/components/sections/about-builtt"
import AboutProject from "@/components/sections/about-project"
import ProjectPhases from "@/components/sections/project-phases"
import ProjectBenefits from "@/components/sections/project-benefits"
import TermsAndConditions from "@/components/sections/terms-and-conditions"
import TermsOfPayment from "@/components/sections/terms-of-payment"
import OptionalServices from "@/components/sections/optional-services"
import PregledProcena from "@/components/sections/pregled-procena"
import Footer from "@/components/footer"

export default function Home() {
  const firstSectionRef = useRef<HTMLElement>(null)

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection nextSectionRef={firstSectionRef} />
      <div className="bg-primary text-primary-foreground flex-grow">
        <div className="container mx-auto px-4 py-8 flex gap-8">
          <TableOfContents />
          <main className="flex-1">
            <AboutBuiltt />
            <AboutProject />
            <ProjectPhases />
            <ProjectBenefits />
            <PregledProcena />
            <TermsOfPayment />
            <OptionalServices />
            <TermsAndConditions />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}


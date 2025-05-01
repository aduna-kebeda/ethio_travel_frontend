"use client"

import { Container } from "@/components/container"
import LandingPageContent from "./landingpage/page.tsx"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-12 md:py-16">
        <Container>
          {/* Hero Section */}
          <LandingPageContent />
        </Container>
      </section>
    </div>
  )
}

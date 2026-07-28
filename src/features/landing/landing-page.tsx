"use client";

import { CtaSection } from "@/features/landing/cta-section";
import { FeaturesSection } from "@/features/landing/features-section";
import { HeroSection } from "@/features/landing/hero-section";
import { LandingFooter } from "@/features/landing/landing-footer";
import { LandingNav } from "@/features/landing/landing-nav";
import { PreviewSection } from "@/features/landing/preview-section";
import { PricingSection } from "@/features/landing/pricing-section";
import { ProblemSection } from "@/features/landing/problem-section";
import { SolutionSection } from "@/features/landing/solution-section";
import { TestimonialsSection } from "@/features/landing/testimonials-section";
import { getLandingContent } from "@/services/landing";

export function LandingPage() {
  const content = getLandingContent();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="relative z-10">
        <LandingNav />
        <main>
          <HeroSection />
          <ProblemSection
            problems={content.problems}
            beforeAfter={content.beforeAfter}
          />
          <SolutionSection steps={content.workflow} />
          <FeaturesSection features={content.features} />
          <PreviewSection />
          <TestimonialsSection
            testimonials={content.testimonials}
            logos={content.logos}
            trustMetrics={content.trustMetrics}
          />
          <PricingSection pricing={content.pricing} />
          <CtaSection cta={content.cta} />
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}

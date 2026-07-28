import landing from "@/mock/landing.json";

export interface LandingProblem {
  id: string;
  title: string;
  description: string;
}

export interface LandingBeforeAfter {
  before: string[];
  after: string[];
}

export interface LandingWorkflowStep {
  id: string;
  title: string;
  description: string;
}

export interface LandingFeature {
  id: string;
  title: string;
  description: string;
}

export interface LandingTestimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  community: string;
}

export interface LandingTrustMetric {
  id: string;
  value: string;
  suffix: string;
  label: string;
}

export interface LandingLogo {
  id: string;
  name: string;
}

export interface LandingPricing {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
}

export interface LandingCta {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
}

export interface LandingContent {
  problems: LandingProblem[];
  beforeAfter: LandingBeforeAfter;
  workflow: LandingWorkflowStep[];
  features: LandingFeature[];
  trustMetrics: LandingTrustMetric[];
  logos: LandingLogo[];
  testimonials: LandingTestimonial[];
  pricing: LandingPricing;
  cta: LandingCta;
}

export function getLandingContent(): LandingContent {
  return landing as LandingContent;
}

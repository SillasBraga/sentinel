import { OnboardingFlow } from "@/features/onboarding/onboarding-flow";
export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) { const params = await searchParams; return <div className="fixed inset-0 z-50 overflow-auto"><OnboardingFlow error={params.error} /></div>; }

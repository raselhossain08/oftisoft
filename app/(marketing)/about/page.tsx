
import FounderIntro from "@/components/sections/about/founder-intro";
import CompanyTimeline from "@/components/sections/about/company-timeline";
import MissionValues from "@/components/sections/about/mission-values";
import TeamShowcase from "@/components/sections/about/team-showcase";
import OfficeCulture from "@/components/sections/about/office-culture";
import Awards from "@/components/sections/about/awards";
import CTA from "@/components/sections/cta"; // Reuse CTA from home

export default function AboutPage() {
    return (
        <main className="flex min-h-screen flex-col bg-background text-foreground overflow-hidden">
            <FounderIntro />
            <MissionValues />
            <CompanyTimeline />
            <TeamShowcase />
            <OfficeCulture />
            <Awards />
            <CTA />
        </main>
    );
}


import ServicesOverview from "@/components/sections/services-page/services-overview";
import ServiceComparison from "@/components/sections/services-page/service-comparison";
import ServicePackages from "@/components/sections/services-page/service-packages";
import ServiceProcess from "@/components/sections/services-page/service-process";
import ServiceFAQ from "@/components/sections/services-page/service-faq";
import ServiceTechStack from "@/components/sections/services-page/service-tech-stack";
import CTA from "@/components/sections/cta";

export default function ServicesPage() {
    return (
        <main className="flex min-h-screen flex-col bg-background text-foreground overflow-hidden">
            <ServicesOverview />
            <ServiceComparison />
            <ServicePackages />
            <ServiceProcess />
            <ServiceTechStack />
            <ServiceFAQ />
            <CTA />
        </main>
    );
}

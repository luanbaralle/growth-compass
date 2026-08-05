import { JsonLd } from "@/components/seo/JsonLd";
import { HomeFooter } from "@/components/home/HomeFooter";
import { HomeNav } from "@/components/home/HomeNav";
import { HomeDiagnosticSection } from "@/components/home/sections/HomeDiagnosticSection";
import { HomeFinalCTASection } from "@/components/home/sections/HomeFinalCTASection";
import { HomeHeroSection } from "@/components/home/sections/HomeHeroSection";
import { HomePhilosophySection } from "@/components/home/sections/HomePhilosophySection";
import { HomeProcessSection } from "@/components/home/sections/HomeProcessSection";
import { HomeProjectsSection } from "@/components/home/sections/HomeProjectsSection";
import { HomeSolutionsSection } from "@/components/home/sections/HomeSolutionsSection";
import { HomeTechnologySection } from "@/components/home/sections/HomeTechnologySection";
import { HomeBlogSection } from "@/components/home/sections/HomeBlogSection";
import { HomeTestimonialsSection } from "@/components/home/sections/HomeTestimonialsSection";
import { homeSchemas } from "@/lib/seo/pages";
import { captureUtmFromUrl } from "@/lib/utm";
import { useEffect } from "react";

export function HomePage() {
  useEffect(() => {
    captureUtmFromUrl();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <JsonLd data={homeSchemas()} />
      <HomeNav />
      <main id="main-content">
        <HomeHeroSection />
        <HomePhilosophySection />
        <HomeSolutionsSection />
        <HomeProjectsSection />
        <HomeProcessSection />
        <HomeTechnologySection />
        <HomeDiagnosticSection />
        <HomeTestimonialsSection />
        <HomeBlogSection />
        <HomeFinalCTASection />
      </main>
      <HomeFooter />
    </div>
  );
}

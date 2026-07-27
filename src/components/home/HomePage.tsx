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
import { HomeTestimonialsSection } from "@/components/home/sections/HomeTestimonialsSection";
import { captureUtmFromUrl } from "@/lib/utm";
import { useEffect } from "react";

export function HomePage() {
  useEffect(() => {
    captureUtmFromUrl();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <HomeNav />
      <main>
        <HomeHeroSection />
        <HomePhilosophySection />
        <HomeSolutionsSection />
        <HomeProjectsSection />
        <HomeProcessSection />
        <HomeTechnologySection />
        <HomeDiagnosticSection />
        <HomeTestimonialsSection />
        <HomeFinalCTASection />
      </main>
      <HomeFooter />
    </div>
  );
}

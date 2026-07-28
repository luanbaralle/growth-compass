import { HomeFooter } from "@/components/home/HomeFooter";
import { HomeNav } from "@/components/home/HomeNav";
import { JsonLd } from "@/components/seo/JsonLd";
import type { JsonLdObject } from "@/lib/seo/types";
import { captureUtmFromUrl } from "@/lib/utm";
import { useEffect, type ReactNode } from "react";

interface MarketingLayoutProps {
  children: ReactNode;
  schemas?: JsonLdObject[];
}

export function MarketingLayout({ children, schemas }: MarketingLayoutProps) {
  useEffect(() => {
    captureUtmFromUrl();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {schemas && schemas.length > 0 && <JsonLd data={schemas} />}
      <HomeNav />
      <main id="main-content">{children}</main>
      <HomeFooter />
    </div>
  );
}

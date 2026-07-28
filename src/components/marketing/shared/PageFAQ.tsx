import {
  SectionDescription,
  SectionEyebrow,
  SectionShell,
  SectionTitle,
} from "@/components/home/shared/SectionShell";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { HomeFaqItem } from "@/lib/home/content";
import { faqSchema } from "@/lib/seo/schema";

interface PageFAQProps {
  title?: string;
  description?: string;
  items: HomeFaqItem[];
}

export function PageFAQ({
  title = "Perguntas frequentes",
  description = "Respostas diretas sobre como trabalhamos.",
  items,
}: PageFAQProps) {
  return (
    <SectionShell className="border-b border-border/60 py-20 lg:py-28">
      <JsonLd data={faqSchema(items)} />
      <div className="max-w-2xl">
        <SectionEyebrow>FAQ</SectionEyebrow>
        <SectionTitle>{title}</SectionTitle>
        <SectionDescription>{description}</SectionDescription>
      </div>

      <Accordion type="single" collapsible className="mt-10 max-w-3xl">
        {items.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`} className="border-border/80">
            <AccordionTrigger className="text-left text-base hover:no-underline hover:text-brand">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SectionShell>
  );
}

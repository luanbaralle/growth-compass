import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionShell, SectionTitle } from "@/components/home/shared/SectionShell";
import { faqItems } from "@/lib/home/content";
import testimonialPhoto from "@/assets/juliana-martins.png";

export function HomeTestimonialsSection() {
  return (
    <SectionShell className="border-t border-border/60 py-20 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionTitle className="mt-0">O que nossos clientes dizem</SectionTitle>
          <figure className="mt-8 rounded-[1.5rem] border border-border bg-surface/30 p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <img
                src={testimonialPhoto}
                alt="Juliana Martins"
                className="h-14 w-14 rounded-full object-cover ring-2 ring-brand/20"
              />
              <figcaption>
                <p className="font-semibold text-foreground">Juliana Martins</p>
                <p className="text-sm text-muted-foreground">Empresária — Segmento de Saúde</p>
              </figcaption>
            </div>
            <blockquote className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              "A Raise One não entregou apenas campanhas. Eles entenderam nosso negócio,
              construíram a estratégia e hoje temos previsibilidade no crescimento."
            </blockquote>
          </figure>
        </div>

        <div>
          <SectionTitle className="mt-0">Perguntas Frequentes</SectionTitle>
          <Accordion type="single" collapsible className="mt-8">
            {faqItems.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`} className="border-border/80">
                <AccordionTrigger className="text-left text-base hover:no-underline hover:text-brand">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </SectionShell>
  );
}

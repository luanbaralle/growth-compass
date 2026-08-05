import type { CaseGalleryItem } from "@/types/case";
import { motion } from "framer-motion";
import { MockupLaptop } from "./showcase";
import { CaseImage } from "./CaseImage";
import { CaseEyebrow, CaseHeading, CaseReveal, CaseSection } from "./shared/CaseSection";
import { fadeUp, scaleIn, viewportOnce } from "./shared/motion";

interface GallerySectionProps {
  gallery: CaseGalleryItem[];
}

type LayoutBlock =
  | { type: "hero"; item: CaseGalleryItem }
  | { type: "duo"; items: [CaseGalleryItem, CaseGalleryItem] }
  | { type: "wide"; item: CaseGalleryItem }
  | { type: "mockup"; item: CaseGalleryItem };

/** Distribui itens da galeria em layouts editoriais variados. */
function buildEditorialLayout(items: CaseGalleryItem[]): LayoutBlock[] {
  const blocks: LayoutBlock[] = [];
  let i = 0;

  while (i < items.length) {
    const remaining = items.length - i;

    if (remaining >= 3 && blocks.length % 2 === 0) {
      blocks.push({ type: "hero", item: items[i]! });
      i += 1;
    } else if (remaining >= 2) {
      blocks.push({ type: "duo", items: [items[i]!, items[i + 1]!] });
      i += 2;
    } else if (remaining === 1 && blocks.length % 3 === 1) {
      blocks.push({ type: "mockup", item: items[i]! });
      i += 1;
    } else {
      blocks.push({ type: "wide", item: items[i]! });
      i += 1;
    }
  }

  return blocks;
}

function GalleryHero({ item }: { item: CaseGalleryItem }) {
  return (
    <motion.figure
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={scaleIn}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06]"
    >
      <CaseImage
        src={item.src}
        alt={item.alt}
        className="aspect-[16/9] w-full min-h-[320px] transition-transform duration-700 group-hover:scale-[1.02] sm:min-h-[480px]"
      />
      {item.caption && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-5 text-sm text-white/80">
          {item.caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

function GalleryDuo({ items }: { items: [CaseGalleryItem, CaseGalleryItem] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
      {items.map((item) => (
        <motion.figure
          key={item.src}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="group overflow-hidden rounded-2xl border border-white/[0.06]"
        >
          <CaseImage
            src={item.src}
            alt={item.alt}
            className="aspect-[3/4] w-full transition-transform duration-700 group-hover:scale-[1.03] sm:aspect-[4/5]"
          />
          {item.caption && (
            <figcaption className="px-4 py-3 text-xs text-muted-foreground">{item.caption}</figcaption>
          )}
        </motion.figure>
      ))}
    </div>
  );
}

function GalleryWide({ item }: { item: CaseGalleryItem }) {
  return (
    <motion.figure
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={scaleIn}
      className="group -mx-5 overflow-hidden sm:-mx-8 sm:rounded-2xl sm:border sm:border-white/[0.06]"
    >
      <CaseImage
        src={item.src}
        alt={item.alt}
        className="aspect-[21/9] w-full min-h-[200px] transition-transform duration-700 group-hover:scale-[1.01] sm:min-h-[320px]"
      />
    </motion.figure>
  );
}

export function GallerySection({ gallery }: GallerySectionProps) {
  if (gallery.length === 0) return null;

  const blocks = buildEditorialLayout(gallery);

  return (
    <CaseSection variant="dark" className="py-24 sm:py-32 lg:py-40">
      <CaseReveal className="mx-auto mb-16 max-w-2xl text-center sm:mb-20">
        <CaseEyebrow>Galeria</CaseEyebrow>
        <CaseHeading>Visuais do projeto</CaseHeading>
      </CaseReveal>

      <div className="space-y-8 sm:space-y-12">
        {blocks.map((block, index) => {
          const key = `${block.type}-${index}`;

          switch (block.type) {
            case "hero":
              return <GalleryHero key={key} item={block.item} />;
            case "duo":
              return <GalleryDuo key={key} items={block.items} />;
            case "wide":
              return <GalleryWide key={key} item={block.item} />;
            case "mockup":
              return (
                <div key={key} className="py-8">
                  <MockupLaptop src={block.item.src} alt={block.item.alt} />
                </div>
              );
          }
        })}
      </div>
    </CaseSection>
  );
}

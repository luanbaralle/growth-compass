import type { BlogFaqItem, BlogSection } from "@/lib/blog/types";

export function p(text: string): BlogSection {
  return { kind: "paragraph", text };
}

export function h2(text: string, id?: string): BlogSection {
  return { kind: "heading", text, level: 2, id };
}

export function h3(text: string, id?: string): BlogSection {
  return { kind: "heading", text, level: 3, id };
}

export function ul(items: string[]): BlogSection {
  return { kind: "list", items };
}

export function ol(items: string[]): BlogSection {
  return { kind: "list", items, ordered: true };
}

export function callout(text: string, title?: string): BlogSection {
  return { kind: "callout", text, title };
}

export function img(src: string, alt: string, caption?: string): BlogSection {
  return { kind: "image", src, alt, caption };
}

export function quote(text: string, author?: string): BlogSection {
  return { kind: "quote", text, author };
}

export function table(headers: string[], rows: string[][]): BlogSection {
  return { kind: "table", headers, rows };
}

export function cta(input: {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}): BlogSection {
  return { kind: "cta", ...input };
}

export function linkCard(input: {
  label: string;
  href: string;
  type: "case" | "segment" | "solution" | "article";
  description?: string;
}): BlogSection {
  return { kind: "linkCard", ...input };
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function estimateWordCount(sections: BlogSection[]): number {
  let count = 0;
  for (const section of sections) {
    switch (section.kind) {
      case "paragraph":
      case "callout":
      case "quote":
        count += section.text.split(/\s+/).length;
        break;
      case "heading":
        count += section.text.split(/\s+/).length;
        break;
      case "list":
        count += section.items.join(" ").split(/\s+/).length;
        break;
      case "comparison":
        count +=
          section.left.items.join(" ").split(/\s+/).length +
          section.right.items.join(" ").split(/\s+/).length;
        break;
      case "table":
        count += section.rows.flat().join(" ").split(/\s+/).length;
        break;
      case "cta":
      case "linkCard":
        count += `${section.title ?? section.label} ${section.description ?? ""}`.split(/\s+/).length;
        break;
      default:
        break;
    }
  }
  if (sections.some((s) => s.kind === "cta" && "title" in s)) {
    /* cta counted above */
  }
  return count;
}

export function estimateReadTime(sections: BlogSection[], faq?: BlogFaqItem[]): string {
  let words = estimateWordCount(sections);
  if (faq) {
    words += faq.map((f) => `${f.question} ${f.answer}`).join(" ").split(/\s+/).length;
  }
  const minutes = Math.max(5, Math.ceil(words / 200));
  return `${minutes} min`;
}

/** @deprecated Use blogFeatured, blogOg ou blogInline from ./images */
export { blogFeatured, blogOg, blogInline, blogImageAlt, blogThumbnail, blogImage } from "@/lib/blog/images";

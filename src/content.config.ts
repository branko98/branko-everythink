import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One .mdx file per case study in src/content/case-studies/.
// The file name becomes the URL: tapi.mdx → /case-studies/tapi/
const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(), // page <title> / SEO
    // on-page headline, split like the homepage hero: grey part, then black part
    titleMuted: z.string().optional(),
    titleStrong: z.string().optional(),
    titleStrongFirst: z.boolean().default(false), // true: black part before the grey part
    lead: z.string(),
    // headline numbers shown in a row under the title
    results: z.array(z.object({ value: z.string(), label: z.string().optional(), sentence: z.string().optional() })).default([]),
    disciplines: z.array(z.string()).default([]),
    // closing row: checklist for the reader + dark CTA band
    closing: z
      .object({
        eyebrow: z.string(),
        title: z.string(),
        sub: z.string(),
        steps: z.array(z.object({ q: z.string(), text: z.string() })),
        summary: z.string(),
        button: z.object({ label: z.string(), href: z.string() }),
      })
      .optional(),
    footnote: z.string().optional(),
    // full-width chart between the title block and the article
    heroChart: z
      .object({
        title: z.string(),
        sub: z.string(),
        caption: z.string(),
        data: z.array(z.number()),
        band: z.object({ to: z.number(), label: z.string(), text: z.string() }),
        markers: z.array(z.object({ at: z.number(), label: z.string(), text: z.string() })),
        months: z.array(z.string()),
        delta: z.string(),
      })
      .optional(),
    date: z.coerce.date(),
    tag: z.string().default('Case study'),
    author: z
      .object({ name: z.string(), photo: z.string() })
      .default({ name: 'Branko Jovanovic', photo: '/branko.jpg' }),
    client: z.object({ name: z.string(), category: z.string(), logo: z.string() }),
    // chart shown inside the article with <ResultChart data={props.chart} />
    chart: z
      .object({
        data: z.array(z.number()),
        labels: z.array(z.string()),
        metrics: z.array(z.object({ label: z.string(), value: z.string() })),
        caption: z.string().optional(),
      })
      .optional(),
    // quiet note shown just before the testimonial
    footnote: z.string().optional(),
    // testimonial block at the end of the page (falls back to the homepage one)
    testimonial: z
      .object({
        logo: z.string(),
        name: z.string(),
        role: z.string(),
        company: z.string(),
        companyHref: z.string().optional(),
        avatar: z.string().optional(),
        paragraphs: z.array(z.string()),
        details: z.array(z.object({ label: z.string(), value: z.string(), href: z.string().optional(), hideOnMobile: z.boolean().optional() })),
      })
      .optional(),
  }),
});

export const collections = { 'case-studies': caseStudies };

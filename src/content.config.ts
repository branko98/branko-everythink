import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One .mdx file per case study in src/content/case-studies/.
// The file name becomes the URL: tapi.mdx → /case-studies/tapi/
const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    lead: z.string(),
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
    // testimonial block at the end of the page (falls back to the homepage one)
    testimonial: z
      .object({
        logo: z.string(),
        name: z.string(),
        role: z.string(),
        company: z.string(),
        avatar: z.string().optional(),
        paragraphs: z.array(z.string()),
        details: z.array(z.object({ label: z.string(), value: z.string(), href: z.string().optional() })),
      })
      .optional(),
  }),
});

export const collections = { 'case-studies': caseStudies };

// All homepage copy lives here. Edit text without touching the design.
// Headline parts: `muted` renders grey, `strong` renders near-black.
// Inside quotes/table text, wrap a phrase in [[double brackets]] to highlight it.

export const site = {
  title: 'Everythink – B2B SaaS growth, from the first ad to the closed deal',
  description:
    'Seven years building growth for B2B SaaS - the channels, the tracking, the CRM, and the systems that connect them.',
  ctaLabel: 'Get started',
};

export const hero = {
  muted: "B2B SaaS companies don't have an ads problem. They have a leak between the ad, the site, the CRM and sales and ",
  strong: 'nobody owns the whole chain.',
  sub: 'Seven years building growth for B2B SaaS - the channels, the tracking, the CRM, and the systems that connect them.',
};

// Homepage case card. The chart and the numbers under it come from the case study itself
// (src/content/case-studies/tapi.mdx: heroChart + results), so they always match.
export const caseCard = {
  caseStudy: 'tapi',
  tag: 'B2B SaaS',
  highlight: '60% more demos, 35% cheaper',
  text: ' - by proving the channel was never the problem',
  client: 'Tapi',
  clientCategory: 'Property Maintenance Software',
  logo: '/tapi.png',
  linkLabel: 'Case study',
  href: '/case-studies/tapi/',
};

// The homepage testimonial under the hero is taken from the featured case study (src/content/case-studies/tapi.mdx).

// Headline: `strong` (black) comes first, then `muted` (grey) and the everythink wordmark, also grey.
export const idea = {
  strong: 'Growth doesn’t break inside a channel. It breaks between them. ',
  muted: "That's the whole idea behind",
};

export const questions = [
  {
    title: 'Measurement you can argue with',
    body: 'Every decision downstream is only as good as the numbers under it. Platforms and the CRM should make independent claims, not the same claim twice - that’s the setup where a number that’s wrong gets caught instead of acted on.',
  },
  {
    title: 'Revenue-led budget allocation',
    body: 'Platform metrics tell you what a lead cost. They can’t tell you what a customer cost, which campaign produced it, or which segment is worth paying more for. That answer lives in the CRM, and most accounts never connect the two.',
  },
  {
    title: 'The path from click to closed deal, verified',
    body: 'Between the ad and the CRM record sits the page, the form, the handoff to sales. The most expensive leak in B2B SaaS isn’t the ad spend, it’s demand that arrives and nobody picks up.',
  },
  {
    title: 'Built, not specified',
    body: 'Every one of those is a data problem before it’s a marketing one. The tracking, the capture path, the CRM workflows, the automation - I write them rather than describe them to someone who will.',
  },
];

// "Engineering" section after the staircase. Title parts: muted = grey, otherwise black.
// In the paragraphs, **text** = bold.
export const fit = {
  title: [
    { text: 'Wiring a few tools together is the easy part.' },
    { text: 'It works on the first ten runs, which is exactly what makes it dangerous.', muted: true },
  ],
  paragraphs: [
    'The failures come later and they come quietly - a model that confidently returns the wrong thing, a workflow that stops firing and nobody notices for three weeks. None of that is an AI problem. It’s decided before anything gets built: how much judgement a model is allowed, what each run costs, and what happens on the day it’s wrong.',
  ],
};

// "How the system is built": three plates (SVGs in src/components/engineering/) with copy.
export const engineering = {
  label: 'How the system is built',
  // closing line under the three units, applies to all of them
  note: 'All of it is mine to write, which is why the recommendation and the build are the same conversation rather than two quotes from two vendors.',
  units: [
    {
      title: 'The data model first, the workflow second',
      body: 'Every call, lead and closed deal lands in one place I control, joined through the APIs of the CRM, the ad platforms and product analytics.',
      tags: ['Supabase', 'HubSpot API', 'Meta CAPI', 'Google Ads API', 'PostHog', 'server-side GTM'],
    },
    {
      title: 'Code for the mechanics, the model for the language',
      body: 'Parsing, joining, routing and scoring are code - cheaper, faster, auditable. The model reads what a customer actually said; it doesn’t decide what happens next.',
      tags: ['Claude Code', 'n8n', 'Cloudflare Workers', 'Claude API'],
    },
    {
      title: 'The cost of being wrong decides how much runs alone',
      body: 'Anything that reaches a customer fills a fixed structure and a person approves it. Retries, verification, daily reconciliation, an alert when the numbers disagree - an unwatched automation is a leak with better branding.',
      tags: ['retries', 'reconciliation', 'Slack alerting', 'human-in-the-loop'],
    },
  ],
};

// "Other builds": one featured write-up on dark, two smaller ones beside it.
// Write-ups: the featured one links to its case study; the two smaller ones show a "coming soon" note until they have one (href: '').
export const builds = {
  label: 'Other builds',
  soon: 'Write-up coming soon',
  featured: {
    strong: 'The same architecture, running at',
    brand: 'tapi',
    muted: 'Data model, pipelines and nightly checks, holding up a live growth programme.',
    text: 'Ad spend, lead quality and closed revenue only line up when the data model underneath them does. Known channel went from a third to nearly nine in ten; the monthly report from about three working days to under three hours.',
    cta: 'See how it’s built',
    href: '/case-studies/tapi-source-of-truth/',
  },
  items: [
    { title: 'One URL in, a finished research brief out', text: 'A week of research, gone - across 40+ accounts.', cta: 'Case study', href: '' },
    { title: 'A conversation that qualifies the lead', text: 'Sales opens the call already knowing the budget and the problem.', cta: 'Case study', href: '' },
  ],
};

export const testimonials: {
  logo: string; name: string; role: string; company: string; companyHref?: string;
  avatar: string; quote: string; paragraphs?: string[];
}[] = [
  {
    logo: '/impactable-logo.png',
    name: 'Justin Rowe',
    role: 'Founder & CEO',
    company: 'Impactable',
    companyHref: 'https://impactable.com',
    avatar: '/justin.jpg',
    quote: '',
    paragraphs: [
      '“Branko was our Head of Paid Search - 40+ B2B accounts, team of five.',
      'What I’d actually point to is what he did around that. This was before everyone had AI in their stack, and [[he was already building automation in n8n for the stuff that was eating our strategists’ days]] - search terms, the research layer in onboarding. Then he got the team to actually use it, which is the harder half.',
      'SOPs came out of that. Less of his time needed as it went on, not more.”',
    ],
  },
  {
    logo: '/insightful-logo.svg',
    name: 'Dusan Cujic',
    role: 'Head of PPC',
    company: 'Insightful',
    companyHref: 'https://insightful.io',
    avatar: '/dusan.jpg',
    quote: '',
    paragraphs: [
      '“Google Ads was the brief. Structure, keywords, negatives, RSAs, all of that got rebuilt.',
      'But then he’d send me stuff I hadn’t asked for. Landing pages that didn’t say what the ad said. [[He went campaign by campaign on the pages and reworked them until the rates came up.]]',
      'In B2B SaaS most people in paid search hand you the account and that’s the relationship. Took me a minute to get used to someone going into the parts nobody owns.”',
    ],
  },
];

// Floating buttons fixed to the bottom of the screen
// Booking + profile links, used by every "Book a call" / "LinkedIn" button on the site
export const links = {
  calendly: 'https://calendly.com/branko-everythink/30-minute-meeting',
  linkedin: 'https://www.linkedin.com/in/branko-jovanovic-2b0238103/',
};

// Floating bar fixed to the bottom of the screen: hand the site to an AI assistant with a ready prompt.
const askPrompt =
  'Read https://everythink.pro, including the Tapi case study, and tell me in plain terms: who Branko Jovanovic is, what he actually builds for B2B SaaS companies, what changed for Tapi and how it was measured, and whether a call with him is worth it for a company like mine.';
export const dock = {
  label: '**Check this** instead of reading it', // **bold**
  prompt: askPrompt,
  assistants: [
    { name: 'Claude', icon: '/ask-claude.png', href: `https://claude.ai/new?q=${encodeURIComponent(askPrompt)}` },
    { name: 'ChatGPT', icon: '/ask-chatgpt.png', href: `https://chatgpt.com/?q=${encodeURIComponent(askPrompt)}` },
  ],
};

// "Get started" side panel (header button and the dark CTA open it)
export const getStarted = {
  label: 'Get started',
  intro: 'I’m Branko - everything on this site is my own work, and this goes straight to me. Tell me what isn’t adding up and I’ll tell you whether I’m the right person for it. **No pitch, no sequence.**',
  pick: 'Pick whichever is easiest - all three reach me directly.',
  // the address the email button writes to
  email: 'branko.j.98@gmail.com',
  emailSubject: 'Something isn’t adding up',
  options: {
    call: { title: 'Book a call', text: '30 minutes, pick a time that suits you' },
    email: { title: 'Send an email', text: 'Opens a new Gmail message to me' },
    linkedin: { title: 'Message me on LinkedIn', text: 'If that’s where you already are' },
  },
};

// About me + short CTA (dark)
export const about = {
  label: 'About',
  photo: '/branko.jpg',
  name: 'Branko Jovanovic',
  tagline: 'Growth for B2B SaaS',
  signature: '/signature.png',
  paragraphs: [
    'Seven years in B2B, most of it in SaaS. I started by running channels and ended up owning the system behind them.',
    'Paid across five platforms. Landing pages. CRM lifecycle and attribution from first click to closed revenue. An AI layer that turns sales calls back into messaging and targeting. Not four vendors - one person who can see where one breaks the next.',
    'Developer background, which is why the fixes get built instead of handed over as a document.',
  ],
  cta: {
    title: 'Start with the diagnosis.',
    text: 'Three to four weeks, fixed scope. A ranked list of where the money leaks, what each one is worth, and the order I’d fix them in.',
    button: { label: 'Get started' }, // opens the Get started panel
  },
};

// All homepage copy lives here. Edit text without touching the design.
// Headline parts: `muted` renders grey, `strong` renders near-black.
// Inside quotes/table text, wrap a phrase in [[double brackets]] to highlight it.

export const site = {
  title: 'Everythink – B2B SaaS growth, from the first ad to the closed deal',
  description:
    'Seven years building growth for B2B SaaS - the channels, the tracking, the CRM, and the systems that connect them.',
  ctaLabel: 'Get started',
  ctaHref: '/#contact',
};

export const hero = {
  muted: "B2B SaaS companies don't have an ads problem. They have a leak between the ad, the site, the CRM and sales and ",
  strong: 'nobody owns the whole chain.',
  sub: 'Seven years building growth for B2B SaaS - the channels, the tracking, the CRM, and the systems that connect them.',
};

export const caseCard = {
  tag: 'B2B SaaS',
  highlight: '1.4 → 2.2',
  text: ' demo bookings a day. In three months, on the same spend.',
  client: 'Tapi',
  clientCategory: 'Property Maintenance Software',
  logo: '/tapi.png',
  linkLabel: 'Case study',
  href: '/case-studies/tapi/',
  // y-values 0–100 (growth curve), evenly spaced on x
  chart: [2, 6, 10, 16, 22, 24, 26, 30, 36, 43, 53, 60, 73, 82, 91, 92, 97],
  // labels under the chart: first sits left, last sits right, the rest spread evenly
  chartLabels: ['July', 'August', 'September'],
};

export const stats = [
  { value: '8.4M+', label: 'Attributed organic signups in 2024' },
  { value: '80K+', label: 'Pages created in 2024' },
  { value: '+426.7%', label: 'Average YoY Organic Traffic Increase' },
  { value: '00', label: 'Vanity metrics' },
];

export const featuredTestimonial = {
  logo: '[Client logo]',
  name: '[Client name]',
  role: '[Role]',
  company: '[Company]',
  avatar: '', // photo path, e.g. '/avatars/name.jpg' (put the file in public/avatars)
  paragraphs: [
    '“[Testimonial, paragraph one. What working together looked like week to week, how quickly things moved and the one result the client cares about most, with that [[key outcome highlighted]] so the quote scans at a glance. Keep it close to this length for the layout to hold.]',
    '[Paragraph two. How communication felt, how problems were handled and what made it [[different from other partners]], especially when numbers or priorities changed mid-way.]',
    '[Paragraph three. The two or three concrete benefits the client would name to a peer: [[clear ownership of the full funnel]], [[speed and openness to feedback]], and the fact that the work kept improving over time.]”',
  ],
  details: [
    { label: 'Industry', value: 'Fintech / FX' },
    { label: 'Definition', value: '[One or two sentences on what the client does, who it serves and at what scale.]' },
    { label: 'Headquarters', value: '[City]' },
    { label: 'URL', value: '[client-url.com]', href: '#client' },
  ],
};

export const idea = {
  muted: 'Every agency owns one of these. The money is lost between them. ',
  strong: "That's the whole idea behind",
};

export const questions = [
  {
    title: 'What looks profitable only because you stop counting at the lead?',
    body: 'Cost per demo is a platform number. Cost per customer only exists once the ad, the CRM and the closed deal are connected and then the campaign that looked best usually isn’t.',
  },
  {
    title: 'Does every button on your landing page fire?',
    body: 'By leveraging **research, company data, and pre-programmed rules,** SEO effectively automates the creation.',
  },
  {
    title: 'How long does a paid lead sit before someone calls it?',
    body: '**Traditional SEO methods are often labor-intensive and time-consuming,** while the outcomes generated',
  },
  {
    title: 'How long does a paid lead sit before someone calls it?',
    body: '**Traditional SEO methods are often labor-intensive and time-consuming,** while the outcomes generated',
  },
];

export const fit = {
  title: "This works when you're already spending, and it isn't working.",
  goodLabel: 'Good example',
  badLabel: 'Bad example',
  good: [
    '[[B2B SaaS, seed to Series B.]] Spending at least a few thousand a month on paid, with a CRM you already use and a sales team that takes the calls.',
    '[[B2B SaaS, seed to Series B.]] Spending at least a few thousand a month on paid, with a CRM you already use and a sales team that takes the calls.',
  ],
  bad: [
    "[[You've been told the problem is the campaigns]]. It usually isn't, and you already suspect that.",
    "[[You've been told the problem is the campaigns]]. It usually isn't, and you already suspect that.",
  ],
};

export const testimonials = [
  {
    logo: '[Client logo]',
    name: '[Client name]',
    role: '[Role]',
    company: '[Company]',
    avatar: '',
    quote:
      '“[Short testimonial. One or two sentences on what changed after working together, ending with [[the outcome the client would repeat to a peer.]]]”',
  },
  {
    logo: '[LOGO]',
    name: '[Client name]',
    role: '[Role]',
    company: '[Company]',
    avatar: '',
    quote:
      '“[Short testimonial. How ownership and speed felt from the client’s side, ending with [[the line that makes the quote memorable.]]]”',
  },
];

// Floating buttons fixed to the bottom of the screen
export const dock = {
  primary: { label: 'Partner with us', href: '/#contact' }, // TODO: link
  secondary: { label: 'Book a call', href: '#meeting' }, // TODO: calendar link
};

// About me + short CTA (dark)
export const about = {
  label: 'About',
  photo: '/branko.jpg',
  name: 'Branko Jovanovic',
  tagline: 'Growth for B2B SaaS',
  taglineMuted: 'from the first ad to the closed deal.',
  paragraphs: [
    'Seven years in B2B, most of it in SaaS. I started by running channels and ended up owning the system behind them.',
    'Paid across five platforms. Landing pages. CRM lifecycle and attribution from first click to closed revenue. An AI layer that turns sales calls back into messaging and targeting. Not four vendors — one person who can see where one breaks the next.',
    'Developer background, which is why the fixes get built instead of handed over as a document.',
  ],
  cta: {
    title: 'Start with the diagnosis.',
    text: 'Three to four weeks, fixed scope. A ranked list of where the money leaks, what each one is worth, and the order I’d fix them in.',
    button: { label: 'Book a call', href: '#meeting' }, // TODO: calendar link
  },
};

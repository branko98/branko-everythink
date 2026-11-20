// Figures for the Tapi case study. Imported by src/content/case-studies/tapi.mdx.
// Numbers are ratios and percentages, on one definition throughout.

export const channelLog = {
  title: 'Five channels, five different questions about where demand sits',
  sub: 'Each test was built to rule something out, not to find a winner',
  rows: [
    { channel: 'Google Ads', scope: 'AU and UK', tested: 'Non-brand intent, brand defence, competitor conquesting', showed: 'Non-brand priced far above what the demand justified', decision: 'Closed non-brand' },
    { channel: 'Microsoft Ads', scope: 'control test', tested: 'The same queries on a far cheaper network', showed: 'Price ruled out as the variable, and the demand still too thin', decision: 'Closed' },
    { channel: 'ChatGPT Ads', scope: 'early access', tested: 'Campaigns across feature categories, copy under hard limits', showed: 'Converted only on the problems a buyer cannot defer', decision: 'Narrowed to one', dark: true },
    { channel: 'LinkedIn', scope: 'AU, then UK', tested: 'Whether the profession gathers on the platform at all', showed: 'Not in AU; in the UK an identifiable professional layer', decision: 'Rebuilt for UK', dark: true },
    { channel: 'Meta', scope: 'the assumed dead end', tested: 'Ad set overlap, creative rotation, audience quality', showed: 'Not saturated at all - the account was competing against itself', decision: 'Scaled', win: true },
  ],
};

export const segments = {
  title: 'Two audiences, judged three ways',
  sub: 'What the ad platform rated against what each audience actually won',
  caption: 'audience comparison · cost per demo against properties actually won',
  head: ['', 'On cost per demo', 'On properties actually won', 'One month later'],
  rows: [
    ['Lookalike audience', 'Looked 2.3× more efficient', '~65% more expensive per property won', '1.7× more expensive per demo'],
    ['Sourced ICP list', 'Looked 2.3× more expensive', 'Three quarters of everything won from paid', 'Cheapest in the account'],
  ],
  highlight: 1,
};

export const beforeAfter = {
  title: 'Three months on, at the same daily spend',
  sub: 'Conversion campaigns only, measured on one definition throughout',
  caption: 'three months, unchanged budget',
  footnote: 'Daily spend held flat across the whole period - the change came from allocation, structure and creative, not from more money.',
  metrics: [
    { label: 'Cost per booked demo', before: 100, after: 65, delta: '−35%' },
    { label: 'Demos booked per day', before: 62.5, after: 100, delta: '+60%' },
  ],
};

export const architecture = {
  title: 'The only setup in which you can catch a platform overstating',
  sub: 'Two layers, so neither can quietly stand in for the other - but neither decides which one is official',
  caption: 'measurement architecture · two layers, one return path',
  layers: [
    { title: 'Browser layer', text: 'Pixels, analytics and click attribution across every ad platform', note: 'Answers: which click, from which creative', link: 'joined on identity' },
    { title: 'Server and CRM layer', text: 'Identity, deal value and lifecycle stage, held in the CRM', note: 'Answers: who they are, what they are worth, how far they got', link: 'closes the loop' },
    { title: 'Back to the platforms', text: 'Lifecycle stages returned as offline conversions, so bidding optimises toward qualified pipeline, measured as cost per property entering it' },
  ],
};

export const elimination = {
  title: 'Four layers down, the cause was the browser, not the campaign',
  sub: 'Conversions collapsed while everything before the click stayed flat',
  caption: 'elimination sequence · four layers to the cause',
  layers: [
    { title: 'Ad platform', text: 'CTR, CPC and visitor volume unchanged', verdict: 'Not delivery' },
    { title: 'Analytics', text: 'Time on page, scroll depth and bounce all normal', verdict: 'Not traffic quality' },
    { title: 'Session recordings', text: 'Visitors reach the form, sit on it, leave', verdict: 'Not the message' },
    { title: 'The form itself', text: 'An iframe, so nothing inside it is observable', verdict: 'Technical, not editorial' },
    { title: 'In-app browsers', text: 'The embedded form and its captcha fail inside Facebook and Instagram, carrying 88% of mobile traffic', verdict: 'Cause found' },
  ],
};

export const dataLayer = {
  title: 'One place where the numbers are joined, and one place they’re checked',
  sub: 'Everything else stays where it is',
  caption: 'source of truth · joined in one place, checked every night',
  sources: [
    { title: 'Ad platforms', text: 'spend and delivery' },
    { title: 'HubSpot', text: 'identity, lifecycle, channel' },
    { title: 'Billing', text: 'MRR and contract value' },
  ],
  returnTo: 1, // index of the source the correction path goes back to (HubSpot)
  warehouse: { title: 'Warehouse', text: 'the only place any of it is combined, official source fixed per metric' },
  checks: {
    title: 'Nightly checks',
    items: ['a channel that stopped reporting', 'spend that moved without a campaign change', 'a lead count that doesn’t reconcile'],
  },
  alert: { title: 'Slack alert', text: 'same channel as the form checks' },
  returnLabel: 'factual corrections, logged with a reason',
};

// Separate write-up of the data layer build (chapter 04).
export const fullBuild = { label: 'Read the full build', href: '/case-studies/tapi-source-of-truth/' };

export const capturePath = {
  title: 'Every submission is recorded before it is sent anywhere',
  sub: 'Two independent alarms watch for a submission that never arrives',
  caption: 'lead capture path · record first, verify twice - the pattern the data layer later inherited',
  steps: [
    { title: 'Form submit', text: 'on our own domain' },
    { title: 'Worker records it', text: 'before anything else' },
    { title: 'Posts to the CRM', text: 'retries on failure' },
    { title: 'Verifies at 45 min', text: 'did it land?' },
  ],
  reconcile: { title: 'Daily reconciliation', text: 'compares every submission against the CRM' },
  alert: { title: 'Slack alert', text: 'on any gap, the same day' },
  labels: { logged: 'every submission logged', notFound: 'not found', gap: 'any gap' },
};

export const funnel = {
  title: 'Where the old form lost people, and what the rebuild recovered',
  sub: 'Old embedded form against the rebuilt capture path',
  caption: 'conversion path · same traffic base, before and after the rebuild',
  head: ['', 'Old embedded form', 'Rebuilt capture path', 'Change'],
  rows: [
    ['Started → submitted', '50%', '60%', '×1.2'],
    ['Reached form → submitted', '17%', '31%', '×1.8'],
    ['Submissions per visitor', '1.2%', '2.8%', '×2.3'],
  ],
  highlight: 2,
};

export const demandMap = {
  title: 'Sixteen pains the market raised. Four had advertising against them.',
  sub: 'Demand mapped from recorded sales calls, then checked against the assets that existed',
  caption: 'demand research pipeline · and what it found',
  steps: [
    { title: 'Recorded sales calls', text: 'eight agencies, both markets' },
    { title: 'Pains extracted verbatim', text: 'the customer’s words, not ours' },
    { title: 'Weighted and attributed', text: 'how hard it bites, and who feels it' },
    { title: 'Joined to outcome', text: 'the ad that produced it, and whether it closed' },
    { title: 'Checked against the assets', text: 'creative, page and ad copy, per pain' },
  ],
  coverage: [
    { label: 'Landing page', covered: [0, 1, 2, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], total: 16 },
    { label: 'Creative', covered: [0, 1, 2, 3], total: 16, bad: true },
  ],
  note: 'The library held four creative assets, one for each pain it covered.',
};

export const leftBehind = [
  { title: 'A complete funnel, built rather than inherited.', text: 'Every ad set lands on a page written for the argument it makes, with the value signal carried through to the CRM.' },
  { title: 'A channel map with verdicts, not opinions.', text: 'What was tested, what it showed, and what was closed, narrowed or scaled - with the reasoning recorded.' },
  { title: 'A demand map that sets the testing order.', text: 'Every documented pain, weighted and attributed to a buying role, scored against the assets that exist for it.' },
  { title: 'One official source per metric, checked nightly.', text: 'Platform and revenue signals stay independent, corrections leave a trail, and a dashboard that starts lying gets caught within a day.' },
  { title: 'Lead capture that cannot fail silently.', text: 'Recorded before it’s sent, verified after, reconciled daily, alerted on when the numbers disagree.' },
  { title: 'Lifecycle alerting', text: 'on unowned leads and on leads left uncontacted past 24, 48 and 72 hours.' },
  { title: 'A test framework built for a low-conversion account:', text: 'one variable at a time, a defined threshold, and a change log that keeps results readable months later.' },
  { title: 'An AI layer over sales conversations', text: 'that ties each call back to the ad that produced it and whether it closed, and feeds that language back into messaging.' },
];

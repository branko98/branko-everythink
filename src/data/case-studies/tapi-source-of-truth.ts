// Figures for the Tapi "one source of truth" case study (src/content/case-studies/tapi-source-of-truth.mdx).
// Numbers are ratios and percentages, on one definition throughout.

export const sourceMap = {
  title: 'Everything stays where it is. One place joins it, one place checks it.',
  sub: 'Five systems in, one official answer out',
  caption: 'source of truth · five systems, one join, one check',
  sources: [
    { title: 'Ad platforms', text: 'Meta, Google, LinkedIn' },
    { title: 'HubSpot', text: 'identity, lifecycle, channel' },
    { title: 'Form submission log', text: 'recorded before it posts' },
    { title: 'PostHog', text: 'behaviour after the click' },
    { title: 'Chargebee', text: 'MRR and contract value' },
  ],
  returnTo: 1, // the correction path goes back to HubSpot
  warehouse: { title: 'Warehouse', text: 'the only place these are joined - one official source per metric, one more to check it against' },
  checks: {
    title: 'Nightly checks',
    items: ['a channel gone quiet', 'spend that moved with no campaign change', 'a lead count that won’t reconcile'],
  },
  alert: { title: 'Slack alert', text: 'same channel as the form checks' },
  returnLabel: 'factual corrections to the CRM, logged with a reason',
};

export const authority = {
  caption: 'source-of-truth table · one official source per metric, one system to check it against',
  head: ['Metric', 'Official source', 'Checked against', 'When they disagree'],
  rows: [
    ['MRR and contract value', 'Billing', 'CRM deal value', 'Billing wins; the deal record is flagged for correction'],
    ['Channel on a new customer', 'First conversion in the CRM, frozen', 'Ad platform click data', 'CRM wins; the gap is logged as view-through at channel level'],
    ['Paid conversions', 'Ad platform', 'CRM contact records', 'Neither wins - the gap is the signal, and anything over 5% is investigated'],
    ['Lead volume', 'Form submission log', 'CRM', 'A shortfall in the CRM means the capture path is dropping records, not that fewer leads arrived'],
    ['Pipeline and won deals', 'CRM', 'Billing', 'CRM wins on stage, billing wins on value'],
  ],
};

export const correctionLoop = {
  title: 'A correction that keeps repeating is a signal, not a habit',
  sub: 'The agent reads and reports; every write is a person with a reason',
  caption: 'the correction loop · flag, decide, log',
  steps: [
    { title: 'Nightly check', text: 'finds a gap' },
    { title: 'Slack alert', text: 'named, same day' },
    { title: 'A person decides', text: 'nothing is automatic' },
  ],
  outcomes: [
    { title: 'Leave it', text: 'the gap is explained' },
    { title: 'Correct it', text: 'logged with a reason' },
  ],
  note: 'The same correction twice means the fix belongs upstream, not in the record.',
};

export const beforeAfter = {
  title: 'Before and after, on the same definitions',
  caption: 'before: the three-month average preceding the work · after: the third month, measured on the same definitions',
  head: ['', 'Before', 'After'],
  rows: [
    ['New customers with a known channel', '32%', '88%'],
    ['Unexplained gap between platforms and CRM', '15–20%', 'under 5%'],
    ['Versions of the same number in circulation', '4', '1, corrections marked'],
    ['Time to close the monthly report', '~3 working days', '2–3 hours'],
    ['Time to detect a data failure', 'weeks to months', '1–2 days'],
  ],
};

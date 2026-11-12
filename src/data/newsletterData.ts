export type EvidenceType = 'crm-facility' | 'meeting-note' | 'public-filing' | 'market-news';

export interface EvidenceRecord {
  id: string;
  type: EvidenceType;
  isSyntheticCrm?: boolean;
  sourceLabel: string;
  externalUrl?: string;
  externalUrlLabel?: string;
  clientId?: string;
  clientName?: string;
  title: string;
  date: string;
  authorOrPublisher: string;
  highlightedExcerpt: string;
  informationBarrierNote?: string;
  facilityDetails?: {
    facilityCode: string;
    productType: string;
    principal: string;
    originationDate: string;
    maturityDate: string;
    currentPricing: string;
    stepUpTrigger: string;
    covenantLeverage: string;
    takeoutWindow: string;
    timelineSteps: {
      date: string;
      label: string;
      status: 'completed' | 'current' | 'upcoming' | 'warning';
    }[];
  };
  meetingDetails?: {
    attendees: string[];
    location: string;
    duration: string;
    fullNotes: string[];
    actionItems: string[];
  };
  filingDetails?: {
    filingType: string;
    sourceCitation: string;
    keyMetrics: {
      label: string;
      value: string;
    }[];
    excerpts: string[];
  };
  marketDetails?: {
    publication: string;
    tickerOrTopic: string;
    metrics: {
      label: string;
      value: string;
      change: string;
      positive?: boolean;
    }[];
    articleParagraphs: string[];
  };
}

export interface InlineLinkSegment {
  type: 'text' | 'link';
  content: string;
  evidenceId?: string;
  sourceBadge?: string;
}

export interface DejaDueItem {
  id: string;
  clientId: string;
  clientName: string;
  triggerTiming: string;
  dateValue: string;
  triggerType: 'Calendar' | 'Event-Triggered';
  title: string;
  actionRequired: string;
  specialists: string;
  /** Source record; absent for reminders the RM creates from the inbox. */
  evidenceId?: string;
}

export interface SpecialistColleague {
  name: string;
  role: string;
  email: string;
}

export interface CitationRef {
  evidenceId: string;
  badge: string;
}

export interface CitedLine {
  text: string;
  citations: CitationRef[];
}

/** A follow-up Rendez-Vous suggests; nothing is set until the RM clicks. */
export interface DejaDueSuggestion {
  followUp: string;
  timing: string;
  why: CitedLine;
  /** Matching Frame 5 Déjà Due item. If it is already tracked there, page 1 shows it as set. */
  dejaDueItemId?: string;
}

/** Page 1 (newsletter) card content: every client renders from this one template. */
export interface BriefCard {
  timingBadge: string;
  triggerTag: 'Trigger: Market + CRM' | 'Trigger: Déjà Due + Market';
  privateSideTooltip?: string;
  /** "Came due" banner lines (only when a reminder the RM set earlier came due). */
  cameDue?: CitedLine[];
  theMove: string;
  angle?: string;
  whyNow: [CitedLine, CitedLine];
  ask: [string, string];
  beforeYouCall?: string;
  bring: string;
  bnpRole: CitedLine;
  suggestedFollowUps: DejaDueSuggestion[];
  assumption?: string;
  todaysCall: { move: string; callBy: string };
}

export interface ClientBriefItem {
  rank: number;
  clientId: string;
  clientName: string;
  tickerOrRegion: string;
  sector: string;
  hq: string;
  storyTheme: string;
  card: BriefCard;
  bnpRoleSummary: string;
  engageTiming: string;
  briefHeadline: string;
  publicEvidence: InlineLinkSegment[];
  syntheticCrmContext: InlineLinkSegment[];
  whyNowBullets: InlineLinkSegment[][];
  keyPointsToHit: string[];
  productsAndSpecialists: string;
  recommendedTeam: SpecialistColleague[];
  informationBarrierNotice?: string;
  coverageNote?: string;
  keyContact: {
    name: string;
    role: string;
    email: string;
  };
  draftEmail: {
    subject: string;
    body: string;
  };
  linkedEvidenceIds: string[];
}

export interface TriggerFeedRow {
  date: string;
  event: string;
  whoItHits: string;
  source: string;
  externalUrl?: string;
  surfacedClient?: string;
}

export interface SuppressedSignalRow {
  event: string;
  client: string;
  reason: string;
  ruleApplied: string;
}

export interface OutlookEmail {
  id: string;
  folder: 'inbox' | 'briefs' | 'flagged' | 'sent' | 'drafts' | 'archive';
  group: 'Pinned' | 'Today' | 'Yesterday';
  isNewsletter?: boolean;
  isUnread: boolean;
  isFlagged: boolean;
  isPinned?: boolean;
  isFocused: boolean;
  senderName: string;
  senderInitials: string;
  senderEmail: string;
  senderRole?: string;
  subject: string;
  preview: string;
  timestamp: string;
  dateLabel: string;
  hasAttachment?: boolean;
  bodyParagraphs?: string[];
  clientTag?: string;
}

export interface ClientDossier {
  id: string;
  name: string;
  sector: string;
  hq: string;
  marketCapOrSize: string;
  keyFinancials: string;
  netLeverage: string;
  bnpDocumentedRole: string;
  primaryContact: {
    name: string;
    role: string;
    email: string;
    phone: string;
  };
  activeFacilities: {
    code: string;
    type: string;
    amount: string;
    maturity: string;
    status: string;
  }[];
  openOpportunity: string;
  recommendedTeam: SpecialistColleague[];
  recentEvidenceIds: string[];
  informationBarrierNotice?: string;
}

export const RM_PROFILE = {
  name: 'Sophie Laurent',
  title: 'Relationship Manager · Mid-Cap Corporate Coverage',
  email: 'sophie.laurent@bnpparibas.com',
  division: 'BNP Paribas CIB Corporate Coverage',
  bookSize: 54,
};

export const EVIDENCE_RECORDS: Record<string, EvidenceRecord> = {
  'dnut-credit-facility': {
    id: 'dnut-credit-facility',
    type: 'crm-facility',
    sourceLabel: 'SEC EDGAR · Proxy / 10-K',
    externalUrl: 'https://www.sec.gov/edgar/browse/?CIK=0001857154',
    externalUrlLabel: 'Open Krispy Kreme SEC EDGAR Filings (CIK 0001857154)',
    clientId: 'krispy-kreme',
    clientName: 'Krispy Kreme (DNUT)',
    title: '2023 Credit Agreement ($300M Revolver + $700M Term Loan, Upsized +$125M in 2025)',
    date: 'Maturing March 2028',
    authorOrPublisher: 'SEC Filings (2026 DEF 14A Proxy, FY2025 10-K, 10-Q) & Credit File',
    highlightedExcerpt:
      'BNP Paribas serves as administrative agent, collateral agent, and documentation agent, and issues letters of credit. Borrowings float at Adjusted Term SOFR + margin. At FY2025 end: $742.8M term loan and $157.5M revolver drawn (~$900M floating).',
    informationBarrierNote:
      'PRIVATE-SIDE LENDER INFO: As agent, BNP Paribas receives private compliance certificates and covenant calculations. Visible to RM and Credit team only — never routed to public-side sales or research.',
    facilityDetails: {
      facilityCode: 'DNUT-2023-TL-RCF',
      productType: '$300M Revolving Credit Facility + $700M Term Loan (+$125M 2025 Upsize)',
      principal: '$900.3M Drawn ($742.8M Term Loan + $157.5M Revolver)',
      originationDate: '2023 (Upsized 2025)',
      maturityDate: 'March 2028 (Goes Current March 2027)',
      currentPricing: 'Adjusted Term SOFR + Applicable Margin (Floating)',
      stepUpTrigger: 'Dividend restricted while Net Leverage > 3.0x (8-K Summary)',
      covenantLeverage: 'Q3 2026 Actual Net Leverage: 5.5x · Liquidity: $250.5M',
      takeoutWindow: '1H 2027 Amend-and-Extend / Refinancing Window (Before Mar 2027 Current Reclass)',
      timelineSteps: [
        { date: '2023 / 2025', label: '2023 Credit Agreement Signed ($125M Upsize in 2025)', status: 'completed' },
        { date: 'Nov 10, 2026', label: 'Hot Oct CPI Pushes Dec Hike Odds to ~85% (Current)', status: 'current' },
        { date: 'Dec 09, 2026', label: 'Déjà Due: FOMC Rate Decision Follow-On', status: 'upcoming' },
        { date: 'Mar 2027', label: '12 Months to Maturity — Debt Becomes Current Liability', status: 'warning' },
        { date: 'Mar 2028', label: 'Credit Facility Final Maturity', status: 'warning' },
      ],
    },
  },
  'dnut-q3-8k': {
    id: 'dnut-q3-8k',
    type: 'public-filing',
    sourceLabel: 'SEC Form 8-K · Q3 2026 (Nov 5)',
    externalUrl: 'https://www.sec.gov/edgar/browse/?CIK=0001857154',
    externalUrlLabel: 'Open SEC EDGAR Form 8-K & Filings for DNUT',
    clientId: 'krispy-kreme',
    clientName: 'Krispy Kreme (DNUT)',
    title: 'Q3 2026 Earnings Release & Refranchising Update (Form 8-K Ex. 99.1)',
    date: 'November 5, 2026',
    authorOrPublisher: 'SEC Form 8-K / Kalkine / Stocktwits',
    highlightedExcerpt:
      'Q3 2026 net revenue $328.8M; FY guidance raised to $1.35–$1.40B; net leverage 5.5x; liquidity $250.5M; shares jumped ~25–30% on the day alongside Japan/Western US refranchising and a 120-shop Pakistan franchise deal.',
    filingDetails: {
      filingType: 'SEC Form 8-K (Ex. 99.1) & Market Equity Reaction',
      sourceCitation: 'Filed Nov 5, 2026 · Market Cap ~$577M',
      keyMetrics: [
        { label: 'Q3 2026 Net Revenue', value: '$328.8M' },
        { label: 'FY Guidance (Raised)', value: '$1.35B – $1.40B' },
        { label: 'Net Leverage', value: '5.5x (Div. Restricted >3.0x)' },
        { label: 'Total Liquidity', value: '$250.5M' },
        { label: 'Post-Earnings Share Move', value: '+25% to +30%' },
        { label: 'Unhedged Sensitivity Est.', value: '+$2.25M / +25 bps SOFR' },
      ],
      excerpts: [
        'Management raised full-year revenue guidance to $1.35–$1.40B while advancing its capital-light refranchising strategy in Japan and the Western US, plus signing a 120-shop development deal for Pakistan.',
        'At 5.5x net leverage, dividends remain restricted under the 3.0x credit agreement threshold, keeping deleveraging via refranchising proceeds central to capital allocation.',
        'The ~25–30% Q3 equity rally meaningfully improves Krispy Kreme’s market optionality compared to a month ago ahead of 1H 2027 refinancing discussions.',
      ],
    },
  },
  'dnut-crm-sep26': {
    id: 'dnut-crm-sep26',
    type: 'meeting-note',
    isSyntheticCrm: true,
    sourceLabel: 'Demo CRM Note · Sep 2026 Call',
    clientId: 'krispy-kreme',
    clientName: 'Krispy Kreme (DNUT)',
    title: 'Treasury Coverage Call — Deleveraging Priority & Refinancing Timing',
    date: 'September 2026 (Demo CRM Context)',
    authorOrPublisher: 'Logged by Sophie Laurent (RM) · Internal CRM Only',
    highlightedExcerpt:
      '"Treasury stated the priority is cutting leverage via refranchising proceeds before any refinancing talk; agreed to revisit after Q3 results. Hedge book status on the ~$743M term loan must be verified in the 10-K before calling."',
    informationBarrierNote:
      'INTERNAL CRM RECORD: Synthetic CRM context created for prototype demonstration. Hedge book allocation should be verified in the 10-K prior to outreach.',
    meetingDetails: {
      attendees: [
        'VP Treasury & Corporate Finance (Krispy Kreme)',
        'Sophie Laurent (RM, BNP Paribas)',
      ],
      location: 'Teams Coverage Call (Internal CRM)',
      duration: '35 mins',
      fullNotes: [
        'Treasury emphasized that paying down debt with refranchising proceeds (Japan, Western US) takes priority over launching an early refinancing process.',
        'Client explicitly asked to "revisit after Q3" once updated leverage and full-year guidance clarity were published.',
        'RM note: Whether a portion of the $742.8M floating-rate term loan is currently swapped or capped must be checked in the FY2025 10-K derivative footnote prior to the Rates/Derivatives call.',
      ],
      actionItems: [
        'Verify existing interest-rate swap / cap notional and roll-off dates in the 10-K before engaging.',
        'Bring Marc-Antoine Lefèvre (Rates/Derivatives) and Claire-Marie Dubois (LCM) to discuss hedging and 1H 2027 amend-and-extend.',
      ],
    },
  },
  'market-oct-cpi': {
    id: 'market-oct-cpi',
    type: 'market-news',
    sourceLabel: 'TT News / CME FedWatch · Nov 10',
    externalUrl: 'https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html',
    externalUrlLabel: 'Open Live CME FedWatch Rate Probabilities',
    clientId: 'krispy-kreme',
    title: 'October CPI +0.4% m/m Pushes December 8–9 FOMC Rate Hike Odds to ~85%',
    date: 'November 10, 2026',
    authorOrPublisher: 'TT News / MPA / CME FedWatch',
    highlightedExcerpt:
      'October headline CPI printed +0.4% m/m (vs. +0.3% expected) with core CPI at +0.3%, driving December 8–9 FOMC hike odds to ~85% on CME FedWatch after the Fed held at 3.75–4.00% on Oct 28.',
    marketDetails: {
      publication: 'TT News, MPA & CME FedWatch (Ingested Nov 10, 2026)',
      tickerOrTopic: 'US Rates · FOMC Dec 8–9 Hike Probability',
      metrics: [
        { label: 'Oct Headline CPI (m/m)', value: '+0.4%', change: 'vs +0.3% Est.', positive: false },
        { label: 'Oct Core CPI (m/m)', value: '+0.3%', change: 'Sticky Services', positive: false },
        { label: 'Dec 8–9 Hike Odds', value: '~85%', change: 'CME FedWatch', positive: false },
        { label: 'Fed Funds Target (Oct 28)', value: '3.75–4.00%', change: '10Y UST ~4.89–5.03%', positive: false },
      ],
      articleParagraphs: [
        'Following a September rate hike and an October 28 FOMC hold (10–2 vote) at 3.75–4.00%, Tuesday’s hotter-than-expected October CPI print (+0.4% m/m vs +0.3% consensus) drove December 8–9 hike probabilities to ~85% on CME FedWatch.',
        'Matching Logic Applied: Trigger fires for any corporate client carrying material floating-rate SOFR debt or facing a debt refinancing within the next 18 months.',
        'For Krispy Kreme (~$900M floating term loan and revolver), each 25 bps policy increase adds roughly $2.25M in annualized interest expense if unhedged.',
      ],
    },
  },
  'ternium-green-loan': {
    id: 'ternium-green-loan',
    type: 'crm-facility',
    sourceLabel: 'SEC / CA-CIB · $1.25B Green Loan',
    externalUrl: 'https://www.sec.gov/edgar/browse/?CIK=0001342874',
    externalUrlLabel: 'Open Ternium S.A. SEC EDGAR Filings (CIK 0001342874)',
    clientId: 'ternium-mexico',
    clientName: 'Ternium Mexico',
    title: '$1.25B Green Loan (Aug 2025) — Pesquería Low-Carbon Steel Plant',
    date: 'Originated August 2025',
    authorOrPublisher: 'The Asset / Crédit Agricole CIB / SEC Filing',
    highlightedExcerpt:
      'BNP Paribas acted as one of seven Joint Lead Arrangers and Bookrunners on Ternium Mexico’s $1.25B green loan (Crédit Agricole CIB as admin agent) financing the Pesquería low-carbon steel complex; slab plant due by year-end 2026.',
    facilityDetails: {
      facilityCode: 'TX-MEX-GREEN-2025',
      productType: '$1.25B Green Term Loan (7 JLAs & Bookrunners incl. BNP Paribas)',
      principal: '$1,250,000,000 (Syndicated)',
      originationDate: 'August 2025',
      maturityDate: 'Construction-to-Operations Transition Year-End 2026',
      currentPricing: 'SOFR + 125 bps (5-Year Delayed Draw Green Term Loan)',
      stepUpTrigger: 'Green-Loan KPI Sustainability Reporting Milestones (LMA/LSTA)',
      covenantLeverage: 'Low-Carbon Pesquería DRI-EAF Slab Plant Commissioning Due YE 2026',
      takeoutWindow: 'Lock Remaining MXN Capex Spend Now & Transition to Operations Working Capital',
      timelineSteps: [
        { date: 'Aug 2025', label: '$1.25B Green Loan Closed (BNP JLA & Bookrunner)', status: 'completed' },
        { date: 'Oct 23, 2026', label: 'US–Mexico Section 232 Steel Talks Stall (50% Tariff)', status: 'warning' },
        { date: 'Nov 05, 2026', label: 'Banxico Cuts to 6.25%; MXN ~18.8–18.9 (Current)', status: 'current' },
        { date: '~Jan 2027', label: 'Déjà Due: Pesquería Slab Plant Start-Up & WC Shift', status: 'upcoming' },
        { date: 'Jan 10 / Jul 1, 2027', label: 'Déjà Due: US–China Truce Expiry & USMCA Annual Review', status: 'upcoming' },
      ],
    },
  },
  'ternium-crm-aug26': {
    id: 'ternium-crm-aug26',
    type: 'meeting-note',
    isSyntheticCrm: true,
    sourceLabel: 'Demo CRM Note · Aug 2026 Meeting',
    clientId: 'ternium-mexico',
    clientName: 'Ternium Mexico',
    title: 'Pesquería Commissioning Spend & MXN Hedging Discussion',
    date: 'August 2026 (Demo CRM Context)',
    authorOrPublisher: 'Logged by Coverage RM · Internal CRM Only',
    highlightedExcerpt:
      '"A large share of remaining Pesquería slab-plant spend is peso-denominated (local contractors, labor). Treasury noted they will look at hedging once commissioning dates firm up."',
    informationBarrierNote:
      'INTERNAL CRM RECORD: Synthetic CRM note. In practice Ternium sits with BNP LatAm coverage; for a US mid-market RM persona, this models a synthetic twin (US auto-parts supplier with Mexican plants buying Ternium-type steel).',
    meetingDetails: {
      attendees: [
        'Mexico Treasury & Plant Finance Director',
        'Sophie Laurent (RM, BNP Paribas)',
      ],
      location: 'Monterrey / Teams Review (Internal CRM)',
      duration: '40 mins',
      fullNotes: [
        'Cold-rolling and galvanizing lines at Pesquería are ramping smoothly; remaining slab plant construction and local contractor/labor outlays are heavily MXN-denominated.',
        'At the time of the August meeting (when USD/MXN was near 16.9–17.2), treasury opted to wait on FX hedging until final commissioning dates firmed up.',
      ],
      actionItems: [
        'Pitch MXN forwards or collars with Mateo Villalobos (LatAm FX) now that USD/MXN moved ~10% higher to 18.81–18.90.',
        'Coordinate working-capital, import trade finance, and green-loan KPI reporting ahead of year-end slab plant start-up.',
      ],
    },
  },
  'market-mxn-banxico-232': {
    id: 'market-mxn-banxico-232',
    type: 'market-news',
    sourceLabel: 'Trading Econ / SteelOrbis · Nov 5',
    externalUrl: 'https://tradingeconomics.com/mexico/interest-rate',
    externalUrlLabel: 'Open Trading Economics — Mexico Interest Rate & FX',
    clientId: 'ternium-mexico',
    title: 'MXN Slides ~10% to 18.81–18.9; Banxico Cuts to 6.25% as Section 232 Talks Stall',
    date: 'Oct 23 – Nov 5, 2026',
    authorOrPublisher: 'Trading Economics, Rio Times, SteelOrbis, Corpay, Benzinga',
    highlightedExcerpt:
      'USD/MXN jumped from 16.87 (Sep 4 high) to 18.81 (Oct 29) and ~18.9 after Banxico’s surprise cut to 6.25% on Nov 5. Meanwhile, US–Mexico Section 232 talks stalled Oct 23 leaving 50% steel tariffs intact.',
    marketDetails: {
      publication: 'Trading Economics, Rio Times, SteelOrbis & Corpay Options Desk',
      tickerOrTopic: 'USD/MXN FX, Banxico Policy Rate & Section 232 Steel Duties',
      metrics: [
        { label: 'USD/MXN (Sep 4 → Nov 5)', value: '16.87 → ~18.9', change: '~10% Weaker MXN', positive: true },
        { label: 'Banxico Policy Rate (Nov 5)', value: '6.25%', change: 'Surprise Cut', positive: false },
        { label: 'Implied YE FX Range', value: '17.70 – 19.90', change: 'Corpay Options', positive: false },
        { label: 'US Sec. 232 Steel Tariff', value: '50%', change: 'Talks Stalled Oct 23', positive: false },
      ],
      articleParagraphs: [
        'Banxico surprised consensus on November 5 by cutting its policy rate to 6.25%, driving the Mexican peso briefly to ~18.9 per USD—a 15-month low and roughly 10% weaker than its 16.87 peak on September 4.',
        'Earlier, on October 23, US–Mexico bilateral talks stalled over Section 232 steel and aluminum duties (remaining at 50%), with Washington pressing Mexico to mirror US steel tariffs on China.',
        'For Ternium Mexico, each USD now buys ~10% more pesos for remaining year-end Pesquería slab-plant contractor outlays, while Banxico easing increases further peso downside risk.',
      ],
    },
  },
  'cci-borrowing-base': {
    id: 'cci-borrowing-base',
    type: 'crm-facility',
    sourceLabel: 'ABF Journal / CCI · $2.2B BBF',
    externalUrl: 'https://www.cci.com/news/',
    externalUrlLabel: 'Open Castleton Commodities (CCI) News & Facility Releases',
    clientId: 'castleton-commodities',
    clientName: 'Castleton Commodities (CCI)',
    title: 'Global Borrowing-Base Facility ($2.2B Renewal + $1B Accordion, 17 Banks)',
    date: '2018 ($3.525B) & 2022 ($2.2B) Renewals',
    authorOrPublisher: 'ABF Journal / CCI Public Deal Records',
    highlightedExcerpt:
      'BNP Paribas served as Global Coordinator and Administrative Agent on CCI’s 2018 ($3.525B) and 2022 ($2.2B, 17 banks, $1B accordion) borrowing-base facilities backing letters of credit and physical merchanting.',
    informationBarrierNote:
      'INFORMATION BARRIER: CCI’s inventory levels and borrowing-base facility data are confidential lender information. Never route this brief to BNP’s own commodity traders or research.',
    facilityDetails: {
      facilityCode: 'CCI-BBF-GLOBAL',
      productType: 'Committed Borrowing-Base Facility (364-Day & 2-Year Tranches + $1B Accordion)',
      principal: '$2,200,000,000 Base (+ $1,000,000,000 Accordion)',
      originationDate: '2018 / 2022 Public Renewals (Demo assumes BNP remains Agent)',
      maturityDate: '364-Day & 2-Year Revolving Tranches',
      currentPricing: 'Marked to Physical Inventory & Receivables Borrowing Base',
      stepUpTrigger: 'Monthly Borrowing-Base Certificate Redetermination',
      covenantLeverage: 'Availability Linked Directly to Brent / Commodity Mark-to-Market',
      takeoutWindow: 'Interim Borrowing-Base Headroom, Hedge Margin & LC Capacity Review',
      timelineSteps: [
        { date: '2018 & 2022', label: 'BNP Global Coordinator & Admin Agent on $3.525B / $2.2B BBF', status: 'completed' },
        { date: 'Nov 03, 2026', label: 'Goldman Lifts Dec Brent Target to $105 ($140 Risk)', status: 'upcoming' },
        { date: 'Nov 06–10, 2026', label: 'Brent Drops 16% WoW, Briefly <$90 (Current)', status: 'current' },
        { date: 'Nov 30, 2026', label: 'Monthly Borrowing-Base Certificate (Engage Before)', status: 'warning' },
        { date: 'Dec 31, 2026', label: 'Déjà Due: Next Borrowing-Base Report Check', status: 'upcoming' },
      ],
    },
  },
  'cci-crm-oct26': {
    id: 'cci-crm-oct26',
    type: 'meeting-note',
    isSyntheticCrm: true,
    sourceLabel: 'Demo CRM Note · Oct 2026 Call',
    clientId: 'castleton-commodities',
    clientName: 'Castleton Commodities (CCI)',
    title: 'Inventory Build & Accordion LC Capacity Inquiry',
    date: 'October 2026 (Demo CRM Context)',
    authorOrPublisher: 'Logged by Coverage RM · Internal CRM Only',
    highlightedExcerpt:
      '"CCI built crude and refined product inventory during the war-risk premium and asked about tapping the $1B accordion for extra letter-of-credit capacity."',
    informationBarrierNote:
      'INTERNAL CRM RECORD: Synthetic CRM note; the latest facility renewal is non-public and the demo assumes BNP remains administrative agent with monthly borrowing-base certificates.',
    meetingDetails: {
      attendees: [
        'Global Treasury & Trade Operations (CCI)',
        'Sophie Laurent (RM, BNP Paribas)',
      ],
      location: 'Stamford / New York Coverage Call (Internal CRM)',
      duration: '30 mins',
      fullNotes: [
        'During October’s war-risk oil rally, CCI expanded physical crude and refined product inventories and inquired whether the $1B accordion could be activated to support higher nominal LC values.',
        'With Brent dropping 16% in one week and dipping below $90 on Nov 10, collateral value on that inventory has fallen while tanker freight costs remain elevated.',
      ],
      actionItems: [
        'Compare current mark-to-market borrowing-base availability vs. October’s certificate with Henrik Lindqvist.',
        'Assess liquidity impact of futures hedge gains vs. physical inventory losses and revisit LC accordion need.',
      ],
    },
  },
  'market-brent-drop': {
    id: 'market-brent-drop',
    type: 'market-news',
    sourceLabel: 'Reuters / OilPrice · Nov 6–10',
    externalUrl: 'https://oilprice.com/Energy/Crude-Oil/',
    externalUrlLabel: 'Open OilPrice Brent Crude Market Coverage',
    clientId: 'castleton-commodities',
    title: 'Brent Plunges 16% in Sharpest Weekly Drop Since COVID, Briefly Breaks $90',
    date: 'November 6–10, 2026',
    authorOrPublisher: 'Nation Thailand / Reuters, OilPrice',
    highlightedExcerpt:
      'Brent lost 16% in the week to Nov 6 (sharpest drop since COVID) and dipped below $90 on Nov 10 on Iran diplomacy; Dated Brent slipped below futures. Goldman warned of $105–$140 rebound risk if Gulf supply impairs.',
    marketDetails: {
      publication: 'Reuters / Nation Thailand / OilPrice',
      tickerOrTopic: 'Brent Crude, Dated Brent Spread & Tanker Freight',
      metrics: [
        { label: 'Weekly Brent Move (to Nov 6)', value: '-16.0%', change: 'Sharpest Since COVID', positive: false },
        { label: 'Nov 10 Intraday Dip', value: '<$90 / bbl', change: 'Iran Diplomacy', positive: false },
        { label: 'Physical Market Signal', value: 'Dated < Futures', change: 'Contango Weakness', positive: false },
        { label: 'Goldman Upside Scenario', value: '$105 – $140', change: 'Two-Way Risk', positive: true },
      ],
      articleParagraphs: [
        'Brent crude tumbled 16% in the week ending November 6 and briefly breached $90/bbl on November 10 following renewed Iran diplomatic signals, pushing Dated Brent below futures in a clear indicator of near-term physical softness.',
        'Yet two-way tail risk remains severe: on November 3, Goldman Sachs raised its December Brent forecast to $105 and flagged $140/bbl risk if Gulf output stays impaired, while tanker freight rates stayed stubbornly elevated.',
        'For borrowing-base commodity merchants like CCI, sudden downward price shocks compress collateral headroom while timing mismatches between futures margin settlements and physical sales create sharp liquidity swings.',
      ],
    },
  },
};

export const WEEKLY_CLIENT_BRIEFS: ClientBriefItem[] = [
  {
    rank: 1,
    clientId: 'ternium-mexico',
    clientName: 'Ternium Mexico',
    tickerOrRegion: 'LatAm / North America Industrial',
    sector: 'Steel Manufacturing & Low-Carbon Metals',
    hq: 'Monterrey, Nuevo León',
    storyTheme: 'FX & Trade Story · Peso Slide, Banxico Cut & Stalled Steel Talks',
    card: {
      timingBadge: 'Engage this week · by Nov 13',
      triggerTag: 'Trigger: Market + CRM',
      theMove:
        'Call treasury to propose hedging the remaining peso build-out costs before the slab plant starts up at year-end.',
      angle: 'Lock in today’s favorable rate before a rebound.',
      whyNow: [
        {
          text: 'The peso is ~10% weaker since September (USD/MXN 16.87 on Sep 4 → ~18.9 on Nov 5) and Banxico cut to 6.25%.',
          citations: [{ evidenceId: 'market-mxn-banxico-232', badge: 'Trading Econ / SteelOrbis' }],
        },
        {
          text: 'In August, treasury said it would “look at hedging once commissioning dates firm up”. The slab plant is now due to start by year-end.',
          citations: [{ evidenceId: 'ternium-crm-aug26', badge: 'Demo CRM Note · Aug 2026' }],
        },
      ],
      ask: [
        'How much of the remaining Pesquería spend is in pesos, and is any of it hedged?',
        'Once the plant runs, what are your working-capital needs for imported inputs?',
      ],
      bring: 'MXN forwards or collars · import trade finance',
      bnpRole: {
        text: 'Joint lead arranger & bookrunner on the $1.25B green loan (Aug 2025)',
        citations: [{ evidenceId: 'ternium-green-loan', badge: 'SEC / The Asset' }],
      },
      suggestedFollowUps: [
        {
          followUp: 'Slab plant start-up',
          timing: '~Jan 2027',
          why: {
            text: 'The green loan shifts from construction to operations, opening working-capital and trade-finance needs.',
            citations: [{ evidenceId: 'ternium-green-loan', badge: 'Facility Schedule' }],
          },
          dejaDueItemId: 'dd-tx-startup',
        },
      ],
      todaysCall: { move: 'Hedge remaining peso build-out costs', callBy: 'Fri, Nov 13' },
    },
    bnpRoleSummary: 'Joint lead arranger & bookrunner on $1.25B green loan (Aug 2025) for Pesquería low-carbon steel plant',
    engageTiming: 'Engage This Week (Pre–Year-End Slab Plant Start-Up)',
    briefHeadline:
      'Peso is ~10% weaker than in early September and Banxico just cut. Ternium’s BNP-arranged green loan funds a plant due to start by year-end. Window to lock in peso costs and refresh tariff scenarios.',
    publicEvidence: [
      { type: 'text', content: 'BNP was one of seven joint lead arrangers and bookrunners on ' },
      {
        type: 'link',
        content: 'Ternium Mexico’s $1.25B green loan (Aug 2025) for its Pesquería low-carbon steel plant',
        evidenceId: 'ternium-green-loan',
        sourceBadge: 'SEC / The Asset',
      },
      { type: 'text', content: ' (cold-rolling/galvanizing ramping; slab plant due by year-end 2026). ' },
      {
        type: 'link',
        content: 'USD/MXN moved from 16.87 (Sep 4) to 18.81 (Oct 29) and ~18.9 on Nov 5 as Banxico cut to 6.25%, while US–Mexico Section 232 steel talks stalled Oct 23 leaving 50% duties intact',
        evidenceId: 'market-mxn-banxico-232',
        sourceBadge: 'Trading Econ / SteelOrbis',
      },
      { type: 'text', content: ' (options imply a 17.70–19.90 year-end range).' },
    ],
    syntheticCrmContext: [
      { type: 'text', content: 'Per the ' },
      {
        type: 'link',
        content: 'Aug 2026 CRM meeting note, a large share of remaining slab-plant spend is peso-denominated (local contractors, labor)',
        evidenceId: 'ternium-crm-aug26',
        sourceBadge: 'Demo CRM Note',
      },
      { type: 'text', content: ' and treasury noted they "will look at hedging once commissioning dates firm up."' },
    ],
    whyNowBullets: [
      [
        { type: 'text', content: 'Each dollar now buys ~10% more pesos than in September; remaining MXN capex can be locked in at today’s weaker rate while Banxico’s surprise cut raises further peso downside.' },
      ],
      [
        { type: 'text', content: 'Year-end Pesquería slab plant start-up shifts the ' },
        {
          type: 'link',
          content: '$1.25B green loan from construction to operations',
          evidenceId: 'ternium-green-loan',
          sourceBadge: 'Facility Schedule',
        },
        { type: 'text', content: ', transforming working-capital, imported-input trade finance, and green-KPI reporting needs while Section 232 stalls pressure US export volumes.' },
      ],
    ],
    keyPointsToHit: [
      'Unhedged remaining Pesquería MXN contractor/labor capex and forward/collar tenor ahead of commissioning.',
      'Shift from construction financing to operational working capital and imported-input trade finance once the slab plant runs.',
      '2027 North American volume scenarios if Section 232 50% duties stay intact, plus green-loan KPI reporting.',
    ],
    productsAndSpecialists: 'MXN forwards or collars · Interest-rate hedge (if floating) · Import trade finance · Green-loan KPI reporting support',
    recommendedTeam: [
      { name: 'Mateo Villalobos', role: 'MD, LatAm FX Structuring', email: 'mateo.villalobos@bnpparibas.com' },
      { name: 'Elena Vance', role: 'Director, Trade Finance Americas', email: 'elena.vance@bnpparibas.com' },
      { name: 'Lucie Moreau', role: 'VP, Sustainable Finance Advisory', email: 'lucie.moreau@bnpparibas.com' },
    ],
    keyContact: {
      name: 'Mexico Treasury & Plant Finance',
      role: 'Corporate Treasury',
      email: 'treasury.mx@ternium-demo.com',
    },
    draftEmail: {
      subject: 'Pesquería Slab Plant Commissioning — MXN Hedging Window (18.8–18.9) & Working Capital Transition',
      body: `Dear Treasury Team,

Following Banxico's cut to 6.25% and the peso's ~10% move from 16.87 in September to ~18.8–18.9 this week, we wanted to revisit our August conversation on hedging your remaining peso-denominated Pesquería contractor and labor outlays.

With slab-plant start-up approaching at year-end, locking MXN forwards or collars at these weaker peso levels can protect construction budgets—and Mateo Villalobos (LatAm FX), Elena Vance (Trade Finance), and Lucie Moreau (Sustainable Finance) are ready to map out the shift from construction to operational working capital and green-loan KPI reporting under current Section 232 scenarios.

Are you available next week for a focused 30-minute review?

Best regards,
Sophie Laurent
BNP Paribas`,
    },
    linkedEvidenceIds: ['ternium-green-loan', 'market-mxn-banxico-232', 'ternium-crm-aug26'],
  },
  {
    rank: 2,
    clientId: 'krispy-kreme',
    clientName: 'Krispy Kreme (DNUT)',
    tickerOrRegion: 'US Mid-Cap · ~$577M Market Cap',
    sector: 'Consumer / Foodservice Franchisor',
    hq: 'Charlotte, NC',
    storyTheme: 'Rates Story · Hike Odds Meet 2028 Maturity',
    card: {
      timingBadge: 'Before Dec 8–9 FOMC · by Nov 16',
      triggerTag: 'Trigger: Déjà Due + Market',
      privateSideTooltip:
        'As administrative agent, BNP receives private compliance certificates and covenant calculations. Visible to RM and Credit only. Never route to public-side sales or research.',
      cameDue: [
        {
          text: 'You set this after the Sep 2026 treasury call: “Revisit after Q3.”',
          citations: [{ evidenceId: 'dnut-crm-sep26', badge: 'Demo CRM Note · Sep 2026' }],
        },
        {
          text: 'Q3 landed Nov 5.',
          citations: [{ evidenceId: 'dnut-q3-8k', badge: 'SEC Form 8-K' }],
        },
      ],
      theMove:
        'Call treasury now to discuss hedging the floating-rate debt before the Dec 8–9 FOMC, and open the refinancing timeline.',
      whyNow: [
        {
          text: 'Hot October CPI pushed December hike odds to ~85%. With ~$900M of floating debt, each 25bp hike adds ~$2.25M a year in interest if unhedged.',
          citations: [
            { evidenceId: 'market-oct-cpi', badge: 'CME FedWatch' },
            { evidenceId: 'dnut-credit-facility', badge: 'SEC 10-K' },
          ],
        },
        {
          text: 'The March 2028 maturity goes current in March 2027, which puts the refinancing window in 1H 2027.',
          citations: [{ evidenceId: 'dnut-credit-facility', badge: 'Facility Schedule' }],
        },
      ],
      ask: [
        'How much of the term loan is hedged, and when do the hedges roll off?',
        'With Q3 done, are you ready to talk about the refinancing timeline?',
      ],
      beforeYouCall: 'Check the 10-K for existing swaps.',
      bring: 'Interest-rate swap or cap · amend-and-extend',
      bnpRole: {
        text: 'Administrative, collateral & documentation agent on the 2023 facility ($300M RCF + $700M TL, +$125M 2025 upsize, matures Mar 2028)',
        citations: [{ evidenceId: 'dnut-credit-facility', badge: 'SEC Proxy / 10-Q' }],
      },
      suggestedFollowUps: [
        {
          followUp: 'Dec 9 FOMC result',
          timing: 'Dec 9',
          why: {
            text: 'Revisit hedge coverage once the rate decision is in.',
            citations: [],
          },
          dejaDueItemId: 'dd-dnut-fomc',
        },
        {
          followUp: 'Maturity goes current',
          timing: 'Mar 2027',
          why: {
            text: '12 months to the March 2028 maturity; the refinancing window opens.',
            citations: [{ evidenceId: 'dnut-credit-facility', badge: 'Facility Schedule' }],
          },
          dejaDueItemId: 'dd-dnut-current',
        },
      ],
      todaysCall: { move: 'Hedge floating debt ahead of FOMC', callBy: 'Mon, Nov 16' },
    },
    bnpRoleSummary:
      'Administrative, collateral & documentation agent on 2023 facility ($300M RCF + $700M TL, +$125M 2025 upsize); issues LCs',
    engageTiming: 'Engage Immediately (Pre–Dec 8–9 FOMC)',
    briefHeadline:
      'December hike now ~85% likely. Krispy Kreme’s floating-rate facility (BNP is agent) matures March 2028, and leverage is 5.5x. Time to talk hedging and the refinancing calendar.',
    publicEvidence: [
      { type: 'text', content: 'BNP Paribas is administrative, collateral, and documentation agent on the ' },
      {
        type: 'link',
        content: '2023 credit agreement ($300M revolver + $700M term loan, upsized $125M in 2025, maturing March 2028)',
        evidenceId: 'dnut-credit-facility',
        sourceBadge: 'SEC Proxy / 10-Q',
      },
      { type: 'text', content: ' and issues its letters of credit, with ' },
      {
        type: 'link',
        content: '$742.8M term loan and $157.5M revolver drawn at FY25 end at floating Term SOFR + margin',
        evidenceId: 'dnut-credit-facility',
        sourceBadge: 'SEC 10-K',
      },
      { type: 'text', content: ' (dividends restricted >3.0x leverage). On Nov 5, ' },
      {
        type: 'link',
        content: 'Q3 2026 results showed $328.8M net revenue, raised $1.35–$1.40B guidance, 5.5x net leverage, $250.5M liquidity, and shares +25–30%',
        evidenceId: 'dnut-q3-8k',
        sourceBadge: 'SEC 8-K',
      },
      { type: 'text', content: ' alongside Japan/Western US refranchising and a 120-shop Pakistan deal.' },
    ],
    syntheticCrmContext: [
      { type: 'text', content: 'Per your ' },
      {
        type: 'link',
        content: 'Sep 2026 treasury call note, the client prioritized cutting leverage via refranchising proceeds before any refinancing talk ("revisit after Q3")',
        evidenceId: 'dnut-crm-sep26',
        sourceBadge: 'Demo CRM Note',
      },
      { type: 'text', content: '. Note: whether part of the term loan is swapped must be checked in the 10-K before calling.' },
    ],
    whyNowBullets: [
      [
        { type: 'text', content: 'Hot ' },
        {
          type: 'link',
          content: 'October CPI (+0.4% m/m) pushed Dec 8–9 FOMC hike odds to ~85%',
          evidenceId: 'market-oct-cpi',
          sourceBadge: 'CME FedWatch',
        },
        { type: 'text', content: ': ~$900M of floating debt means each +25 bps hike adds ~$2.25M in annual interest if unhedged.' },
      ],
      [
        { type: 'text', content: 'A ' },
        {
          type: 'link',
          content: 'March 2028 maturity becomes a current liability in March 2027',
          evidenceId: 'dnut-credit-facility',
          sourceBadge: 'Facility Schedule',
        },
        { type: 'text', content: ', putting the realistic amend-and-extend or refinancing window in 1H 2027—and the Q3 equity rally gives management stronger market options than a month ago.' },
      ],
    ],
    keyPointsToHit: [
      'Term loan hedge coverage ratio and upcoming swap/cap roll-off dates ahead of Dec FOMC.',
      '1H 2027 amend-and-extend or refinancing roadmap before the March 2028 maturity goes current in March 2027.',
      'Cross-border cash management & FX conversion for new international franchise royalties (Japan, Pakistan).',
    ],
    productsAndSpecialists: 'Interest-rate swap or cap · Amend-and-extend or 2028 refinancing · International royalty cash management',
    recommendedTeam: [
      { name: 'Marc-Antoine Lefèvre', role: 'MD, Corporate Rates & Derivatives Sales', email: 'marc-antoine.lefevre@bnpparibas.com' },
      { name: 'Claire-Marie Dubois', role: 'Director, Loan Capital Markets', email: 'claire-marie.dubois@bnpparibas.com' },
    ],
    informationBarrierNotice:
      'Private-Side Barrier: As administrative agent, BNP receives private compliance certificates and covenant calculations. Visible to RM and Credit only—never route to public-side sales or research.',
    keyContact: {
      name: 'VP Treasury & Corporate Finance',
      role: 'Krispy Kreme Treasury',
      email: 'treasury@krispykreme-demo.com',
    },
    draftEmail: {
      subject: 'Krispy Kreme — Post-Q3 Check-In: Rate Hedging Ahead of Dec FOMC & 2028 Facility Calendar',
      body: `Hi Team,

Congratulations on the Q3 results and the strong market reception to your refranchising progress and raised full-year guidance.

As promised when we spoke in September about revisiting post-Q3, I wanted to flag two timely items ahead of December:
1. Following this week's October CPI print (+0.4% m/m), market-implied odds for a December 8–9 FOMC hike moved to ~85%. On ~$900M of floating SOFR exposure, every 25 bps move adds roughly $2.25M in annualized interest—so Marc-Antoine Lefèvre from our Rates desk can share live swap and cap structures to review alongside your existing hedge roll-offs.
2. Looking ahead to March 2027, when the March 2028 credit facility turns current, the post-Q3 equity momentum opens a constructive window with Claire-Marie Dubois in Loan Capital Markets to map out a 1H 2027 amend-and-extend or refinancing roadmap.

Would next Tuesday or Wednesday work for a brief 25-minute call?

Best regards,
Sophie Laurent
Relationship Manager · Corporate Coverage, BNP Paribas`,
    },
    linkedEvidenceIds: ['dnut-credit-facility', 'dnut-q3-8k', 'market-oct-cpi', 'dnut-crm-sep26'],
  },
  {
    rank: 3,
    clientId: 'castleton-commodities',
    clientName: 'Castleton Commodities (CCI)',
    tickerOrRegion: 'Global Commodity Merchant',
    sector: 'Energy, Power, Metals & Freight Trading',
    hq: 'Stamford, CT',
    storyTheme: 'Commodity Story · Sharpest Oil Drop Since COVID Hits Borrowing Base',
    card: {
      timingBadge: 'Before Dec certificate · by Nov 30',
      triggerTag: 'Trigger: Market + CRM',
      privateSideTooltip:
        'CCI’s inventory and borrowing-base data are confidential lender information. Never route this brief to BNP’s own commodity traders or research.',
      theMove:
        'Call before the next borrowing-base report to check collateral headroom after the oil drop, and to re-size the accordion request.',
      whyNow: [
        {
          text: 'Brent fell 16% in the week to Nov 6 (the sharpest drop since COVID) and dipped below $90 on Nov 10. CCI’s borrowing base is marked to these prices.',
          citations: [{ evidenceId: 'market-brent-drop', badge: 'Reuters / OilPrice' }],
        },
        {
          text: 'In October, CCI asked about using the $1B accordion for more LC capacity, but lower cargo values may change how much it needs.',
          citations: [{ evidenceId: 'cci-crm-oct26', badge: 'Demo CRM Note · Oct 2026' }],
        },
      ],
      ask: [
        'How does your headroom look against October’s certificate?',
        'Is margin on your hedges creating short-term cash gaps?',
      ],
      bring: 'Accordion or interim redetermination · commodity & freight hedging',
      bnpRole: {
        text: 'Global coordinator & administrative agent on the borrowing-base facility (2018 $3.525B; 2022 $2.2B, $1B accordion)',
        citations: [{ evidenceId: 'cci-borrowing-base', badge: 'CCI / ABF Journal' }],
      },
      suggestedFollowUps: [
        {
          followUp: 'Next borrowing-base report',
          timing: 'Dec',
          why: {
            text: 'Re-check headroom on the new certificate after the oil sell-off.',
            citations: [],
          },
          dejaDueItemId: 'dd-cci-cert',
        },
      ],
      assumption: 'Assumes BNP remains agent on a monthly borrowing-base certificate schedule.',
      todaysCall: { move: 'Check borrowing-base headroom after oil drop', callBy: 'Mon, Nov 30' },
    },
    bnpRoleSummary: 'Global coordinator & administrative agent on borrowing-base facility (2018 $3.525B & 2022 $2.2B renewals, $1B accordion)',
    engageTiming: 'Engage Before Monthly Borrowing-Base Certificate',
    briefHeadline:
      'Brent fell 16% in a week and briefly broke $90. CCI’s BNP-agented borrowing base is marked to these prices. Check headroom, hedge margin and LC usage before the next borrowing-base report.',
    publicEvidence: [
      { type: 'text', content: 'BNP Paribas acted as global coordinator and administrative agent on CCI’s ' },
      {
        type: 'link',
        content: '2018 ($3.525B) and 2022 ($2.2B, 17 banks, $1B accordion) borrowing-base facilities',
        evidenceId: 'cci-borrowing-base',
        sourceBadge: 'CCI / ABF Journal',
      },
      { type: 'text', content: ' backing merchanting letters of credit. This week, ' },
      {
        type: 'link',
        content: 'Brent fell 16% in the week to Nov 6 (sharpest drop since COVID) and dipped below $90 on Nov 10',
        evidenceId: 'market-brent-drop',
        sourceBadge: 'Reuters / OilPrice',
      },
      { type: 'text', content: ' as Dated Brent slipped below futures—yet Goldman lifted its Dec target to $105 ($140 Gulf risk), creating acute two-way volatility.' },
    ],
    syntheticCrmContext: [
      { type: 'text', content: 'Per your ' },
      {
        type: 'link',
        content: 'Oct 2026 call note, CCI built crude and refined product inventory during the war premium and asked about using the $1B accordion for extra LC capacity',
        evidenceId: 'cci-crm-oct26',
        sourceBadge: 'Demo CRM Note',
      },
      { type: 'text', content: ' (demo assumes BNP remains agent on a monthly borrowing-base certificate schedule).' },
    ],
    whyNowBullets: [
      [
        { type: 'text', content: 'A borrowing base lends against inventory and receivables at market value: a 16% Brent drop directly shrinks collateral headroom, even as smaller cargoes require smaller LCs.' },
      ],
      [
        { type: 'text', content: 'Hedged inventory means futures gains and physical losses settle on different timelines, creating short-term liquidity swings while tanker freight rates stayed elevated.' },
      ],
    ],
    keyPointsToHit: [
      'Mark-to-market borrowing-base availability vs. October’s certificate following the 16% crude sell-off.',
      'Re-sizing LC accordion demand versus lower nominal cargo values and futures/physical margin timing mismatches.',
      'Two-way crude & elevated tanker freight hedging if Iran diplomacy reverses back toward $105+.',
    ],
    productsAndSpecialists: 'Borrowing-base facility (accordion, interim redetermination) · Letters of credit · Commodity & freight hedging',
    recommendedTeam: [
      { name: 'Henrik Lindqvist', role: 'MD, Commodity Trade Finance', email: 'henrik.lindqvist@bnpparibas.com' },
      { name: 'David K. Chen', role: 'Executive Director, Commodity Derivatives', email: 'david.chen@bnpparibas.com' },
    ],
    informationBarrierNotice:
      'Private-Side Barrier: CCI’s inventory and borrowing-base data are confidential lender information. Never route this brief to BNP’s own commodity traders or research.',
    keyContact: {
      name: 'Global Treasury & Trade Operations',
      role: 'CCI Treasury',
      email: 'treasury@cci-demo.com',
    },
    draftEmail: {
      subject: 'CCI Borrowing-Base Headroom & LC Capacity Check — Following 16% Brent Move',
      body: `Hi Team,

Following the sharp 16% pullback in Brent over the past week and Tuesday's dip below $90/bbl—while tanker freight remains elevated—we wanted to touch base ahead of your next borrowing-base certificate.

When we spoke in October about your inventory build and potential use of the $1B accordion for additional LC capacity, pricing dynamics looked quite different. Henrik Lindqvist (Commodity Trade Finance) and David Chen (Commodity Derivatives) would be glad to run through updated mark-to-market availability, hedge-margin liquidity timing, and two-way upside protection scenarios.

Do you have 20 minutes this week to review ahead of month-end reporting?

Best regards,
Sophie Laurent
BNP Paribas`,
    },
    linkedEvidenceIds: ['cci-borrowing-base', 'market-brent-drop', 'cci-crm-oct26'],
  },
];

export const DEJA_DUE_ITEMS: DejaDueItem[] = [
  {
    id: 'dd-dnut-fomc',
    clientId: 'krispy-kreme',
    clientName: 'Krispy Kreme (DNUT)',
    triggerTiming: 'Dec 9, 2026',
    dateValue: '2026-12-09',
    triggerType: 'Calendar',
    title: 'Post-FOMC Rate Decision Follow-On',
    actionRequired: 'Resurface immediately after the Dec 8–9 FOMC decision with the actual policy move and ~$900M SOFR interest impact.',
    specialists: 'Marc-Antoine Lefèvre (MD, Corporate Rates)',
    evidenceId: 'market-oct-cpi',
  },
  {
    id: 'dd-cci-cert',
    clientId: 'castleton-commodities',
    clientName: 'Castleton Commodities (CCI)',
    triggerTiming: 'Dec 31, 2026',
    dateValue: '2026-12-31',
    triggerType: 'Calendar',
    title: 'Next Monthly Borrowing-Base Certificate & Tranche Roll',
    actionRequired: 'Re-check mark-to-market inventory headroom, LC accordion demand, and 364-day/2-year tranche maturities.',
    specialists: 'Henrik Lindqvist (MD, Commodity Trade Finance)',
    evidenceId: 'cci-borrowing-base',
  },
  {
    id: 'dd-tx-startup',
    clientId: 'ternium-mexico',
    clientName: 'Ternium Mexico',
    triggerTiming: '~Jan 2027',
    dateValue: '2027-01-04',
    triggerType: 'Calendar',
    title: 'Pesquería Slab Plant Start-Up Transition',
    actionRequired: 'Transition $1.25B green loan coverage from construction to operational working capital, import trade finance, and green-KPI reporting.',
    specialists: 'Elena Vance & Lucie Moreau',
    evidenceId: 'ternium-green-loan',
  },
  {
    id: 'dd-tx-truce',
    clientId: 'ternium-mexico',
    clientName: 'Ternium Mexico',
    triggerTiming: 'Jan 10, 2027',
    dateValue: '2027-01-10',
    triggerType: 'Calendar',
    title: 'US–China 24% Tariff Truce Expiry',
    actionRequired: 'Reassess Asian steel import flows into North America and Mexico mirror-tariff pressure.',
    specialists: 'Mateo Villalobos (MD, LatAm FX)',
    evidenceId: 'market-mxn-banxico-232',
  },
  {
    id: 'dd-dnut-current',
    clientId: 'krispy-kreme',
    clientName: 'Krispy Kreme (DNUT)',
    triggerTiming: 'Mar 1, 2027',
    dateValue: '2027-03-01',
    triggerType: 'Calendar',
    title: '12 Months to March 2028 Maturity (Debt Goes Current)',
    actionRequired: 'Launch 1H 2027 amend-and-extend or refinancing mandate before facility becomes a current liability.',
    specialists: 'Claire-Marie Dubois (Director, LCM)',
    evidenceId: 'dnut-credit-facility',
  },
  {
    id: 'dd-tx-usmca',
    clientId: 'ternium-mexico',
    clientName: 'Ternium Mexico',
    triggerTiming: 'Jul 1, 2027',
    dateValue: '2027-07-01',
    triggerType: 'Calendar',
    title: 'USMCA Annual Joint Review',
    actionRequired: 'Refresh 2027 North American steel demand and Section 232 tariff scenarios.',
    specialists: 'Elena Vance (Director, Trade Finance)',
    evidenceId: 'market-mxn-banxico-232',
  },
  {
    id: 'dd-event-triggers',
    clientId: 'krispy-kreme',
    clientName: 'All 3 Clients (Event-Triggered)',
    triggerTiming: 'Event-Triggered',
    dateValue: '2026-11-20',
    triggerType: 'Event-Triggered',
    title: 'Refranchising Closes (DNUT) & Iran Diplomacy Shifts (CCI)',
    actionRequired: 'DNUT: Ask about refranchising proceeds debt paydown & covenant headroom. CCI: Re-run borrowing-base card on any Iran deal or breakdown.',
    specialists: 'RM Coverage & Credit',
    evidenceId: 'dnut-q3-8k',
  },
];

export const TRIGGER_FEED: TriggerFeedRow[] = [
  {
    date: 'Nov 10',
    event: 'October CPI +0.4% m/m vs +0.3% expected; core +0.3%. Dec 8–9 hike odds ~85% on CME FedWatch',
    whoItHits: 'Floating-rate debt or refinancing in next 18 months',
    source: 'CME FedWatch / TT News',
    externalUrl: 'https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html',
    surfacedClient: 'Krispy Kreme (DNUT)',
  },
  {
    date: 'Nov 9–10',
    event: 'Brent fell 16% in prior week (sharpest since COVID), then briefly below $90 on Iran peace hopes',
    whoItHits: 'Commodity traders, producers, borrowing-base borrowers',
    source: 'OilPrice / Reuters',
    externalUrl: 'https://oilprice.com/Energy/Crude-Oil/',
    surfacedClient: 'Castleton Commodities',
  },
  {
    date: 'Nov 9',
    event: 'China keeps 24% extra tariff on US goods suspended to Jan 10, 2027 (10% stays); Trump–Xi APEC',
    whoItHits: 'US exporters to China; importers of Chinese inputs',
    source: 'Reuters / gCaptain',
    externalUrl: 'https://www.reuters.com/world/china/',
  },
  {
    date: 'Nov 5',
    event: 'Banxico cuts to 6.25%, against expectations of a hold; peso touches ~18.9, a 15-month low',
    whoItHits: 'US firms with Mexican plants / MXN payroll; Mexican borrowers',
    source: 'Trading Economics',
    externalUrl: 'https://tradingeconomics.com/mexico/interest-rate',
    surfacedClient: 'Ternium Mexico',
  },
  {
    date: 'Nov 5',
    event: 'Krispy Kreme Q3: revenue guidance raised, net leverage 5.5x, stock up ~25–30%',
    whoItHits: 'Krispy Kreme (client-specific news)',
    source: 'SEC EDGAR 8-K',
    externalUrl: 'https://www.sec.gov/edgar/browse/?CIK=0001857154',
    surfacedClient: 'Krispy Kreme (DNUT)',
  },
  {
    date: 'Nov 3–4',
    event: 'Midterms: Democrats win both chambers; dollar dips, 10Y yield falls ~7 bps to 4.89%',
    whoItHits: 'Broad policy risk on tariffs, fiscal outlook',
    source: 'US Treasury Yields',
    externalUrl: 'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/',
  },
  {
    date: 'Oct 30',
    event: 'New Section 338 list in force: 50% tariff on ~$20B Canadian goods, 100 lines added',
    whoItHits: 'US importers of Canadian goods',
    source: 'USTR / STR',
    externalUrl: 'https://ustr.gov/',
  },
  {
    date: 'Oct 28',
    event: 'Fed holds at 3.75–4.00% (10–2) after Sep hike; 10Y Treasury closes at 5.03%',
    whoItHits: 'Floating-rate borrowers; bond issuance plans',
    source: 'Federal Reserve FOMC',
    externalUrl: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm',
    surfacedClient: 'Krispy Kreme (DNUT)',
  },
  {
    date: 'Oct 23',
    event: 'US–Mexico trade talks stall on Section 232 steel and aluminum tariffs (still 50%)',
    whoItHits: 'Mexican steel, autos, auto parts; US buyers',
    source: 'SteelOrbis / Sec. 232',
    externalUrl: 'https://www.steelorbis.com/',
    surfacedClient: 'Ternium Mexico',
  },
  {
    date: 'Ongoing',
    event: 'USMCA not renewed at July 1 review; annual reviews apply (in force to 2036)',
    whoItHits: 'North American supply chains',
    source: 'White & Case / USTR',
    externalUrl: 'https://ustr.gov/trade-agreements/free-trade-agreements/united-states-mexico-canada-agreement',
    surfacedClient: 'Ternium Mexico',
  },
  {
    date: 'Ongoing',
    event: 'IEEPA tariff refunds flowing in phases through CBP CAPE system after Feb 20 Supreme Court ruling',
    whoItHits: 'Importers that paid IEEPA duties',
    source: 'CBP Trade / Troutman',
    externalUrl: 'https://www.cbp.gov/trade',
  },
];

export const SUPPRESSED_SIGNALS: SuppressedSignalRow[] = [
  {
    event: 'Oil price drop (-16% Brent)',
    client: 'Krispy Kreme',
    reason: 'Fuel is a small cost; US logistics outsourced in April 2026',
    ruleApplied: 'Below materiality threshold',
  },
  {
    event: 'Fed hike odds (~85%)',
    client: 'Castleton Commodities',
    reason: 'Real, but secondary to a 16% oil move; merged into CCI liquidity check',
    ruleApplied: 'One card per client per week',
  },
  {
    event: 'Krispy Kreme Q3 results',
    client: 'Krispy Kreme',
    reason: 'Not a separate card; embedded as evidence inside the rate/refi card',
    ruleApplied: 'Merge duplicates',
  },
  {
    event: 'US–China truce extension',
    client: 'Ternium Mexico',
    reason: 'Status quo kept; nothing changed immediately for the client',
    ruleApplied: 'No change, no card',
  },
  {
    event: 'EUR/USD near 2026 lows (1.12)',
    client: 'All three',
    reason: 'No material euro exposure in public filings or CRM context',
    ruleApplied: 'No exposure link',
  },
  {
    event: 'Section 338 Canada tariff list',
    client: 'All three',
    reason: 'None import the covered Canadian goods (e.g., carpet/flooring)',
    ruleApplied: 'No exposure link',
  },
  {
    event: 'Midterm election results',
    client: 'All three',
    reason: 'No enacted policy yet; flagged for monitoring only',
    ruleApplied: 'Wait for action, not headlines',
  },
  {
    event: 'IEEPA tariff refunds',
    client: 'All three',
    reason: 'Only surfaces if CRM shows the client actually paid IEEPA duties',
    ruleApplied: 'Missing evidence, so no claim',
  },
];

export const INITIAL_EMAILS: OutlookEmail[] = [
  {
    id: 'email-weekly-brief',
    folder: 'inbox',
    group: 'Today',
    isNewsletter: true,
    isUnread: true,
    isFlagged: true,
    isPinned: true,
    isFocused: true,
    senderName: 'Rendez-Vous',
    senderInitials: 'RV',
    senderEmail: 'rendez-vous@bnpparibas.com',
    senderRole: 'BNP Paribas RM Client Intelligence',
    subject: '(INTERNAL): This Week in a Changing World',
    preview: '3 clients matched from 11 live market triggers: Ternium Mexico (MXN/Banxico/232), Castleton (Brent -16%), Krispy Kreme (CPI/2028 refi) + Déjà Due...',
    timestamp: '7:30 AM',
    dateLabel: 'Thu, Nov 12, 2026 · 07:30 AM',
    clientTag: '3 Clients · 8 Filtered',
  },
  {
    id: 'email-dnut-treasury',
    folder: 'inbox',
    group: 'Today',
    isUnread: true,
    isFlagged: false,
    isFocused: true,
    senderName: 'Krispy Kreme Treasury',
    senderInitials: 'KK',
    senderEmail: 'treasury@krispykreme-demo.com',
    senderRole: 'Corporate Treasury (DNUT)',
    subject: 'Post-Q3 Follow-Up & Dec FOMC Sensitivity',
    preview: 'Sophie, following our Q3 release and yesterday’s CPI move, we want to revisit our September conversation on Term SOFR hedges...',
    timestamp: '10:42 AM',
    dateLabel: 'Thu, Nov 12, 2026 · 10:42 AM',
    hasAttachment: true,
    clientTag: 'Krispy Kreme (DNUT)',
    bodyParagraphs: [
      'Hi Sophie,',
      'Thanks for the note following our Q3 earnings release and the market response to our refranchising momentum.',
      'After Tuesday’s October CPI print pushed December FOMC hike expectations higher, our CFO asked us to pull together a quick check on floating-rate exposure across the $900M credit facility and outline options ahead of next spring when the March 2028 maturity goes current.',
      'Can you bring Marc-Antoine Lefèvre and Claire-Marie Dubois for a 25-minute call early next week?',
      'Best regards,',
      'VP Treasury · Krispy Kreme',
    ],
  },
  {
    id: 'email-rates-desk',
    folder: 'inbox',
    group: 'Today',
    isUnread: false,
    isFlagged: false,
    isFocused: true,
    senderName: 'Marc-Antoine Lefèvre',
    senderInitials: 'ML',
    senderEmail: 'ma.lefevre@bnpparibas.com',
    senderRole: 'MD, Corporate Rates & Derivatives Sales',
    subject: 'SOFR Cap & Swap Pricing Grid — Post-CPI Update',
    preview: 'Team, following the +0.4% Oct CPI print (Dec hike odds ~85%), attached are refreshed 1Y/2Y SOFR swap and cap levels for mid-cap borrowers...',
    timestamp: '9:15 AM',
    dateLabel: 'Thu, Nov 12, 2026 · 09:15 AM',
    hasAttachment: true,
    bodyParagraphs: [
      'Coverage Team,',
      'Following Tuesday’s +0.4% m/m October CPI print, CME FedWatch December hike odds jumped to ~85%.',
      'For any leveraged borrowers carrying unhedged Term SOFR term loans or revolvers maturing in 2027–2028, we have refreshed 18-month and 24-month interest-rate cap and swap grids. Happy to join client calls immediately.',
      'Marc-Antoine Lefèvre · MD, Corporate Rates & Derivatives Sales',
    ],
  },
  {
    id: 'email-cci-ops',
    folder: 'inbox',
    group: 'Yesterday',
    isUnread: false,
    isFlagged: true,
    isFocused: true,
    senderName: 'CCI Trade Operations',
    senderInitials: 'CC',
    senderEmail: 'treasury@cci-demo.com',
    senderRole: 'Castleton Commodities International',
    subject: 'Nov 30 Borrowing-Base Certificate Prep & Brent Volatility',
    preview: 'Sophie, given Brent’s 16% drop and dip below $90 yesterday, we are running a mid-month inventory mark ahead of the Nov 30 BBC...',
    timestamp: '4:18 PM',
    dateLabel: 'Wed, Nov 11, 2026 · 4:18 PM',
    clientTag: 'Castleton Commodities',
    bodyParagraphs: [
      'Hi Sophie,',
      'Given Brent’s 16% drop over the past week and yesterday’s move below $90, we are running an interim mark-to-market on our physical crude and refined inventory built in October.',
      'We may adjust our LC utilization forecast versus what we discussed regarding the $1B accordion. Let’s connect with Henrik Lindqvist before the Nov 30 borrowing-base certificate.',
      'Regards,',
      'Global Treasury & Trade Operations · Castleton Commodities',
    ],
  },
  {
    id: 'email-weekly-brief-prev',
    folder: 'briefs',
    group: 'Yesterday',
    isNewsletter: true,
    isUnread: false,
    isFlagged: false,
    isFocused: true,
    senderName: 'Rendez-Vous',
    senderInitials: 'RV',
    senderEmail: 'rendez-vous@bnpparibas.com',
    senderRole: 'BNP Paribas RM Client Intelligence',
    subject: '(INTERNAL): This Week in a Changing World (Nov 5 Edition)',
    preview: '3 clients matched: Fed Oct 28 hold & 5.03% 10Y Treasury, Section 338 Canada tariffs, USMCA review...',
    timestamp: 'Nov 5',
    dateLabel: 'Thu, Nov 5, 2026 · 07:30 AM',
    clientTag: 'Archive · Nov 5 Edition',
  },
  {
    id: 'email-sent-ternium',
    folder: 'sent',
    group: 'Yesterday',
    isUnread: false,
    isFlagged: false,
    isFocused: true,
    senderName: 'Sophie Laurent',
    senderInitials: 'SL',
    senderEmail: 'sophie.laurent@bnpparibas.com',
    subject: 'RE: Pesquería Green Loan KPI Reporting Timeline',
    preview: 'Thank you — copying Lucie Moreau from our Sustainable Finance team ahead of year-end slab plant start-up...',
    timestamp: 'Nov 9',
    dateLabel: 'Mon, Nov 9, 2026 · 2:10 PM',
    bodyParagraphs: [
      'Hi Team,',
      'Thank you for the construction progress note on Pesquería. Copying Lucie Moreau (VP, Sustainable Finance) so we stay aligned ahead of year-end slab plant commissioning.',
      'Best regards, Sophie',
    ],
  },
];

export const CLIENT_DOSSIERS: ClientDossier[] = [
  {
    id: 'krispy-kreme',
    name: 'Krispy Kreme (DNUT)',
    sector: 'Consumer / Foodservice Franchisor',
    hq: 'Charlotte, NC',
    marketCapOrSize: '~$577M Market Cap',
    keyFinancials: 'Q3 Rev $328.8M · FY Guide $1.35–$1.40B · Liquidity $250.5M',
    netLeverage: '5.5x (Dividends restricted >3.0x)',
    bnpDocumentedRole: 'Admin, Collateral & Doc Agent (2023 Facility) + LC Issuer',
    primaryContact: {
      name: 'VP Treasury & Corporate Finance',
      role: 'Corporate Treasury',
      email: 'treasury@krispykreme-demo.com',
      phone: '+1 (704) 555-0148',
    },
    activeFacilities: [
      {
        code: '2023-TL',
        type: 'Senior Term Loan (+$125M 2025 Upsize)',
        amount: '$742.8M Drawn ($700M Orig.)',
        maturity: 'March 2028 (Current Mar 2027)',
        status: 'Floating Adj. Term SOFR',
      },
      {
        code: '2023-RCF',
        type: 'Revolving Credit Facility & LCs',
        amount: '$157.5M Drawn ($300M Cap)',
        maturity: 'March 2028',
        status: 'BNP LC Issuer',
      },
    ],
    openOpportunity: 'Interest-Rate Swap/Cap + 1H 2027 Amend-and-Extend / Refinancing + International Royalty FX',
    recommendedTeam: [
      { name: 'Marc-Antoine Lefèvre', role: 'MD, Corporate Rates & Derivatives Sales', email: 'marc-antoine.lefevre@bnpparibas.com' },
      { name: 'Claire-Marie Dubois', role: 'Director, Loan Capital Markets', email: 'claire-marie.dubois@bnpparibas.com' },
    ],
    recentEvidenceIds: ['dnut-credit-facility', 'dnut-q3-8k', 'market-oct-cpi', 'dnut-crm-sep26'],
    informationBarrierNotice:
      'Private-Side Lender File: Compliance certificates and covenant calculations restricted to RM and Credit teams.',
  },
  {
    id: 'ternium-mexico',
    name: 'Ternium Mexico',
    sector: 'Low-Carbon Steel & Industrial Metals',
    hq: 'Monterrey, Mexico (Pesquería Complex)',
    marketCapOrSize: '$1.25B Project Financing',
    keyFinancials: 'Pesquería cold-rolling/galvanizing ramping; slab plant YE 2026',
    netLeverage: 'Green Project Debt (SOFR + 125 bps)',
    bnpDocumentedRole: 'Joint Lead Arranger & Bookrunner ($1.25B Green Loan, Aug 2025)',
    primaryContact: {
      name: 'Mexico Treasury & Plant Finance',
      role: 'Treasury Team',
      email: 'treasury.mx@ternium-demo.com',
      phone: '+52 81 5550 2890',
    },
    activeFacilities: [
      {
        code: 'TX-GREEN-25',
        type: 'Syndicated Green Loan (7 JLAs incl. BNP)',
        amount: '$1,250.0M',
        maturity: 'Plant Commissioning YE 2026',
        status: 'Construction → Operations',
      },
    ],
    openOpportunity: 'MXN Forwards/Collars (~18.8–18.9) + Working Capital & Import Trade Finance + Green KPI Support',
    recommendedTeam: [
      { name: 'Mateo Villalobos', role: 'MD, LatAm FX Structuring', email: 'mateo.villalobos@bnpparibas.com' },
      { name: 'Elena Vance', role: 'Director, Trade Finance Americas', email: 'elena.vance@bnpparibas.com' },
      { name: 'Lucie Moreau', role: 'VP, Sustainable Finance Advisory', email: 'lucie.moreau@bnpparibas.com' },
    ],
    recentEvidenceIds: ['ternium-green-loan', 'market-mxn-banxico-232', 'ternium-crm-aug26'],
  },
  {
    id: 'castleton-commodities',
    name: 'Castleton Commodities (CCI)',
    sector: 'Global Commodity Merchant (Energy, Power, Metals, Freight)',
    hq: 'Stamford, CT',
    marketCapOrSize: '$2.2B Borrowing Base (+$1B Accordion)',
    keyFinancials: '17-Bank Syndicated BBF · Physical & Derivatives Merchanting',
    netLeverage: 'Marked-to-Market Borrowing Base',
    bnpDocumentedRole: 'Global Coordinator & Administrative Agent (2018 & 2022 Renewals)',
    primaryContact: {
      name: 'Global Treasury & Trade Operations',
      role: 'Trade Finance & Liquidity',
      email: 'treasury@cci-demo.com',
      phone: '+1 (203) 555-0192',
    },
    activeFacilities: [
      {
        code: 'CCI-BBF-22',
        type: 'Global Borrowing-Base Facility (364d & 2Y)',
        amount: '$2,200.0M (+$1B Accordion)',
        maturity: 'Monthly BBC Redetermination',
        status: 'Brent -16% Mark Watch',
      },
    ],
    openOpportunity: 'Borrowing-Base Headroom Check, LC Accordion Review, Commodity & Freight Hedging',
    recommendedTeam: [
      { name: 'Henrik Lindqvist', role: 'MD, Commodity Trade Finance', email: 'henrik.lindqvist@bnpparibas.com' },
      { name: 'David K. Chen', role: 'Executive Director, Commodity Derivatives', email: 'david.chen@bnpparibas.com' },
    ],
    recentEvidenceIds: ['cci-borrowing-base', 'market-brent-drop', 'cci-crm-oct26'],
    informationBarrierNotice:
      'Private-Side Lender File: Inventory & facility data restricted from BNP commodity trading desks and research.',
  },
];

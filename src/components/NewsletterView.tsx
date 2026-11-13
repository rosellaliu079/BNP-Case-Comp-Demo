import React, { useState } from 'react';
import {
  AlarmClock,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Calendar,
  ChevronDown,
  ExternalLink,
  FileText,
  Filter,
  Lock,
  Plus,
  Send,
  UserRound,
  X,
} from 'lucide-react';
import {
  CitationRef,
  CitedLine,
  ClientBriefItem,
  DEJA_DUE_ITEMS,
  DejaDueItem,
  DejaDueSuggestion,
  EVIDENCE_RECORDS,
  RM_PROFILE,
  SpecialistColleague,
  SUPPRESSED_SIGNALS,
  TRIGGER_FEED,
  WEEKLY_CLIENT_BRIEFS,
} from '../data/newsletterData';

interface NewsletterViewProps {
  onOpenEvidence: (evidenceId: string) => void;
  onDraftOutreach: (client: ClientBriefItem) => void;
  onDraftSpecialistEmail: (member: SpecialistColleague) => void;
  onOpenClientCrm: (clientId: string) => void;
  activeEvidenceId: string | null;
  dejaDueItems: DejaDueItem[];
  onUpdateDejaDueDate: (id: string, newDateIso: string) => void;
  editionLabel?: string;
}

type CardStatus = 'open' | 'snoozed' | 'dismissed';
type RenderCitedLine = (line: CitedLine) => React.ReactNode;

/**
 * Déjà Due line states on page 1:
 *  - 'set'       State B: reminder exists in Frame 5 → "✓ Reminder set · Edit · Remove"
 *  - 'removed'   State B after Remove → "Reminder removed · Undo"
 *  - 'suggested' State C: Rendez-Vous suggests a follow-up that is NOT in Frame 5 yet.
 *                Nothing is set until the RM clicks "Set reminder". No card uses this today.
 *  - 'justSet'   State C after the RM clicks "Set reminder" → "✓ Reminder set · Undo"
 */
type ReminderState = 'set' | 'removed' | 'suggested' | 'justSet';

const AUDIT_SECTION_ID = 'signal-filtering-audit-section';

/*
 * Colour roles on page 1:
 *  - green  → brand header and primary actions only
 *  - amber  → Déjà Due that needs the RM now (came due, or suggested and not yet set)
 *  - grey   → Déjà Due "Reminder set" (scheduled for later; team preference)
 *  - blue   → internal CRM citation chips only
 *  - yellow → pre-call checklists (Before you call / Barrier check)
 */
const DEJA_DUE = {
  accent: 'text-[#B7791F]', // bell icons
  text: 'text-[#8F5F14]', // small amber text (darker than #B7791F for legibility)
  bg: 'bg-[#FFF8E6]',
  border: 'border-[#F0D9A8]',
};

type DejaDueTone = typeof DEJA_DUE;
const DEJA_DUE_SET: DejaDueTone = {
  accent: 'text-gray-500',
  text: 'text-gray-600',
  bg: 'bg-gray-50',
  border: 'border-gray-200',
};

const CHIP_BASE =
  'inline-flex items-center rounded-md border text-[11px] font-medium leading-none whitespace-nowrap';
const CHIP_PUBLIC = 'bg-gray-100 border-gray-200 text-gray-700';
const CHIP_CRM = 'bg-[#EAF2FB] border-[#CFE0F5] text-[#2B6CB0]';

const TOOLTIP =
  'pointer-events-none absolute left-0 top-full mt-1.5 z-20 w-80 max-w-full rounded-md bg-gray-900 px-3 py-2 text-xs font-normal leading-snug text-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-opacity';

const formatPickedDate = (iso: string) => {
  const parsed = new Date(`${iso}T12:00:00`);
  return Number.isNaN(parsed.getTime())
    ? iso
    : parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const BlockLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">{children}</div>
);

const DejaDueLabel: React.FC<{ children: React.ReactNode; tone?: DejaDueTone }> = ({ children, tone = DEJA_DUE }) => (
  <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide ${tone.text}`}>
    <Bell className={`w-3.5 h-3.5 ${tone.accent}`} />
    {children}
  </span>
);

const TextAction: React.FC<{ onClick: () => void; children: React.ReactNode; tone?: DejaDueTone }> = ({
  onClick,
  children,
  tone = DEJA_DUE,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-xs font-medium underline underline-offset-2 cursor-pointer ${tone.text}`}
  >
    {children}
  </button>
);

/* ---------- Déjà Due, State A: "Came due" banner ---------- */
const DejaDueCameDueBanner: React.FC<{ lines: CitedLine[]; renderCitedLine: RenderCitedLine }> = ({
  lines,
  renderCitedLine,
}) => (
  <div className={`px-5 sm:px-6 py-3 border-b ${DEJA_DUE.bg} ${DEJA_DUE.border}`}>
    <DejaDueLabel>Déjà Due · Your reminder came due</DejaDueLabel>
    <div className="mt-1 space-y-0.5 text-[13px] leading-relaxed text-gray-800">
      {lines.map((line, idx) => (
        <p key={idx}>{renderCitedLine(line)}</p>
      ))}
    </div>
  </div>
);

/* ---------- Déjà Due, States B & C: strip at the bottom of each card ---------- */
interface DejaDueStripProps {
  followUps: DejaDueSuggestion[];
  stateFor: (idx: number) => ReminderState;
  timingFor: (idx: number) => string;
  setState: (idx: number, state: ReminderState) => void;
  onPickDate: (idx: number, iso: string) => void;
  renderCitedLine: RenderCitedLine;
}

const DejaDueStrip: React.FC<DejaDueStripProps> = ({
  followUps,
  stateFor,
  timingFor,
  setState,
  onPickDate,
  renderCitedLine,
}) => {
  const [pickerIdx, setPickerIdx] = useState<number | null>(null);
  // Strip is grey when every line is set/removed; amber while any follow-up still needs a decision.
  const needsDecision = followUps.some((_, idx) => stateFor(idx) === 'suggested');
  const tone = needsDecision ? DEJA_DUE : DEJA_DUE_SET;
  const set = DEJA_DUE_SET;

  const datePicker = (idx: number) => (
    <input
      type="date"
      autoFocus
      aria-label="Pick a new reminder date"
      onChange={(e) => {
        if (e.target.value) onPickDate(idx, e.target.value);
        setPickerIdx(null);
      }}
      onBlur={() => setPickerIdx(null)}
      className={`border rounded px-1.5 py-0.5 text-xs text-gray-900 bg-white ${DEJA_DUE.border}`}
    />
  );

  return (
    <div className={`px-5 sm:px-6 py-2.5 border-t ${tone.bg} ${tone.border} space-y-2`}>
      {followUps.map((followUp, idx) => {
        const state = stateFor(idx);
        const label = `${followUp.followUp} · ${timingFor(idx)}`;

        if (state === 'removed') {
          return (
            <div key={idx} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-gray-600">
              <DejaDueLabel tone={set}>Déjà Due</DejaDueLabel>
              <span>· Reminder removed ·</span>
              <TextAction tone={set} onClick={() => setState(idx, 'set')}>Undo</TextAction>
            </div>
          );
        }

        if (state === 'set' || state === 'justSet') {
          return (
            <div key={idx} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-gray-800">
              <DejaDueLabel tone={set}>Déjà Due · ✓ Reminder set</DejaDueLabel>
              <span>
                · <span className="font-semibold text-gray-900">{label}</span>
              </span>
              <span className="text-gray-400" aria-hidden="true">·</span>
              {state === 'justSet' ? (
                <TextAction tone={set} onClick={() => setState(idx, 'suggested')}>Undo</TextAction>
              ) : (
                <>
                  {pickerIdx === idx ? datePicker(idx) : <TextAction tone={set} onClick={() => setPickerIdx(idx)}>Edit</TextAction>}
                  <span className="text-gray-400" aria-hidden="true">·</span>
                  <TextAction tone={set} onClick={() => setState(idx, 'removed')}>Remove</TextAction>
                </>
              )}
            </div>
          );
        }

        // State C: suggested (follow-up not yet in Frame 5)
        return (
          <div key={idx}>
            <DejaDueLabel>Déjà Due · Suggested follow-up</DejaDueLabel>
            <div className="mt-1 text-[13px] font-semibold text-gray-900">{label}</div>
            {followUp.why && (
              <div className="text-xs leading-relaxed text-gray-700">Why: {renderCitedLine(followUp.why)}</div>
            )}
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setState(idx, 'justSet')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white border border-[#B7791F]/60 rounded hover:bg-[#FFF1CC] transition-colors cursor-pointer ${DEJA_DUE.text}`}
              >
                <Plus className="w-3.5 h-3.5" />
                Set reminder
              </button>
              {pickerIdx === idx ? datePicker(idx) : <TextAction onClick={() => setPickerIdx(idx)}>Change date</TextAction>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const NewsletterView: React.FC<NewsletterViewProps> = ({
  onOpenEvidence,
  onDraftOutreach,
  onDraftSpecialistEmail,
  onOpenClientCrm,
  activeEvidenceId,
  dejaDueItems,
  onUpdateDejaDueDate,
}) => {
  const [auditTab, setAuditTab] = useState<'suppressed' | 'feed'>('suppressed');
  const [auditOpen, setAuditOpen] = useState(false);
  const [cardStatus, setCardStatus] = useState<Record<string, CardStatus>>({});
  const [teamExpanded, setTeamExpanded] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  // RM's own clicks on Déjà Due lines (front-end only) and dates picked for suggested follow-ups
  const [reminderOverride, setReminderOverride] = useState<Record<string, ReminderState>>({});
  const [suggestedTiming, setSuggestedTiming] = useState<Record<string, string>>({});

  const trackedById = new Map(dejaDueItems.map((item) => [item.id, item]));
  const originalById = new Map(DEJA_DUE_ITEMS.map((item) => [item.id, item]));
  const cameDueCount = WEEKLY_CLIENT_BRIEFS.filter((client) => client.card.cameDue).length;

  const setStatus = (clientId: string, status: CardStatus) =>
    setCardStatus((prev) => ({ ...prev, [clientId]: status }));

  const openAudit = () => {
    setAuditOpen(true);
    document.getElementById(AUDIT_SECTION_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderCitation = (cite: CitationRef, key: React.Key) => {
    const record = EVIDENCE_RECORDS[cite.evidenceId];
    const isCrm = record?.type === 'meeting-note';
    const isSelected = activeEvidenceId === cite.evidenceId;

    return (
      <span
        key={key}
        className={`${CHIP_BASE} ${isCrm ? CHIP_CRM : CHIP_PUBLIC} ml-1 align-[1px] ${isSelected ? (isCrm ? 'ring-1 ring-[#2B6CB0]' : 'ring-1 ring-gray-500') : ''
          }`}
      >
        <button
          type="button"
          onClick={() => onOpenEvidence(cite.evidenceId)}
          title={`Inspect source: ${cite.badge}`}
          className="inline-flex items-center gap-1 px-1.5 py-[3px] rounded-md hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
        >
          {isCrm ? <UserRound className="w-3 h-3 shrink-0" /> : <FileText className="w-3 h-3 shrink-0" />}
          <span>{cite.badge}</span>
        </button>
        {!isCrm && record?.externalUrl && (
          <a
            href={record.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={record.externalUrlLabel || 'Open real external source in new tab'}
            aria-label={`Open ${cite.badge} in new tab`}
            className="inline-flex items-center px-1 py-[3px] border-l border-gray-200 hover:text-gray-950"
          >
            <ArrowUpRight className="w-3 h-3" />
          </a>
        )}
      </span>
    );
  };

  const renderCitedLine: RenderCitedLine = (line) => (
    <>
      {line.text}
      {line.citations.map((cite, idx) => renderCitation(cite, idx))}
    </>
  );

  const renderTeamMember = (member: SpecialistColleague) => (
    <span key={member.name} className="whitespace-nowrap">
      <button
        type="button"
        onClick={() => onDraftSpecialistEmail(member)}
        title={`Email ${member.name} (${member.email})`}
        className="font-medium text-[#007348] underline underline-offset-2 decoration-[#00915A]/45 hover:decoration-[#007348] hover:bg-[#EDF7F2] rounded-sm px-0.5 -mx-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007348]"
      >
        {member.name}
      </button>{' '}
      <span className="text-gray-500">({member.role})</span>
    </span>
  );

  const renderCard = (client: ClientBriefItem, index: number) => {
    const { card } = client;
    const status = cardStatus[client.clientId] ?? 'open';
    const [leadSpecialist, ...moreSpecialists] = client.recommendedTeam;
    const showAllTeam = !!teamExpanded[client.clientId];
    const tooltipId = `private-side-${client.clientId}`;
    const isDejaDueTrigger = card.triggerTag === 'Trigger: Déjà Due + Market';
    const reminderKey = (idx: number) => `${client.clientId}:${idx}`;

    if (status !== 'open') {
      return (
        <article
          key={client.clientId}
          id={`client-brief-${client.clientId}`}
          className="scroll-mt-3 flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600"
        >
          <span>
            <span className="font-semibold text-gray-900">{client.clientName}</span>
            {' · '}
            {status === 'dismissed' ? 'Dismissed' : 'Snoozed until next week’s brief.'}
          </span>
          <button
            type="button"
            onClick={() => setStatus(client.clientId, 'open')}
            className="text-xs font-medium text-[#007348] hover:underline cursor-pointer"
          >
            Undo
          </button>
        </article>
      );
    }

    // Déjà Due line state: tracked in Frame 5 → set; otherwise suggested (State C)
    const stateFor = (idx: number): ReminderState => {
      const override = reminderOverride[reminderKey(idx)];
      if (override) return override;
      const itemId = card.dejaDueFollowUps[idx].dejaDueItemId;
      return itemId && trackedById.has(itemId) ? 'set' : 'suggested';
    };

    // Timing: show Frame 5's date once the RM has changed it (here or in Frame 5); otherwise the brief's wording
    const timingFor = (idx: number) => {
      const followUp = card.dejaDueFollowUps[idx];
      const tracked = followUp.dejaDueItemId ? trackedById.get(followUp.dejaDueItemId) : undefined;
      const original = followUp.dejaDueItemId ? originalById.get(followUp.dejaDueItemId) : undefined;
      if (tracked && original && tracked.dateValue !== original.dateValue) return tracked.triggerTiming;
      return suggestedTiming[reminderKey(idx)] ?? followUp.timing;
    };

    const onPickDate = (idx: number, iso: string) => {
      const itemId = card.dejaDueFollowUps[idx].dejaDueItemId;
      if (itemId && trackedById.has(itemId)) {
        onUpdateDejaDueDate(itemId, iso); // keeps Frame 5 in sync
      } else {
        setSuggestedTiming((prev) => ({ ...prev, [reminderKey(idx)]: formatPickedDate(iso) }));
      }
    };

    return (
      <article
        key={client.clientId}
        id={`client-brief-${client.clientId}`}
        className="scroll-mt-3 bg-white border border-gray-200 rounded-lg overflow-hidden"
      >
        {/* 1. Déjà Due State A: came-due banner (inside the card border, at the top) */}
        {card.cameDue && <DejaDueCameDueBanner lines={card.cameDue} renderCitedLine={renderCitedLine} />}

        <div className="px-5 sm:px-6 pt-4 pb-4">
          {/* 2. Header row (relative: anchors the private-side tooltip) */}
          <div className="relative flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <button
              type="button"
              onClick={() => onOpenClientCrm(client.clientId)}
              title="Open Client CRM"
              className="text-lg font-semibold text-gray-950 hover:text-[#007348] transition-colors text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007348] rounded-sm"
            >
              {client.clientName}
            </button>
            <span className="text-[11px] text-gray-400 tabular-nums">
              {index + 1} of {WEEKLY_CLIENT_BRIEFS.length}
            </span>
            <span className="text-xs text-gray-500">· {client.hq}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-[11px] font-semibold">
              <Calendar className="w-3 h-3 text-gray-500" />
              {card.timingBadge}
            </span>
            {isDejaDueTrigger ? (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#B7791F]/60 text-[11px] font-semibold ${DEJA_DUE.text}`}
              >
                <Bell className={`w-3 h-3 ${DEJA_DUE.accent}`} />
                {card.triggerTag}
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded border border-gray-300 text-gray-700 text-[11px] font-medium">
                {card.triggerTag}
              </span>
            )}
            {card.privateSideTooltip && (
              <span className="inline-flex group">
                <button
                  type="button"
                  aria-describedby={tooltipId}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-semibold cursor-help focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                >
                  <Lock className="w-3 h-3" />
                  Private-side
                </button>
                <span id={tooltipId} role="tooltip" className={TOOLTIP}>
                  {card.privateSideTooltip}
                </span>
              </span>
            )}
          </div>

          {/* 3. The move  ·  4. Angle line (Ternium only) */}
          <div className="mt-3">
            <BlockLabel>The move</BlockLabel>
            <p className="text-[15px] font-semibold text-gray-950 leading-snug">{card.theMove}</p>
            {card.angle && (
              <p className="mt-1 text-sm text-gray-700">
                <span className="font-semibold">Angle:</span> {card.angle}
              </p>
            )}
          </div>

          {/* 5. Why now | Ask */}
          <div className="mt-3.5 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-x-6 gap-y-3.5 text-[13px] leading-relaxed text-gray-700">
            <div>
              <BlockLabel>Why now</BlockLabel>
              <ul className="space-y-1.5 list-disc pl-5">
                {card.whyNow.map((line, idx) => (
                  <li key={idx}>{renderCitedLine(line)}</li>
                ))}
              </ul>
            </div>
            <div>
              <BlockLabel>Ask</BlockLabel>
              <ul className="space-y-1.5">
                {card.ask.map((question, idx) => (
                  <li key={idx} className="pl-3 border-l-2 border-gray-300 text-gray-900">
                    “{question}”
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 6. Yellow checklist: DNUT "Before you call", Southwest "Barrier check" */}
          {card.checklist && (
            <div className="mt-3.5 px-3 py-2 bg-yellow-50 border border-yellow-300 rounded text-xs text-yellow-950">
              <div className="flex items-center gap-1.5 font-semibold">
                {card.checklist.label === 'Barrier check' ? (
                  <Lock className="w-3.5 h-3.5 text-yellow-700 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
                )}
                {card.checklist.label}
              </div>
              <ul className="mt-1 space-y-1">
                {card.checklist.items.map((item, idx) => {
                  const key = `${client.clientId}:check:${idx}`;
                  return (
                    <li key={idx}>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!checked[key]}
                          onChange={(e) => setChecked((prev) => ({ ...prev, [key]: e.target.checked }))}
                          className="mt-0.5 w-3.5 h-3.5 accent-yellow-500 cursor-pointer shrink-0"
                        />
                        <span className={checked[key] ? 'line-through text-yellow-900/60' : ''}>
                          {renderCitedLine(item)}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* 7. Bring / Bring in / BNP role */}
          <dl className="mt-3.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-gray-700">
            <dt className="font-semibold text-gray-900">Bring</dt>
            <dd>{card.bring}</dd>

            <dt className="font-semibold text-gray-900">Bring in</dt>
            <dd className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              {leadSpecialist && renderTeamMember(leadSpecialist)}
              {moreSpecialists.length > 0 &&
                (showAllTeam ? (
                  <>
                    {moreSpecialists.map((member) => (
                      <React.Fragment key={member.name}>
                        <span className="text-gray-300">·</span>
                        {renderTeamMember(member)}
                      </React.Fragment>
                    ))}
                    <button
                      type="button"
                      onClick={() => setTeamExpanded((prev) => ({ ...prev, [client.clientId]: false }))}
                      className="text-gray-500 hover:text-gray-900 cursor-pointer"
                    >
                      Show less
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-gray-300">·</span>
                    <button
                      type="button"
                      onClick={() => setTeamExpanded((prev) => ({ ...prev, [client.clientId]: true }))}
                      aria-expanded={false}
                      className="font-medium text-gray-600 hover:text-[#007348] cursor-pointer"
                    >
                      +{moreSpecialists.length} more
                    </button>
                  </>
                ))}
            </dd>

            <dt className="font-semibold text-gray-900">BNP role</dt>
            <dd>{renderCitedLine(card.bnpRole)}</dd>
          </dl>

          {/* 8. Button row */}
          <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onDraftOutreach(client)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#00915A] rounded hover:bg-[#007348] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5" />
              Draft outreach
            </button>
            <button
              type="button"
              onClick={() => setStatus(client.clientId, 'snoozed')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <AlarmClock className="w-3.5 h-3.5" />
              Snooze
            </button>
            <button
              type="button"
              onClick={() => setStatus(client.clientId, 'dismissed')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" />
              Dismiss
            </button>
            <button
              type="button"
              onClick={() => onOpenClientCrm(client.clientId)}
              className="ml-auto inline-flex items-center gap-0.5 px-1 text-xs font-medium text-[#007348] hover:underline cursor-pointer whitespace-nowrap"
            >
              Client CRM
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 9. Déjà Due strip (always last) */}
        <DejaDueStrip
          followUps={card.dejaDueFollowUps}
          stateFor={stateFor}
          timingFor={timingFor}
          setState={(idx, state) => setReminderOverride((prev) => ({ ...prev, [reminderKey(idx)]: state }))}
          onPickDate={onPickDate}
          renderCitedLine={renderCitedLine}
        />
      </article>
    );
  };

  return (
    <div className="max-w-[920px] mx-auto bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      {/* C1. Header */}
      <header className="bg-[#007348] text-white px-5 sm:px-7 py-4">
        <h1 className="text-lg font-semibold leading-tight">This Week in a Changing World</h1>

        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#00915A] border border-white/25 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white" aria-hidden="true">
                <path d="M12 2.5l1.1 3.1 3.2.2-2.5 2 0.9 3.1L12 9.1 9.3 10.9l.9-3.1-2.5-2 3.2-.2L12 2.5zM6.5 11.5l.7 2 2.1.1-1.6 1.3.6 2-1.8-1.1-1.8 1.1.6-2-1.6-1.3 2.1-.1.7-2zM17.5 11.5l.7 2 2.1.1-1.6 1.3.6 2-1.8-1.1-1.8 1.1.6-2-1.6-1.3 2.1-.1.7-2zM12 15.2l.8 2.2 2.3.1-1.8 1.4.6 2.2-1.9-1.2-1.9 1.2.6-2.2-1.8-1.4 2.3-.1.8-2.2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-emerald-50">
              Rendez-Vous · BNP Paribas Client Intelligence
            </span>
          </div>
          <span className="text-xs tabular-nums">
            <span className="text-emerald-50">Nov 5 – Nov 12, 2026</span>
            <span className="text-white/60"> · Market data as of Nov 10, 2026</span>
          </span>
        </div>

        <div className="mt-1 text-xs text-emerald-100">
          To: {RM_PROFILE.name} · Mid-Cap Corporate Coverage
        </div>

        <div className="relative mt-3 pt-3 border-t border-white/15 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[13px]">
          <span className="font-semibold tabular-nums">11 triggers reviewed → 3 worth a call</span>
          <button
            type="button"
            onClick={openAudit}
            className="text-emerald-100 underline underline-offset-2 decoration-white/40 hover:text-white hover:decoration-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
          >
            View what was filtered →
          </button>
          <span className="text-white/40" aria-hidden="true">·</span>
          <span className="inline-flex group">
            <button
              type="button"
              aria-describedby="deja-due-header-tooltip"
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-semibold tabular-nums cursor-help focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${DEJA_DUE.bg} ${DEJA_DUE.border} ${DEJA_DUE.text}`}
            >
              <Bell className={`w-3.5 h-3.5 ${DEJA_DUE.accent}`} />
              {dejaDueItems.length} Déjà Due follow-ups tracked · {cameDueCount} came due this week
            </button>
            <span id="deja-due-header-tooltip" role="tooltip" className={TOOLTIP}>
              Follow-ups you chose to set. Rendez-Vous brings them back when they come due or when the market makes them urgent.
            </span>
          </span>
        </div>

        {/* Citation legend */}
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-white/70">
          <span className={`${CHIP_BASE} ${CHIP_PUBLIC} gap-1 px-1.5 py-[3px]`}>
            <FileText className="w-3 h-3" />
            Public source
          </span>
          <span className={`${CHIP_BASE} ${CHIP_CRM} gap-1 px-1.5 py-[3px]`}>
            <UserRound className="w-3 h-3" />
            Internal CRM note
          </span>
        </div>
      </header>

      {/* C2. Today's calls */}
      <div className="px-5 sm:px-7 py-4 bg-[#F8FAF9] border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 mb-2">Today’s calls</h2>
        <div className="border border-gray-200 rounded bg-white overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="py-2 px-3 font-medium">Client</th>
                <th className="py-2 px-3 font-medium">The move</th>
                <th className="py-2 px-3 font-medium">Call by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {WEEKLY_CLIENT_BRIEFS.map((client) => {
                const href = `#client-brief-${client.clientId}`;
                return (
                  <tr key={client.clientId} className="hover:bg-gray-50 transition-colors">
                    <td className="p-0">
                      <a
                        href={href}
                        className="flex items-center gap-1.5 py-2 px-3 font-semibold text-[#007348] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#007348]"
                      >
                        {client.card.cameDue && (
                          <Bell className={`w-3.5 h-3.5 shrink-0 ${DEJA_DUE.accent}`} aria-label="Déjà Due" />
                        )}
                        {client.clientName}
                      </a>
                    </td>
                    <td className="p-0">
                      <a href={href} tabIndex={-1} className="block py-2 px-3 text-gray-800">
                        {client.card.todaysCall.move}
                      </a>
                    </td>
                    <td className="p-0">
                      <a href={href} tabIndex={-1} className="block py-2 px-3 text-gray-700 whitespace-nowrap tabular-nums">
                        {client.card.todaysCall.callBy}
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-1.5 text-[11px] text-gray-500">
          Call-by dates leave time to act before the event or before prices move back.
        </p>
      </div>

      {/* C4/C5. Client cards: one template, separated */}
      <div className="px-4 sm:px-6 py-5 bg-[#F8FAF9] space-y-5">{WEEKLY_CLIENT_BRIEFS.map(renderCard)}</div>

      {/* Signal Filtering Audit (collapsible) */}
      <section id={AUDIT_SECTION_ID} className="px-5 sm:px-7 py-4 bg-white border-t border-gray-200 scroll-mt-2">
        <button
          type="button"
          onClick={() => setAuditOpen((open) => !open)}
          aria-expanded={auditOpen}
          aria-controls="signal-filtering-audit"
          className="w-full flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-left cursor-pointer rounded-sm group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007348]"
        >
          <span className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#00915A]" />
            <span className="text-sm font-semibold text-gray-900 group-hover:text-[#007348]">
              Signal Filtering Audit: Relevance Over Volume
            </span>
          </span>
          <span className="flex items-center gap-1.5 text-xs">
            <span className="text-[#007348] font-medium">{auditOpen ? 'Hide' : 'View'}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#007348] transition-transform ${auditOpen ? 'rotate-180' : ''}`}
            />
          </span>
        </button>

        {auditOpen && (
          <div id="signal-filtering-audit" className="mt-3">
            <div className="flex justify-end mb-3">
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded text-xs">
                <button
                  type="button"
                  onClick={() => setAuditTab('suppressed')}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${auditTab === 'suppressed'
                      ? 'bg-white text-gray-900 font-medium shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Suppressed This Week (8)
                </button>
                <button
                  type="button"
                  onClick={() => setAuditTab('feed')}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${auditTab === 'feed'
                      ? 'bg-white text-gray-900 font-medium shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Ingested Trigger Feed (11)
                </button>
              </div>
            </div>

            {auditTab === 'suppressed' ? (
              <div className="border border-gray-200 rounded overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                    <tr>
                      <th className="py-2 px-3 font-medium">Event</th>
                      <th className="py-2 px-3 font-medium">Client</th>
                      <th className="py-2 px-3 font-medium">Why Suppressed</th>
                      <th className="py-2 px-3 font-medium">Rule Applied</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    {SUPPRESSED_SIGNALS.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/70">
                        <td className="py-2 px-3 font-medium text-gray-900">{row.event}</td>
                        <td className="py-2 px-3 whitespace-nowrap">{row.client}</td>
                        <td className="py-2 px-3">{row.reason}</td>
                        <td className="py-2 px-3 font-mono text-[11px] text-[#007348] whitespace-nowrap">
                          {row.ruleApplied}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="border border-gray-200 rounded overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                    <tr>
                      <th className="py-2 px-3 font-medium">Date</th>
                      <th className="py-2 px-3 font-medium">Market / Policy Event</th>
                      <th className="py-2 px-3 font-medium">Matching Logic</th>
                      <th className="py-2 px-3 font-medium">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    {TRIGGER_FEED.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/70">
                        <td className="py-2 px-3 font-mono text-gray-500 whitespace-nowrap tabular-nums">
                          {row.date}
                        </td>
                        <td className="py-2 px-3 text-gray-900">
                          <span>{row.event}</span>
                          {row.surfacedClient && (
                            <span className="block text-[11px] font-medium text-[#007348] mt-0.5">
                              Matched → {row.surfacedClient}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3">{row.whoItHits}</td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          {row.externalUrl ? (
                            <a
                              href={row.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[#007348] hover:underline font-medium"
                            >
                              <span>{row.source}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-gray-500">{row.source}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Brief Footer */}
      <div className="px-5 sm:px-7 py-3.5 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <span>Rendez-Vous · BNP Paribas Corporate Coverage · Public Evidence & Internal CRM</span>
        <span>(INTERNAL) — Confidential Lender & Coverage Use Only</span>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  ArrowUpRight,
  Bell,
  Calendar,
  Check,
  Edit3,
  ExternalLink,
  FileText,
  Filter,
  Landmark,
  Lock,
  Newspaper,
  Send,
  UserCheck,
  Users,
} from 'lucide-react';
import {
  ClientBriefItem,
  DejaDueItem,
  EVIDENCE_RECORDS,
  InlineLinkSegment,
  RM_PROFILE,
  SUPPRESSED_SIGNALS,
  TRIGGER_FEED,
  WEEKLY_CLIENT_BRIEFS,
} from '../data/newsletterData';

interface NewsletterViewProps {
  onOpenEvidence: (evidenceId: string) => void;
  onDraftOutreach: (client: ClientBriefItem) => void;
  onOpenClientCrm: (clientId: string) => void;
  activeEvidenceId: string | null;
  dejaDueItems: DejaDueItem[];
  onUpdateDejaDueDate: (id: string, newDateIso: string) => void;
  editionLabel?: string;
}

const getSourceIcon = (evidenceId?: string) => {
  if (!evidenceId) return FileText;
  const record = EVIDENCE_RECORDS[evidenceId];
  if (!record) return FileText;
  switch (record.type) {
    case 'crm-facility':
      return Landmark;
    case 'meeting-note':
      return UserCheck;
    case 'public-filing':
      return FileText;
    case 'market-news':
      return Newspaper;
  }
};

export const NewsletterView: React.FC<NewsletterViewProps> = ({
  onOpenEvidence,
  onDraftOutreach,
  onOpenClientCrm,
  activeEvidenceId,
  dejaDueItems,
  onUpdateDejaDueDate,
  editionLabel = 'Thursday, Nov 12, 2026 · 07:30 AM',
}) => {
  const [auditTab, setAuditTab] = useState<'suppressed' | 'feed'>('suppressed');
  const [scheduledReminders, setScheduledReminders] = useState<Record<string, boolean>>({});
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [draftDateValue, setDraftDateValue] = useState<string>('');

  const toggleReminder = (id: string) => {
    setScheduledReminders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const startEditingDate = (item: DejaDueItem) => {
    setEditingDateId(item.id);
    setDraftDateValue(item.dateValue);
  };

  const saveEditedDate = (id: string) => {
    if (draftDateValue) {
      onUpdateDejaDueDate(id, draftDateValue);
    }
    setEditingDateId(null);
  };

  const renderSegments = (segments: InlineLinkSegment[]) => {
    return segments.map((seg, idx) => {
      if (seg.type === 'text') {
        return <React.Fragment key={idx}>{seg.content}</React.Fragment>;
      }
      const Icon = getSourceIcon(seg.evidenceId);
      const record = seg.evidenceId ? EVIDENCE_RECORDS[seg.evidenceId] : undefined;
      const isSelected = seg.evidenceId && activeEvidenceId === seg.evidenceId;

      return (
        <span key={idx} className="inline">
          <button
            type="button"
            onClick={() => seg.evidenceId && onOpenEvidence(seg.evidenceId)}
            title={`Inspect source: ${seg.sourceBadge || 'Evidence Record'}`}
            className={`inline text-left font-medium underline underline-offset-3 decoration-[1.5px] transition-colors cursor-pointer rounded px-0.5 -mx-0.5 ${isSelected
                ? 'bg-[#00915A]/15 text-[#007348] decoration-[#007348]'
                : 'text-[#007348] decoration-[#00915A]/45 hover:bg-[#EDF7F2] hover:decoration-[#00915A]'
              }`}
          >
            <span>{seg.content}</span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-mono text-[#00915A] no-underline align-baseline ml-1">
              <Icon className="w-3 h-3 inline shrink-0 translate-y-[1px]" />
              <span>[{seg.sourceBadge}]</span>
            </span>
          </button>
          {record?.externalUrl && (
            <a
              href={record.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={record.externalUrlLabel || 'Open real external source in new tab'}
              className="inline-flex items-center text-[#007348] hover:text-[#005E3A] ml-0.5 align-baseline"
            >
              <ExternalLink className="w-3 h-3 inline translate-y-[1px]" />
            </a>
          )}
        </span>
      );
    });
  };

  return (
    <div className="max-w-[840px] mx-auto bg-white border border-gray-200 rounded-md overflow-hidden">
      {/* Outlook Email Header Inside Reading Pane */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h1 className="text-lg font-semibold text-gray-900">
            (INTERNAL): This Week in a Changing World
          </h1>
          <span className="text-xs text-gray-500 tabular-nums">{editionLabel}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#007348] text-white font-semibold text-xs flex items-center justify-center shrink-0">
              RV
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 flex flex-wrap items-center gap-1.5">
                <span>Rendez-Vous</span>
                <span className="text-xs font-normal text-gray-500">
                  &lt;rendez-vous@bnpparibas.com&gt;
                </span>
              </div>
              <div className="text-xs text-gray-500 truncate">
                To: {RM_PROFILE.name} &lt;{RM_PROFILE.email}&gt; · Mid-Cap Corporate Coverage
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BNP Paribas Rendez-Vous Institutional Masthead */}
      <div className="bg-[#007348] text-white px-7 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#00915A] border border-white/25 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
                <path d="M12 2.5l1.1 3.1 3.2.2-2.5 2 0.9 3.1L12 9.1 9.3 10.9l.9-3.1-2.5-2 3.2-.2L12 2.5zM6.5 11.5l.7 2 2.1.1-1.6 1.3.6 2-1.8-1.1-1.8 1.1.6-2-1.6-1.3 2.1-.1.7-2zM17.5 11.5l.7 2 2.1.1-1.6 1.3.6 2-1.8-1.1-1.8 1.1.6-2-1.6-1.3 2.1-.1.7-2zM12 15.2l.8 2.2 2.3.1-1.8 1.4.6 2.2-1.9-1.2-1.9 1.2.6-2.2-1.8-1.4 2.3-.1.8-2.2z" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-medium tracking-wider uppercase text-emerald-100">
                BNP Paribas · Rendez-Vous Client Intelligence
              </div>
              <div className="text-lg font-semibold tracking-tight text-white">
                (INTERNAL): This Week in a Changing World
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-emerald-100">
            <div className="font-medium text-white">Nov 5 – Nov 12, 2026 Market Window</div>
            <div>3 Actionable Briefs · 8 Triggers Suppressed</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-emerald-100/80">Live Market Triggers Ingested</div>
            <div className="text-sm font-semibold text-white tabular-nums mt-0.5">
              11 Events → 3 Client Cards
            </div>
          </div>
          <div>
            <div className="text-emerald-100/80">Coverage Themes</div>
            <div className="text-sm font-medium text-white mt-0.5">
              Rates (DNUT) · FX/Trade (Ternium) · Oil (CCI)
            </div>
          </div>
          <div>
            <div className="text-emerald-100/80">Time-Triggered Queue</div>
            <div className="text-sm font-semibold text-white tabular-nums mt-0.5">
              {dejaDueItems.length} Déjà Due Follow-Ons Tracked
            </div>
          </div>
        </div>
      </div>

      {/* Priority Quick-Jump Index */}
      <div className="px-7 py-4 bg-[#F8FAF9] border-b border-gray-200">
        <div className="text-xs text-gray-600 mb-3">
          Click any <span className="text-[#007348] font-medium underline">underlined citation</span> to inspect its summary card, or click the <ExternalLink className="w-3 h-3 inline text-[#007348]" /> icon beside public filings and market triggers to pop out directly to the real external source.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {WEEKLY_CLIENT_BRIEFS.map((client) => (
            <a
              key={client.clientId}
              href={`#client-brief-${client.clientId}`}
              className="group block p-3 bg-white border border-gray-200 rounded hover:border-[#00915A] transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] text-gray-500 tabular-nums">
                <span className="font-semibold text-[#007348]">Client 0{client.rank}</span>
                <span>{client.tickerOrRegion}</span>
              </div>
              <div className="text-xs font-semibold text-gray-900 truncate mt-0.5 group-hover:text-[#007348]">
                {client.clientName}
              </div>
              <div className="text-[11px] text-gray-500 truncate mt-0.5">
                {client.storyTheme}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Prioritized Client Briefs */}
      <div className="divide-y divide-gray-200">
        {WEEKLY_CLIENT_BRIEFS.map((client) => (
          <section
            key={client.clientId}
            id={`client-brief-${client.clientId}`}
            className="px-7 py-6"
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-1">
                  <span className="font-mono font-semibold text-[#007348]">
                    0{client.rank}.
                  </span>
                  <span>{client.storyTheme}</span>
                  <span aria-hidden="true">·</span>
                  <span>{client.hq}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenClientCrm(client.clientId)}
                  className="text-lg font-semibold text-gray-900 hover:text-[#007348] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{client.clientName}</span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-xs text-gray-500">Recommended Timing</div>
                <div className="text-xs font-semibold text-[#007348] mt-0.5 flex items-center sm:justify-end gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{client.engageTiming}</span>
                </div>
              </div>
            </div>

            {/* Brief Headline */}
            <div className="bg-[#EDF7F2]/80 border border-[#00915A]/25 rounded px-4 py-3 mb-4">
              <div className="text-xs font-semibold text-[#007348] mb-0.5">
                Brief Headline · BNP Role: {client.bnpRoleSummary}
              </div>
              <p className="text-sm font-medium text-gray-900 leading-snug">
                {client.briefHeadline}
              </p>
            </div>

            {/* Public Evidence vs. Demo CRM Context */}
            <div className="space-y-3.5 text-[13.5px] leading-relaxed text-gray-700">
              <div>
                <div className="text-xs font-semibold text-gray-900 mb-1">
                  Public Evidence (BNP Relationship, Filings & Market Triggers)
                </div>
                <p>{renderSegments(client.publicEvidence)}</p>
              </div>

              <div className="bg-[#F9FAFB] border border-gray-200 rounded px-4 py-3">
                <div className="text-xs font-semibold text-gray-900 mb-1">
                  Demo CRM Context (Internal CRM Note)
                </div>
                <p>{renderSegments(client.syntheticCrmContext)}</p>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-900 mb-1.5">
                  Why Now
                </div>
                <ul className="space-y-1.5 list-disc pl-5">
                  {client.whyNowBullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{renderSegments(bullet)}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-900 mb-1.5">
                  Key Points to Hit
                </div>
                <ul className="space-y-1 list-disc pl-5 text-gray-800">
                  {client.keyPointsToHit.map((point, pIdx) => (
                    <li key={pIdx}>{point}</li>
                  ))}
                </ul>

                <div className="mt-3 pt-2.5 border-t border-gray-200 space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-gray-900">Relevant Solutions: </span>
                    <span className="text-gray-700">{client.productsAndSpecialists}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-gray-700">
                    <Users className="w-3.5 h-3.5 text-[#007348] shrink-0" />
                    <span className="font-semibold text-gray-900">Recommended BNP Team:</span>
                    {client.recommendedTeam.map((member, mIdx) => (
                      <React.Fragment key={member.name}>
                        <span>
                          <span className="font-medium text-[#007348]">{member.name}</span>{' '}
                          <span className="text-gray-500">({member.role})</span>
                        </span>
                        {mIdx < client.recommendedTeam.length - 1 && (
                          <span className="text-gray-300">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {(client.informationBarrierNotice || client.coverageNote) && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded px-3.5 py-2.5 text-xs text-amber-950 flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>{client.informationBarrierNotice || client.coverageNote}</span>
                </div>
              )}
            </div>

            {/* Sources & Actions */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-gray-500 mr-1">Sources:</span>
                {client.linkedEvidenceIds.map((evId) => {
                  const rec = EVIDENCE_RECORDS[evId];
                  if (!rec) return null;
                  const isActive = activeEvidenceId === evId;
                  return (
                    <div key={evId} className="inline-flex items-center">
                      <button
                        type="button"
                        onClick={() => onOpenEvidence(evId)}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs transition-colors cursor-pointer whitespace-nowrap border ${rec.externalUrl ? 'rounded-l border-r-0' : 'rounded'
                          } ${isActive
                            ? 'bg-[#00915A] text-white border-[#00915A]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#00915A] hover:text-[#007348]'
                          }`}
                      >
                        <span>{rec.sourceLabel}</span>
                      </button>
                      {rec.externalUrl && (
                        <a
                          href={rec.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={rec.externalUrlLabel || 'Open real external source in new tab'}
                          className="inline-flex items-center px-1.5 py-1 rounded-r border border-gray-200 bg-gray-50 text-[#007348] hover:bg-[#EDF7F2] hover:border-[#00915A] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenClientCrm(client.clientId)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Client CRM
                </button>
                <button
                  type="button"
                  onClick={() => onDraftOutreach(client)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#00915A] rounded hover:bg-[#007348] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Draft Outreach</span>
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Feature: Déjà Due: Possible Client Follow-ons Due (with Editable Date!) */}
      <section
        id="deja-due-section"
        className="px-7 py-6 bg-[#F8FAF9] border-t border-gray-200"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#007348]">
              Workflow 2 · Time & Event-Triggered Queue
            </div>
            <h2 className="text-base font-semibold text-gray-900">
              Déjà Due: Possible Client Follow-ons Due
            </h2>
          </div>
          <span className="text-xs text-gray-500">
            Click any date or &ldquo;Edit Date&rdquo; to adjust follow-on timing
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded divide-y divide-gray-200">
          {dejaDueItems.map((item) => {
            const isSet = !!scheduledReminders[item.id];
            const isEditing = editingDateId === item.id;

            return (
              <div
                key={item.id}
                className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 hover:bg-gray-50/70 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs mb-0.5">
                    {isEditing ? (
                      <span className="inline-flex items-center gap-1.5">
                        <input
                          type="date"
                          value={draftDateValue}
                          onChange={(e) => setDraftDateValue(e.target.value)}
                          className="border border-[#00915A] rounded px-1.5 py-0.5 text-xs font-mono text-gray-900 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => saveEditedDate(item.id)}
                          className="px-2 py-0.5 bg-[#007348] text-white rounded text-[11px] font-medium hover:bg-[#005E3A] cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingDateId(null)}
                          className="px-1.5 py-0.5 text-gray-500 hover:text-gray-900 text-[11px] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEditingDate(item)}
                        title="Click to change follow-on date"
                        className="inline-flex items-center gap-1 font-mono font-semibold text-[#007348] hover:underline tabular-nums cursor-pointer"
                      >
                        <span>{item.triggerTiming}</span>
                        <Edit3 className="w-3 h-3 text-gray-400" />
                      </button>
                    )}

                    <span className="text-gray-300">·</span>
                    <button
                      type="button"
                      onClick={() => onOpenClientCrm(item.clientId)}
                      className="font-semibold text-gray-900 hover:text-[#007348] cursor-pointer"
                    >
                      {item.clientName}
                    </button>
                    <span className="text-gray-300">·</span>
                    <span className="text-gray-500">{item.specialists}</span>
                  </div>
                  <div className="text-xs font-medium text-gray-800">{item.title}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{item.actionRequired}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEditingDate(item)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-gray-700 bg-white border border-gray-200 rounded hover:border-[#00915A] hover:text-[#007348] transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Edit Date</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenEvidence(item.evidenceId)}
                    className="px-2.5 py-1 text-xs text-gray-700 bg-white border border-gray-200 rounded hover:border-[#00915A] hover:text-[#007348] transition-colors cursor-pointer"
                  >
                    Source
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleReminder(item.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border transition-colors cursor-pointer ${isSet
                        ? 'bg-[#EDF7F2] text-[#007348] border-[#00915A]/40'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {isSet ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Reminder Set</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3 h-3" />
                        <span>Remind Me</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Relevance Over Volume: Suppressed Signals & Live Trigger Feed */}
      <section className="px-7 py-6 bg-white border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#00915A]" />
            <h2 className="text-sm font-semibold text-gray-900">
              Signal Filtering Audit: Relevance Over Volume
            </h2>
          </div>

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
      </section>

      {/* Brief Footer */}
      <div className="px-7 py-3.5 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <span>
          Rendez-Vous · BNP Paribas Corporate Coverage · Public Evidence & Internal CRM
        </span>
        <span>(INTERNAL) — Confidential Lender & Coverage Use Only</span>
      </div>
    </div>
  );
};

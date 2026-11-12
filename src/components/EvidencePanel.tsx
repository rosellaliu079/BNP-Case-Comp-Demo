import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  Landmark,
  Lock,
  Newspaper,
  Send,
  UserCheck,
  X,
} from 'lucide-react';
import {
  ClientBriefItem,
  EVIDENCE_RECORDS,
  EvidenceRecord,
  WEEKLY_CLIENT_BRIEFS,
} from '../data/newsletterData';

interface EvidencePanelProps {
  evidenceId: string;
  onClose: () => void;
  onSelectEvidence: (id: string) => void;
  onOpenClientCrm: (clientId: string) => void;
  onDraftOutreach: (client: ClientBriefItem) => void;
}

const ALL_EVIDENCE_IDS = Object.keys(EVIDENCE_RECORDS);

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  evidenceId,
  onClose,
  onSelectEvidence,
  onOpenClientCrm,
  onDraftOutreach,
}) => {
  const record: EvidenceRecord =
    EVIDENCE_RECORDS[evidenceId] || EVIDENCE_RECORDS['dnut-credit-facility'];

  const currentIndex = ALL_EVIDENCE_IDS.indexOf(record.id);
  const prevId =
    ALL_EVIDENCE_IDS[(currentIndex - 1 + ALL_EVIDENCE_IDS.length) % ALL_EVIDENCE_IDS.length];
  const nextId = ALL_EVIDENCE_IDS[(currentIndex + 1) % ALL_EVIDENCE_IDS.length];

  const matchingClientBrief = WEEKLY_CLIENT_BRIEFS.find(
    (c) => c.clientId === record.clientId
  );

  const typeMeta = (() => {
    switch (record.type) {
      case 'crm-facility':
        return { label: 'Lending Facility & Schedule', icon: Landmark };
      case 'meeting-note':
        return {
          label: record.isSyntheticCrm ? 'Internal CRM Note' : 'CRM Call Note',
          icon: UserCheck,
        };
      case 'public-filing':
        return { label: 'Public SEC / Financial Filing', icon: FileText };
      case 'market-news':
        return { label: 'Live Market / Policy Trigger', icon: Newspaper };
    }
  })();

  const TypeIcon = typeMeta.icon;

  return (
    <div className="bg-white flex flex-col h-full border border-gray-200/90 rounded-lg shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[#F8FAF9] border-b border-gray-200 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#007348]">
            <TypeIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{typeMeta.label}</span>
          </div>
          <div className="text-[11px] font-mono text-gray-500 truncate mt-0.5">
            {record.sourceLabel}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onSelectEvidence(prevId)}
            title="Previous linked record"
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200/70 rounded transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onSelectEvidence(nextId)}
            title="Next linked record"
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200/70 rounded transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close source view"
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200/70 rounded transition-colors cursor-pointer ml-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real External Pop-Out Bar for non-CRM public sources */}
      {record.externalUrl && (
        <div className="px-4 py-2.5 bg-[#EDF7F2] border-b border-[#00915A]/25 flex items-center justify-between gap-2">
          <span className="text-[11px] text-[#007348] font-medium truncate">
            Real External Public Source Available
          </span>
          <a
            href={record.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-[#007348] hover:bg-[#005E3A] rounded transition-colors whitespace-nowrap shrink-0"
          >
            <span>Open Live Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Scrollable Source Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-1">
            {record.clientName && (
              <>
                <button
                  type="button"
                  onClick={() => record.clientId && onOpenClientCrm(record.clientId)}
                  className="font-medium text-[#007348] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{record.clientName}</span>
                </button>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>{record.date}</span>
          </div>

          <h2 className="text-base font-semibold text-gray-900 leading-snug">
            {record.title}
          </h2>
          <div className="text-xs text-gray-500 mt-1">{record.authorOrPublisher}</div>
        </div>

        {/* Highlighted Excerpt */}
        <div className="bg-[#EDF7F2] border border-[#00915A]/25 rounded p-3.5">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[#007348] mb-1">
            Cited Signal in Rendez-Vous Brief
          </div>
          <p className="text-xs text-gray-800 leading-relaxed font-medium">
            {record.highlightedExcerpt}
          </p>
        </div>

        {/* Information Barrier or Synthetic Assumption Notice */}
        {record.informationBarrierNote && (
          <div className="bg-amber-50/70 border border-amber-200 rounded p-3 text-xs text-amber-950 flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <span>{record.informationBarrierNote}</span>
          </div>
        )}

        {/* Facility Details */}
        {record.type === 'crm-facility' && record.facilityDetails && (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded divide-y divide-gray-200 text-xs">
              <div className="grid grid-cols-3 px-3.5 py-2 bg-gray-50/70">
                <span className="text-gray-500">Facility ID</span>
                <span className="col-span-2 font-mono font-medium text-gray-900">
                  {record.facilityDetails.facilityCode}
                </span>
              </div>
              <div className="grid grid-cols-3 px-3.5 py-2">
                <span className="text-gray-500">Structure</span>
                <span className="col-span-2 text-gray-900 font-medium">
                  {record.facilityDetails.productType}
                </span>
              </div>
              <div className="grid grid-cols-3 px-3.5 py-2 bg-gray-50/70">
                <span className="text-gray-500">Commitment</span>
                <span className="col-span-2 font-mono font-semibold text-gray-900 tabular-nums">
                  {record.facilityDetails.principal}
                </span>
              </div>
              <div className="grid grid-cols-3 px-3.5 py-2">
                <span className="text-gray-500">Maturity</span>
                <span className="col-span-2 text-gray-900 tabular-nums">
                  {record.facilityDetails.maturityDate}
                </span>
              </div>
              <div className="grid grid-cols-3 px-3.5 py-2 bg-gray-50/70">
                <span className="text-gray-500">Pricing</span>
                <span className="col-span-2 font-mono text-gray-900">
                  {record.facilityDetails.currentPricing}
                </span>
              </div>
              <div className="grid grid-cols-3 px-3.5 py-2">
                <span className="text-gray-500">Covenants</span>
                <span className="col-span-2 text-gray-900 tabular-nums">
                  {record.facilityDetails.covenantLeverage}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Trigger & Maturity Schedule
              </h3>
              <div className="border border-gray-200 rounded divide-y divide-gray-200">
                {record.facilityDetails.timelineSteps.map((step, i) => (
                  <div
                    key={i}
                    className={`px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs ${
                      step.status === 'current' ? 'bg-[#EDF7F2]' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Calendar
                        className={`w-3.5 h-3.5 shrink-0 ${
                          step.status === 'current'
                            ? 'text-[#00915A]'
                            : step.status === 'warning'
                            ? 'text-amber-600'
                            : 'text-gray-400'
                        }`}
                      />
                      <span
                        className={`truncate ${
                          step.status === 'current'
                            ? 'font-semibold text-[#007348]'
                            : 'text-gray-800'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    <span className="font-mono text-gray-500 tabular-nums shrink-0 text-[11px]">
                      {step.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Public Filing Details */}
        {record.type === 'public-filing' && record.filingDetails && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
              {record.filingDetails.keyMetrics.map((m, i) => (
                <div key={i} className="border border-gray-200 rounded p-2.5 bg-gray-50/60">
                  <div className="text-[11px] text-gray-500">{m.label}</div>
                  <div className="text-sm font-mono font-semibold text-gray-900 tabular-nums mt-0.5">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-xs text-gray-700 leading-relaxed">
              <div className="font-semibold text-gray-900">
                {record.filingDetails.filingType} · {record.filingDetails.sourceCitation}
              </div>
              {record.filingDetails.excerpts.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        )}

        {/* Meeting Notes */}
        {record.type === 'meeting-note' && record.meetingDetails && (
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs space-y-1.5">
              <div>
                <span className="text-gray-500">Location: </span>
                <span className="font-medium text-gray-900">
                  {record.meetingDetails.location} ({record.meetingDetails.duration})
                </span>
              </div>
              <div>
                <span className="text-gray-500">Participants: </span>
                <span className="text-gray-800">
                  {record.meetingDetails.attendees.join(', ')}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1.5">
                CRM Call Notes
              </h3>
              <ul className="space-y-2 text-xs text-gray-700 leading-relaxed list-disc pl-4">
                {record.meetingDetails.fullNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1.5">
                RM Follow-Up Actions
              </h3>
              <div className="space-y-1.5">
                {record.meetingDetails.actionItems.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded px-3 py-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00915A] shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Market / News Details */}
        {record.type === 'market-news' && record.marketDetails && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
              {record.marketDetails.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded p-2.5 bg-gray-50/60"
                >
                  <div className="text-[11px] text-gray-500">{m.label}</div>
                  <div className="text-sm font-mono font-semibold text-gray-900 tabular-nums mt-0.5">
                    {m.value}
                  </div>
                  <div
                    className={`text-[11px] font-mono tabular-nums mt-0.5 ${
                      m.positive ? 'text-[#007348]' : 'text-amber-700'
                    }`}
                  >
                    {m.change}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 text-xs text-gray-700 leading-relaxed">
              <div className="font-semibold text-gray-900">
                {record.marketDetails.publication}
              </div>
              {record.marketDetails.articleParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        )}

        {/* Quick Evidence Switcher */}
        <div className="pt-3 border-t border-gray-200">
          <div className="text-[11px] font-medium text-gray-500 mb-2">
            Switch Linked Source
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ALL_EVIDENCE_IDS.map((id) => {
              const item = EVIDENCE_RECORDS[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelectEvidence(id)}
                  className={`px-2 py-1 text-[11px] rounded border transition-colors cursor-pointer ${
                    id === record.id
                      ? 'bg-[#00915A] text-white border-[#00915A]'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#00915A]'
                  }`}
                >
                  {item.sourceLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      {matchingClientBrief && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onOpenClientCrm(matchingClientBrief.clientId)}
            className="text-xs font-medium text-gray-700 hover:text-[#007348] transition-colors cursor-pointer truncate"
          >
            {matchingClientBrief.clientName} CRM
          </button>
          <button
            type="button"
            onClick={() => onDraftOutreach(matchingClientBrief)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#00915A] rounded hover:bg-[#007348] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Draft Outreach</span>
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Bell,
  Building2,
  Calendar,
  Check,
  Edit3,
  ExternalLink,
  Lock,
  Mail,
  Phone,
  Search,
  Send,
} from 'lucide-react';
import {
  CLIENT_DOSSIERS,
  ClientBriefItem,
  DejaDueItem,
  EVIDENCE_RECORDS,
  RM_PROFILE,
  WEEKLY_CLIENT_BRIEFS,
} from '../data/newsletterData';

interface CrmBookViewProps {
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
  onOpenEvidence: (evidenceId: string) => void;
  onDraftOutreach: (client: ClientBriefItem) => void;
  dejaDueItems: DejaDueItem[];
  onUpdateDejaDueDate: (id: string, newDateIso: string) => void;
}

export const CrmBookView: React.FC<CrmBookViewProps> = ({
  selectedClientId,
  onSelectClient,
  onOpenEvidence,
  onDraftOutreach,
  dejaDueItems,
  onUpdateDejaDueDate,
}) => {
  const [query, setQuery] = useState('');
  const [reminders, setReminders] = useState<Record<string, boolean>>({});
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [draftDateValue, setDraftDateValue] = useState<string>('');

  const filteredClients = CLIENT_DOSSIERS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.sector.toLowerCase().includes(query.toLowerCase()) ||
      c.hq.toLowerCase().includes(query.toLowerCase())
  );

  const activeDossier =
    CLIENT_DOSSIERS.find((c) => c.id === selectedClientId) || CLIENT_DOSSIERS[0];

  const matchingBrief = WEEKLY_CLIENT_BRIEFS.find(
    (b) => b.clientId === activeDossier.id
  );

  const clientDejaDue = dejaDueItems.filter(
    (item) => item.clientId === activeDossier.id
  );

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

  return (
    <div className="flex h-full bg-white border border-gray-200/90 rounded-lg shadow-2xs overflow-hidden">
      {/* Left Client Book Directory */}
      <div className="w-[320px] shrink-0 border-r border-gray-200 flex flex-col bg-[#FAFAFA]">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-900">
              CRM Corporate Book
            </h2>
            <span className="text-xs font-mono text-gray-500 tabular-nums">
              {RM_PROFILE.bookSize} Accounts
            </span>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter active demo clients..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-[#00915A]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
          {filteredClients.map((client, idx) => {
            const isSelected = client.id === activeDossier.id;
            return (
              <button
                key={client.id}
                type="button"
                onClick={() => onSelectClient(client.id)}
                className={`w-full text-left px-4 py-3.5 transition-colors cursor-pointer ${
                  isSelected ? 'bg-[#EDF7F2]' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-gray-500 tabular-nums mb-0.5">
                  <span className="font-mono font-semibold text-[#007348]">
                    Client 0{idx + 1}
                  </span>
                  <span>{client.marketCapOrSize}</span>
                </div>
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {client.name}
                </div>
                <div className="text-xs text-gray-500 truncate mt-0.5">
                  {client.bnpDocumentedRole}
                </div>
              </button>
            );
          })}
          <div className="px-4 py-4 text-xs text-gray-500 leading-relaxed">
            Showing the 3 clients surfaced in this week’s <span className="font-medium text-gray-700">Rendez-Vous</span> brief out of 11 ingested market triggers.
          </div>
        </div>
      </div>

      {/* Right Client 360° Dossier + Déjà Due Follow-Ons */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[800px] space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <Building2 className="w-3.5 h-3.5 text-[#00915A]" />
                <span>CRM Client 360° Dossier</span>
                <span>·</span>
                <span>{activeDossier.hq}</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                {activeDossier.name}
              </h1>
              <div className="text-xs text-gray-600 mt-0.5">
                {activeDossier.sector} · {activeDossier.bnpDocumentedRole}
              </div>
            </div>

            {matchingBrief && (
              <button
                type="button"
                onClick={() => onDraftOutreach(matchingBrief)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#007348] rounded hover:bg-[#005E3A] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Draft Pitch Email</span>
              </button>
            )}
          </div>

          {activeDossier.informationBarrierNotice && (
            <div className="bg-amber-50/70 border border-amber-200 rounded px-3.5 py-2.5 text-xs text-amber-950 flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span>{activeDossier.informationBarrierNotice}</span>
            </div>
          )}

          {/* Financial & Role Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="border border-gray-200 rounded p-3">
              <div className="text-xs text-gray-500">Scale / Facility Size</div>
              <div className="text-sm font-mono font-semibold text-gray-900 tabular-nums mt-0.5">
                {activeDossier.marketCapOrSize}
              </div>
            </div>
            <div className="border border-gray-200 rounded p-3">
              <div className="text-xs text-gray-500">Leverage / Structure</div>
              <div className="text-sm font-semibold text-gray-900 tabular-nums mt-0.5">
                {activeDossier.netLeverage}
              </div>
            </div>
            <div className="border border-gray-200 rounded p-3">
              <div className="text-xs text-gray-500">Recommended BNP Team</div>
              <div className="text-xs font-medium text-gray-800 mt-1 space-y-0.5">
                {activeDossier.recommendedTeam.map((m) => (
                  <div key={m.name}>
                    <span className="text-[#007348] font-semibold">{m.name}</span>{' '}
                    <span className="text-gray-500">({m.role})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Opportunity */}
          <div className="bg-[#EDF7F2] border border-[#00915A]/25 rounded p-4">
            <div className="text-xs font-semibold text-[#007348]">
              Actionable Opportunity This Week
            </div>
            <div className="text-sm font-semibold text-gray-900 mt-0.5">
              {activeDossier.openOpportunity}
            </div>
            <div className="text-xs text-gray-600 mt-1">{activeDossier.keyFinancials}</div>
          </div>

          {/* Documented BNP Paribas Facilities */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">
              Documented BNP Paribas Lending Facilities
            </h3>
            <div className="border border-gray-200 rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                  <tr>
                    <th className="py-2 px-3.5 font-medium">Facility</th>
                    <th className="py-2 px-3.5 font-medium">Role / Product</th>
                    <th className="py-2 px-3.5 font-medium text-right">Amount</th>
                    <th className="py-2 px-3.5 font-medium">Maturity / Cadence</th>
                    <th className="py-2 px-3.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-800">
                  {activeDossier.activeFacilities.map((fac) => (
                    <tr key={fac.code} className="hover:bg-gray-50/70">
                      <td className="py-2.5 px-3.5 font-mono font-medium text-[#007348]">
                        {fac.code}
                      </td>
                      <td className="py-2.5 px-3.5 font-medium">{fac.type}</td>
                      <td className="py-2.5 px-3.5 font-mono text-right tabular-nums">
                        {fac.amount}
                      </td>
                      <td className="py-2.5 px-3.5 tabular-nums">{fac.maturity}</td>
                      <td className="py-2.5 px-3.5 font-medium text-gray-900">{fac.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Déjà Due: Client-Specific Follow-Ons with Editable Date */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">
              Déjà Due: Possible Client Follow-ons Due
            </h3>
            <div className="border border-gray-200 rounded divide-y divide-gray-200">
              {clientDejaDue.map((item) => {
                const isSet = !!reminders[item.id];
                const isEditing = editingDateId === item.id;
                return (
                  <div
                    key={item.id}
                    className="px-4 py-3 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="inline-flex items-center gap-1.5 mb-1">
                          <input
                            type="date"
                            value={draftDateValue}
                            onChange={(e) => setDraftDateValue(e.target.value)}
                            className="border border-[#00915A] rounded px-1.5 py-0.5 text-xs font-mono text-gray-900 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => saveEditedDate(item.id)}
                            className="px-2 py-0.5 bg-[#007348] text-white rounded text-[11px] font-medium cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingDateId(null)}
                            className="px-1.5 py-0.5 text-gray-500 text-[11px] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEditingDate(item)}
                          className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#007348] hover:underline cursor-pointer"
                        >
                          <span>{item.triggerTiming} · {item.triggerType}</span>
                          <Edit3 className="w-3 h-3 text-gray-400" />
                        </button>
                      )}
                      <div className="text-xs font-semibold text-gray-900 mt-0.5">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {item.actionRequired}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditingDate(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-gray-700 bg-white border border-gray-200 rounded hover:border-[#00915A] cursor-pointer"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Edit Date</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setReminders((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                        }
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border cursor-pointer ${
                          isSet
                            ? 'bg-[#EDF7F2] text-[#007348] border-[#00915A]/40'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {isSet ? <Check className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
                        <span>{isSet ? 'Scheduled' : 'Set Reminder'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact & Linked Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded p-4">
              <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Primary Client Contact
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {activeDossier.primaryContact.name}
              </div>
              <div className="text-xs text-gray-500 mb-3">
                {activeDossier.primaryContact.role}
              </div>
              <div className="space-y-1.5 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{activeDossier.primaryContact.email}</span>
                </div>
                <div className="flex items-center gap-2 font-mono tabular-nums">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{activeDossier.primaryContact.phone}</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded p-4">
              <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Linked Filings, CRM Notes & Triggers
              </div>
              <div className="space-y-2">
                {activeDossier.recentEvidenceIds.map((evId) => {
                  const ev = EVIDENCE_RECORDS[evId];
                  if (!ev) return null;
                  return (
                    <div
                      key={evId}
                      className="px-3 py-2 rounded border border-gray-200 hover:border-[#00915A] hover:bg-[#EDF7F2]/50 transition-colors flex items-center justify-between gap-2"
                    >
                      <button
                        type="button"
                        onClick={() => onOpenEvidence(evId)}
                        className="min-w-0 flex-1 text-left cursor-pointer"
                      >
                        <div className="text-xs font-medium text-gray-900 truncate">
                          {ev.title}
                        </div>
                        <div className="text-[11px] text-gray-500">{ev.sourceLabel}</div>
                      </button>
                      {ev.externalUrl && (
                        <a
                          href={ev.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={ev.externalUrlLabel || 'Open real source'}
                          className="text-[#007348] hover:text-[#005E3A] shrink-0 p-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

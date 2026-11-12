import React, { useEffect, useRef, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { CLIENT_DOSSIERS } from '../data/newsletterData';

export interface NewDejaDueInput {
  clientId: string;
  clientName: string;
  followOnType: string;
  dateIso: string;
  note: string;
}

interface NewDejaDueModalProps {
  onClose: () => void;
  onSave: (input: NewDejaDueInput) => void;
}

// Follow-on types mirror the products already recommended in the brief ("Bring" lines).
const FOLLOW_ON_TYPES = [
  'Refinancing / amend-and-extend',
  'Working capital',
  'Trade finance',
  'FX or rate hedging',
  'Other',
];

// Demo "today" (the brief is dated Thu, Nov 12, 2026)
const DEMO_TODAY_ISO = '2026-11-12';

export const NewDejaDueModal: React.FC<NewDejaDueModalProps> = ({ onClose, onSave }) => {
  const [clientId, setClientId] = useState(CLIENT_DOSSIERS[0]?.id ?? '');
  const [followOnType, setFollowOnType] = useState(FOLLOW_ON_TYPES[0]);
  const [otherType, setOtherType] = useState('');
  const [dateIso, setDateIso] = useState('');
  const [note, setNote] = useState('');
  const firstFieldRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const resolvedType = followOnType === 'Other' ? otherType.trim() : followOnType;
  const canSave = !!clientId && !!resolvedType && !!dateIso;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    const client = CLIENT_DOSSIERS.find((c) => c.id === clientId);
    onSave({
      clientId,
      clientName: client?.name ?? clientId,
      followOnType: resolvedType,
      dateIso,
      note: note.trim(),
    });
  };

  const fieldClass =
    'w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00915A] focus:ring-1 focus:ring-[#00915A]';
  const labelClass = 'block text-xs font-semibold text-gray-700 mb-1';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-deja-due-title"
        className="w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h2 id="new-deja-due-title" className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Bell className="w-4 h-4 text-[#007348]" />
            New Déjà Due reminder
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3.5">
          <p className="text-xs text-gray-500">
            Pick a client and a future follow-on. Rendez-Vous brings it back on that date. Nothing is sent to the client.
          </p>

          <div>
            <label htmlFor="dd-client" className={labelClass}>Client</label>
            <select
              id="dd-client"
              ref={firstFieldRef}
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className={fieldClass}
            >
              {CLIENT_DOSSIERS.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dd-type" className={labelClass}>Follow-on type</label>
            <select
              id="dd-type"
              value={followOnType}
              onChange={(e) => setFollowOnType(e.target.value)}
              className={fieldClass}
            >
              {FOLLOW_ON_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {followOnType === 'Other' && (
              <input
                type="text"
                value={otherType}
                onChange={(e) => setOtherType(e.target.value)}
                placeholder="e.g. Equipment leasing"
                aria-label="Describe the follow-on"
                className={`${fieldClass} mt-2`}
              />
            )}
          </div>

          <div>
            <label htmlFor="dd-date" className={labelClass}>Remind me on</label>
            <input
              id="dd-date"
              type="date"
              min={DEMO_TODAY_ISO}
              value={dateIso}
              onChange={(e) => setDateIso(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="dd-note" className={labelClass}>
              Note <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              id="dd-note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What to raise when this comes back"
              className={`${fieldClass} resize-none`}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 bg-gray-50 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSave}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#00915A] rounded hover:bg-[#007348] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Set reminder
          </button>
        </div>
      </form>
    </div>
  );
};

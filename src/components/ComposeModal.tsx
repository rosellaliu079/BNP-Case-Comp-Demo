import React, { useState, useEffect } from 'react';
import { ChevronDown, Paperclip, Send, Trash2 } from 'lucide-react';
import { RM_PROFILE } from '../data/newsletterData';

interface ComposeModalProps {
  initialTo: string;
  initialSubject: string;
  initialBody: string;
  clientName?: string;
  onClose: () => void;
  onSend: (payload: { to: string; subject: string; body: string }) => void;
}

export const ComposeModal: React.FC<ComposeModalProps> = ({
  initialTo,
  initialSubject,
  initialBody,
  clientName,
  onClose,
  onSend,
}) => {
  const [to, setTo] = useState(initialTo);
  const [cc, setCc] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [attachDeck, setAttachDeck] = useState(true);

  useEffect(() => {
    setTo(initialTo);
    setSubject(initialSubject);
    setBody(initialBody);
  }, [initialTo, initialSubject, initialBody]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim() || !subject.trim()) return;
    onSend({ to, subject, body });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-full bg-white border border-gray-200/90 rounded-lg shadow-2xs flex flex-col overflow-hidden"
    >
      {/* Top Compose Action Bar matching New Outlook */}
      <div className="px-5 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center rounded overflow-hidden">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#007348] hover:bg-[#005E3A] transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
            <button
              type="submit"
              className="px-1.5 py-1.5 text-white bg-[#007348] hover:bg-[#005E3A] border-l border-white/25 transition-colors cursor-pointer"
              title="Send options"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-xs text-gray-600 flex items-center gap-1">
            <span>From:</span>
            <span className="font-medium text-gray-900">{RM_PROFILE.email}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {clientName && (
            <span className="text-xs text-[#007348] font-medium">
              Draft for {clientName}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            title="Discard draft"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-600 hover:text-red-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Discard</span>
          </button>
        </div>
      </div>

      {/* Recipient & Subject Rows */}
      <div className="divide-y divide-gray-200 text-sm px-5">
        <div className="py-2.5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {}}
            className="px-3 py-1 text-xs font-medium text-gray-700 border border-gray-300 rounded bg-white hover:bg-gray-50 shrink-0"
          >
            To
          </button>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            className="flex-1 text-sm text-gray-900 focus:outline-none"
            placeholder="Enter recipient email"
          />
          <div className="flex items-center gap-2 text-xs text-gray-500 shrink-0">
            <button
              type="button"
              onClick={() => setShowCc(!showCc)}
              className="hover:text-gray-900 cursor-pointer"
            >
              Cc
            </button>
            <span>Bcc</span>
          </div>
        </div>

        {showCc && (
          <div className="py-2.5 flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-medium text-gray-500 border border-gray-200 rounded bg-gray-50 shrink-0">
              Cc
            </span>
            <input
              type="text"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              className="flex-1 text-sm text-gray-900 focus:outline-none"
              placeholder="rates-sales@bnpparibas.com, lcm@bnpparibas.com"
            />
          </div>
        )}

        <div className="py-2.5 flex items-center justify-between gap-3">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="flex-1 text-sm font-medium text-gray-900 focus:outline-none placeholder:text-gray-400"
            placeholder="Add a subject"
          />
          <span className="text-[11px] text-gray-400 shrink-0 tabular-nums">
            Draft saved at 11:00 AM
          </span>
        </div>
      </div>

      {/* Attachment & Specialist Ribbon */}
      <div className="px-5 py-2 bg-[#FAFAFA] border-y border-gray-200 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setAttachDeck(!attachDeck)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
            attachDeck
              ? 'bg-[#EDF7F2] text-[#007348] border-[#00915A]/30 font-medium'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Paperclip className="w-3.5 h-3.5" />
          <span>
            {attachDeck
              ? 'Attached: BNP_Rates_&_Refinancing_Grid.pdf'
              : 'Attach specialist grid'}
          </span>
        </button>

        <span className="text-[11px] text-gray-500 tabular-nums">
          {body.length} / 2000
        </span>
      </div>

      {/* Editable Email Body */}
      <div className="flex-1 p-5 overflow-y-auto">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full h-full min-h-[280px] text-sm text-gray-800 leading-relaxed resize-none focus:outline-none"
          placeholder="Write your outreach email..."
        />
      </div>
    </form>
  );
};

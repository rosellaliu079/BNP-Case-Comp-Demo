import React from 'react';
import { Inbox, MailOpen, FileSearch, Send, Building2 } from 'lucide-react';

export type PrototypeFrameId =
  | 'inbox'
  | 'newsletter'
  | 'evidence'
  | 'compose'
  | 'crm';

interface PrototypeFrameBarProps {
  activeFrame: PrototypeFrameId;
  onSelectFrame: (frame: PrototypeFrameId) => void;
  activeEvidenceLabel?: string;
}

const FRAMES: {
  id: PrototypeFrameId;
  step: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'inbox', step: 'Frame 1', label: 'Outlook Inbox', icon: Inbox },
  { id: 'newsletter', step: 'Frame 2', label: 'Rendez-Vous Brief', icon: MailOpen },
  { id: 'evidence', step: 'Frame 3', label: 'CRM / News Link View', icon: FileSearch },
  { id: 'compose', step: 'Frame 4', label: 'Outlook Compose', icon: Send },
  { id: 'crm', step: 'Frame 5', label: 'CRM & Déjà Due', icon: Building2 },
];

export const PrototypeFrameBar: React.FC<PrototypeFrameBarProps> = ({
  activeFrame,
  onSelectFrame,
  activeEvidenceLabel,
}) => {
  return (
    <div className="bg-[#111827] text-white px-4 py-1.5 flex items-center justify-between gap-4 border-b border-gray-800 text-xs overflow-x-auto shrink-0">
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-semibold tracking-tight text-white whitespace-nowrap">
          Prototype Frames
        </span>
        <span className="text-gray-500 hidden md:inline">·</span>
        <span className="text-gray-400 hidden md:inline whitespace-nowrap">
          Navigate inside Outlook or jump directly
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {FRAMES.map((frame) => {
          const Icon = frame.icon;
          const isActive = activeFrame === frame.id;
          return (
            <button
              key={frame.id}
              type="button"
              onClick={() => onSelectFrame(frame.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#00915A] text-white font-medium'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="text-gray-300/80 font-mono text-[11px]">{frame.step}:</span>
              <span>{frame.label}</span>
            </button>
          );
        })}
      </div>

      {activeEvidenceLabel ? (
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-emerald-300 whitespace-nowrap shrink-0">
          <span>Active Link:</span>
          <span className="font-medium text-white truncate max-w-[190px]">
            {activeEvidenceLabel}
          </span>
        </div>
      ) : (
        <div className="hidden xl:block text-[11px] text-gray-400 whitespace-nowrap shrink-0">
          Rendez-Vous · Nov 12, 2026
        </div>
      )}
    </div>
  );
};

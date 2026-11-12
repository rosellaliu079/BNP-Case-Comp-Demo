import React, { useMemo, useState } from 'react';
import {
  Archive,
  Bell,
  Calendar,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Clock,
  FileSearch,
  Flag,
  FolderOpen,
  Forward,
  Inbox,
  Mail,
  MailOpen,
  Menu,
  Newspaper,
  Paperclip,
  Pin,
  Reply,
  ReplyAll,
  Search,
  Send,
  ShieldAlert,
  Star,
  Tag,
  Trash2,
  Users,
  Zap,
} from 'lucide-react';
import {
  ClientBriefItem,
  DEJA_DUE_ITEMS,
  DejaDueItem,
  EVIDENCE_RECORDS,
  INITIAL_EMAILS,
  OutlookEmail,
  RM_PROFILE,
  WEEKLY_CLIENT_BRIEFS,
} from './data/newsletterData';
import { PrototypeFrameBar, PrototypeFrameId } from './components/PrototypeFrameBar';
import { NewsletterView } from './components/NewsletterView';
import { EvidencePanel } from './components/EvidencePanel';
import { ComposeModal } from './components/ComposeModal';
import { CrmBookView } from './components/CrmBookView';

type MailFolder = 'inbox' | 'briefs' | 'flagged' | 'sent' | 'archive';

export default function App() {
  const [emails, setEmails] = useState<OutlookEmail[]>(INITIAL_EMAILS);
  const [activeFolder, setActiveFolder] = useState<MailFolder>('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string>('email-weekly-brief');
  const [focusedTab, setFocusedTab] = useState<'focused' | 'other'>('focused');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [topTab, setTopTab] = useState<'home' | 'view' | 'help'>('home');
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [accountOpen, setAccountOpen] = useState(true);
  const [todayOpen, setTodayOpen] = useState(true);
  const [yesterdayOpen, setYesterdayOpen] = useState(true);

  const [mainSection, setMainSection] = useState<'mail' | 'crm'>('mail');
  const [selectedClientId, setSelectedClientId] = useState<string>('krispy-kreme');
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);
  const [lastEvidenceId, setLastEvidenceId] = useState<string>('dnut-credit-facility');

  const [composeState, setComposeState] = useState<{
    open: boolean;
    to: string;
    subject: string;
    body: string;
    clientName?: string;
  } | null>(null);

  const [dejaDueItems, setDejaDueItems] = useState<DejaDueItem[]>(DEJA_DUE_ITEMS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleUpdateDejaDueDate = (id: string, newDateIso: string) => {
    const parsed = new Date(`${newDateIso}T12:00:00`);
    const formatted = Number.isNaN(parsed.getTime())
      ? newDateIso
      : parsed.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

    setDejaDueItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, dateValue: newDateIso, triggerTiming: formatted }
          : item
      )
    );
    showToast(`Updated Déjà Due follow-on date to ${formatted}.`);
  };

  const selectedEmail = useMemo(
    () => emails.find((e) => e.id === selectedEmailId) || emails[0],
    [emails, selectedEmailId]
  );

  const currentFrame: PrototypeFrameId = useMemo(() => {
    if (mainSection === 'crm') return 'crm';
    if (composeState?.open) return 'compose';
    if (activeEvidenceId) return 'evidence';
    if (selectedEmail?.isNewsletter) return 'newsletter';
    return 'inbox';
  }, [mainSection, composeState, activeEvidenceId, selectedEmail]);

  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      const folderMatch =
        activeFolder === 'flagged'
          ? email.isFlagged
          : activeFolder === 'briefs'
          ? email.isNewsletter
          : email.folder === activeFolder;

      if (!folderMatch) return false;
      if (focusedTab === 'other' && email.isFocused) return false;
      if (focusedTab === 'focused' && !email.isFocused) return false;
      if (onlyUnread && !email.isUnread) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          email.subject.toLowerCase().includes(q) ||
          email.senderName.toLowerCase().includes(q) ||
          email.preview.toLowerCase().includes(q) ||
          (email.clientTag && email.clientTag.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [emails, activeFolder, focusedTab, onlyUnread, searchQuery]);

  const todayEmails = filteredEmails.filter((e) => e.group === 'Today');
  const yesterdayEmails = filteredEmails.filter((e) => e.group === 'Yesterday');

  const unreadInboxCount = useMemo(
    () => emails.filter((e) => e.folder === 'inbox' && e.isUnread).length,
    [emails]
  );

  const handleSelectEmail = (emailId: string) => {
    setMainSection('mail');
    setComposeState(null);
    setSelectedEmailId(emailId);
    setActiveEvidenceId(null);
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, isUnread: false } : e))
    );
  };

  const handleToggleFlag = (emailId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEmails((prev) =>
      prev.map((em) => (em.id === emailId ? { ...em, isFlagged: !em.isFlagged } : em))
    );
  };

  const handleTogglePin = (emailId: string) => {
    setEmails((prev) =>
      prev.map((em) => (em.id === emailId ? { ...em, isPinned: !em.isPinned } : em))
    );
  };

  const handleToggleRead = (emailId: string) => {
    setEmails((prev) =>
      prev.map((em) => (em.id === emailId ? { ...em, isUnread: !em.isUnread } : em))
    );
  };

  const handleArchiveEmail = (emailId: string) => {
    setEmails((prev) =>
      prev.map((em) => (em.id === emailId ? { ...em, folder: 'archive' } : em))
    );
    showToast('Moved message to Archive.');
  };

  const handleOpenEvidence = (evidenceId: string) => {
    setMainSection('mail');
    setComposeState(null);
    if (!selectedEmail?.isNewsletter) {
      setSelectedEmailId('email-weekly-brief');
    }
    setActiveEvidenceId(evidenceId);
    setLastEvidenceId(evidenceId);
  };

  const handleDraftOutreach = (client: ClientBriefItem) => {
    setMainSection('mail');
    setActiveEvidenceId(null);
    setComposeState({
      open: true,
      to: client.keyContact.email,
      subject: client.draftEmail.subject,
      body: client.draftEmail.body,
      clientName: client.clientName,
    });
  };

  const handleOpenClientCrm = (clientId: string) => {
    setSelectedClientId(clientId);
    setMainSection('crm');
    setComposeState(null);
  };

  const handleSendEmail = ({
    to,
    subject,
    body,
  }: {
    to: string;
    subject: string;
    body: string;
  }) => {
    const newSent: OutlookEmail = {
      id: `sent-${Date.now()}`,
      folder: 'sent',
      group: 'Today',
      isUnread: false,
      isFlagged: false,
      isFocused: true,
      senderName: RM_PROFILE.name,
      senderInitials: 'SL',
      senderEmail: RM_PROFILE.email,
      subject,
      preview: body.slice(0, 95).replace(/\n/g, ' ') + '...',
      timestamp: 'Just now',
      dateLabel: 'Thu, Nov 12, 2026 · Just now',
      hasAttachment: true,
      bodyParagraphs: body.split('\n\n'),
      clientTag: composeState?.clientName || to,
    };

    setEmails((prev) => [newSent, ...prev]);
    setComposeState(null);
    showToast(`Sent email to ${to} and archived in Sent Items.`);
  };

  const handleSelectPrototypeFrame = (frame: PrototypeFrameId) => {
    switch (frame) {
      case 'inbox':
        setMainSection('mail');
        setActiveFolder('inbox');
        setComposeState(null);
        setActiveEvidenceId(null);
        setSelectedEmailId('email-dnut-treasury');
        break;
      case 'newsletter':
        setMainSection('mail');
        setActiveFolder('inbox');
        setComposeState(null);
        setActiveEvidenceId(null);
        setSelectedEmailId('email-weekly-brief');
        setEmails((prev) =>
          prev.map((e) =>
            e.id === 'email-weekly-brief' ? { ...e, isUnread: false } : e
          )
        );
        break;
      case 'evidence':
        setMainSection('mail');
        setActiveFolder('inbox');
        setComposeState(null);
        setSelectedEmailId('email-weekly-brief');
        setActiveEvidenceId(lastEvidenceId || 'dnut-credit-facility');
        break;
      case 'compose':
        setMainSection('mail');
        setActiveFolder('inbox');
        handleDraftOutreach(WEEKLY_CLIENT_BRIEFS[0]);
        break;
      case 'crm':
        setComposeState(null);
        setMainSection('crm');
        break;
    }
  };

  const jumpToDejaDue = () => {
    handleSelectPrototypeFrame('newsletter');
    window.setTimeout(() => {
      document.getElementById('deja-due-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const renderEmailRow = (email: OutlookEmail) => {
    const isSelected = email.id === selectedEmailId && !composeState?.open;
    return (
      <div
        key={email.id}
        onClick={() => handleSelectEmail(email.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelectEmail(email.id);
          }
        }}
        className={`relative px-3.5 py-2.5 cursor-pointer transition-colors border-b border-gray-100 ${
          isSelected ? 'bg-[#EDF7F2]' : 'bg-white hover:bg-[#F7F9F8]'
        }`}
      >
        {email.isUnread && (
          <span
            className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00915A]"
            aria-label="Unread"
          />
        )}

        <div className="flex items-start gap-2.5">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5 ${
              email.isNewsletter
                ? 'bg-[#007348] text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {email.senderInitials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-xs truncate ${
                  email.isUnread
                    ? 'font-semibold text-gray-900'
                    : 'font-medium text-gray-800'
                }`}
              >
                {email.senderName}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {email.isPinned && (
                  <Pin className="w-3 h-3 text-[#007348] rotate-45" />
                )}
                <span className="text-[11px] text-gray-500 tabular-nums">
                  {email.timestamp}
                </span>
              </div>
            </div>

            <div
              className={`text-xs truncate mt-0.5 ${
                email.isUnread
                  ? 'font-semibold text-[#007348]'
                  : 'font-medium text-gray-900'
              }`}
            >
              {email.subject}
            </div>

            <div className="text-[11px] text-gray-500 truncate mt-0.5">
              {email.preview}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#F3F4F6] text-[#111827]">
      {/* Prototype Navigation Bar */}
      <PrototypeFrameBar
        activeFrame={currentFrame}
        onSelectFrame={handleSelectPrototypeFrame}
        activeEvidenceLabel={
          activeEvidenceId ? EVIDENCE_RECORDS[activeEvidenceId]?.sourceLabel : undefined
        }
      />

      {/* New Outlook Top Window Bar */}
      <header className="h-11 bg-[#F3F4F6] px-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-6 min-w-0 flex-1">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 rounded bg-[#007348] flex items-center justify-center text-white">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <span className="font-display font-semibold text-sm text-gray-900 whitespace-nowrap">
              Outlook
            </span>
          </div>

          <div className="max-w-md w-full">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full bg-white border border-gray-200/90 focus:border-[#00915A] text-xs rounded-md pl-8 pr-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none shadow-2xs"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="hidden sm:inline text-xs text-gray-600">
            BNP Paribas · {RM_PROFILE.name}
          </span>
          <div
            className="w-7 h-7 rounded-full bg-[#007348] text-white text-[11px] font-semibold flex items-center justify-center"
            title={RM_PROFILE.email}
          >
            SL
          </div>
        </div>
      </header>

      {/* New Outlook Menu Tabs + Mini Calendar Reminder */}
      <div className="h-8 bg-[#F3F4F6] px-4 flex items-center justify-between gap-4 shrink-0 text-xs">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setAccountOpen(!accountOpen)}
            className="p-1 text-gray-600 hover:bg-gray-200/70 rounded cursor-pointer"
            title="Toggle folder pane"
          >
            <Menu className="w-4 h-4" />
          </button>
          {(['home', 'view', 'help'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setTopTab(tab)}
              className={`pb-1 capitalize transition-colors cursor-pointer ${
                topTab === tab
                  ? 'font-semibold text-gray-900 border-b-2 border-[#00915A]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Upcoming Calendar / Déjà Due Widget (mirrors "Lunch with Jane" in screenshot) */}
        <button
          type="button"
          onClick={jumpToDejaDue}
          className="hidden md:flex items-center gap-2 text-right hover:bg-gray-200/60 px-2 py-0.5 rounded transition-colors cursor-pointer"
          title="Jump to Déjà Due: Possible Client Follow-ons Due"
        >
          <Calendar className="w-3.5 h-3.5 text-[#007348]" />
          <div className="leading-tight text-left">
            <div className="text-[11px] font-medium text-gray-900">
              Krispy Kreme Rates Sync
            </div>
            <div className="text-[10px] text-gray-500">
              in 30 min · Teams (Déjà Due)
            </div>
          </div>
        </button>
      </div>

      {/* Floating Rounded New Outlook Command Ribbon */}
      {mainSection === 'mail' && (
        <div className="mx-3 mb-2 bg-white border border-gray-200/90 rounded-lg shadow-2xs px-2.5 py-1.5 flex items-center justify-between gap-2 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Primary BNP Green New Mail Split Button */}
            <div className="inline-flex items-center rounded overflow-hidden mr-1">
              <button
                type="button"
                onClick={() =>
                  setComposeState({
                    open: true,
                    to: '',
                    subject: '',
                    body: '',
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#007348] hover:bg-[#005E3A] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>New mail</span>
              </button>
              <button
                type="button"
                onClick={() => handleDraftOutreach(WEEKLY_CLIENT_BRIEFS[0])}
                title="Draft outreach from top brief"
                className="px-1.5 py-1.5 text-white bg-[#007348] hover:bg-[#005E3A] border-l border-white/25 transition-colors cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => selectedEmail && handleArchiveEmail(selectedEmail.id)}
              title="Delete / Archive"
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => selectedEmail && handleArchiveEmail(selectedEmail.id)}
              title="Archive"
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => showToast('Private-side lender compliance verified.')}
              title="Information Barrier Status"
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-gray-200 mx-1" />

            <button
              type="button"
              onClick={() =>
                selectedEmail &&
                setComposeState({
                  open: true,
                  to: selectedEmail.senderEmail,
                  subject: `RE: ${selectedEmail.subject}`,
                  body: '',
                  clientName: selectedEmail.clientTag,
                })
              }
              title="Reply"
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
            >
              <Reply className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                selectedEmail &&
                setComposeState({
                  open: true,
                  to: selectedEmail.senderEmail,
                  subject: `RE: ${selectedEmail.subject}`,
                  body: '',
                })
              }
              title="Reply all"
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
            >
              <ReplyAll className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                selectedEmail &&
                setComposeState({
                  open: true,
                  to: '',
                  subject: `FW: ${selectedEmail.subject}`,
                  body: '',
                })
              }
              title="Forward"
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
            >
              <Forward className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-gray-200 mx-1" />

            <button
              type="button"
              onClick={() => handleSelectPrototypeFrame('newsletter')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick steps</span>
            </button>

            <button
              type="button"
              onClick={() => selectedEmail && handleToggleRead(selectedEmail.id)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded cursor-pointer whitespace-nowrap"
            >
              <MailOpen className="w-3.5 h-3.5 text-gray-600" />
              <span>Read/Unread</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Tagged: BNP Coverage Priority')}
              title="Categorize"
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
            >
              <Tag className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => selectedEmail && handleToggleFlag(selectedEmail.id)}
              title="Flag / Unflag"
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
            >
              <Flag
                className={`w-4 h-4 ${
                  selectedEmail?.isFlagged
                    ? 'text-red-600 fill-red-500'
                    : 'text-gray-600'
                }`}
              />
            </button>
            <button
              type="button"
              onClick={() => selectedEmail && handleTogglePin(selectedEmail.id)}
              title="Pin / Unpin"
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
            >
              <Pin
                className={`w-4 h-4 ${
                  selectedEmail?.isPinned ? 'text-[#007348]' : 'text-gray-600'
                }`}
              />
            </button>
            <button
              type="button"
              onClick={jumpToDejaDue}
              title="Déjà Due: Possible Client Follow-ons Due"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#007348] bg-[#EDF7F2] hover:bg-[#DDF0E6] rounded cursor-pointer whitespace-nowrap"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Déjà Due (7)</span>
            </button>
          </div>
        </div>
      )}

      {/* Main 4-Column New Outlook Workspace */}
      <div className="flex-1 flex min-h-0 px-3 pb-3 gap-2.5 overflow-hidden">
        {/* Far-Left Vertical App Rail */}
        <nav
          aria-label="Outlook navigation rail"
          className="w-10 flex flex-col items-center py-1 gap-2 shrink-0"
        >
          <button
            type="button"
            onClick={() => {
              setMainSection('mail');
              setActiveFolder('inbox');
            }}
            title="Mail"
            className={`relative w-9 h-9 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
              mainSection === 'mail'
                ? 'bg-white text-[#007348] shadow-2xs border border-gray-200/80'
                : 'text-gray-600 hover:bg-gray-200/70'
            }`}
          >
            {mainSection === 'mail' && (
              <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-[#007348]" />
            )}
            <Mail className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={jumpToDejaDue}
            title="Déjà Due: Follow-on Calendar"
            className="w-9 h-9 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-200/70 transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setMainSection('crm')}
            title="CRM Client 360° Book"
            className={`relative w-9 h-9 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
              mainSection === 'crm'
                ? 'bg-white text-[#007348] shadow-2xs border border-gray-200/80'
                : 'text-gray-600 hover:bg-gray-200/70'
            }`}
          >
            {mainSection === 'crm' && (
              <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-[#007348]" />
            )}
            <Users className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleSelectPrototypeFrame('evidence')}
            title="Linked Evidence Inspector"
            className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
              activeEvidenceId && mainSection === 'mail'
                ? 'bg-white text-[#007348] shadow-2xs border border-gray-200/80'
                : 'text-gray-600 hover:bg-gray-200/70'
            }`}
          >
            <FileSearch className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={jumpToDejaDue}
            title="Déjà Due Tasks"
            className="w-9 h-9 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-200/70 transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
          </button>
        </nav>

        {mainSection === 'crm' ? (
          <div className="flex-1 min-w-0 h-full">
            <CrmBookView
              selectedClientId={selectedClientId}
              onSelectClient={setSelectedClientId}
              onOpenEvidence={(evId) => handleOpenEvidence(evId)}
              onDraftOutreach={handleDraftOutreach}
              dejaDueItems={dejaDueItems}
              onUpdateDejaDueDate={handleUpdateDejaDueDate}
            />
          </div>
        ) : (
          <>
            {/* Folder Tree Pane (Transparent #F3F4F6 matching New Outlook) */}
            <aside className="w-52 hidden lg:flex flex-col text-xs select-none overflow-y-auto pr-1 shrink-0">
              {/* Favorites */}
              <div className="mb-3">
                <button
                  type="button"
                  onClick={() => setFavoritesOpen(!favoritesOpen)}
                  className="w-full flex items-center gap-1.5 px-2 py-1.5 font-semibold text-gray-700 hover:bg-gray-200/60 rounded cursor-pointer"
                >
                  {favoritesOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                  )}
                  <span>Favorites</span>
                </button>

                {favoritesOpen && (
                  <div className="mt-0.5 space-y-0.5 pl-2">
                    <button
                      type="button"
                      onClick={() => setActiveFolder('inbox')}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer ${
                        activeFolder === 'inbox'
                          ? 'bg-[#DDF0E6] text-[#007348] font-semibold'
                          : 'text-gray-700 hover:bg-gray-200/60'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Inbox className="w-3.5 h-3.5" />
                        <span>Inbox</span>
                      </span>
                      {unreadInboxCount > 0 && (
                        <span className="font-semibold tabular-nums">{unreadInboxCount}</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveFolder('briefs')}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer ${
                        activeFolder === 'briefs'
                          ? 'bg-[#DDF0E6] text-[#007348] font-semibold'
                          : 'text-gray-700 hover:bg-gray-200/60'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Newspaper className="w-3.5 h-3.5" />
                        <span>Rendez-Vous Briefs</span>
                      </span>
                      <span className="text-gray-500 tabular-nums">2</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveFolder('flagged')}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer ${
                        activeFolder === 'flagged'
                          ? 'bg-[#DDF0E6] text-[#007348] font-semibold'
                          : 'text-gray-700 hover:bg-gray-200/60'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Star className="w-3.5 h-3.5" />
                        <span>Flagged</span>
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Account Folder Group */}
              <div>
                <button
                  type="button"
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="w-full flex items-center gap-1.5 px-2 py-1.5 font-semibold text-gray-700 hover:bg-gray-200/60 rounded cursor-pointer"
                >
                  {accountOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                  )}
                  <span className="truncate">{RM_PROFILE.email}</span>
                </button>

                {accountOpen && (
                  <div className="mt-0.5 space-y-0.5 pl-2">
                    <button
                      type="button"
                      onClick={() => setActiveFolder('inbox')}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-gray-700 hover:bg-gray-200/60 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Inbox className="w-3.5 h-3.5" />
                        <span>Inbox</span>
                      </span>
                      {unreadInboxCount > 0 && (
                        <span className="font-semibold text-[#007348] tabular-nums">
                          {unreadInboxCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveFolder('sent')}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer ${
                        activeFolder === 'sent'
                          ? 'bg-[#DDF0E6] text-[#007348] font-semibold'
                          : 'text-gray-700 hover:bg-gray-200/60'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Send className="w-3.5 h-3.5" />
                        <span>Sent Items</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveFolder('archive')}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer ${
                        activeFolder === 'archive'
                          ? 'bg-[#DDF0E6] text-[#007348] font-semibold'
                          : 'text-gray-700 hover:bg-gray-200/60'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Archive</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={jumpToDejaDue}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[#007348] hover:bg-[#EDF7F2] font-medium cursor-pointer mt-2"
                    >
                      <span className="flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5" />
                        <span>Déjà Due Queue</span>
                      </span>
                      <span className="font-mono text-[11px] tabular-nums">7</span>
                    </button>
                  </div>
                )}
              </div>
            </aside>

            {/* Message List Card (Rounded White Card matching Screenshot) */}
            <section className="w-[335px] shrink-0 bg-white border border-gray-200/90 rounded-lg shadow-2xs flex flex-col min-h-0 overflow-hidden">
              {/* Focused / Other Tabs */}
              <div className="px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs">
                  <button
                    type="button"
                    onClick={() => setFocusedTab('focused')}
                    className={`pb-1 transition-colors cursor-pointer ${
                      focusedTab === 'focused'
                        ? 'font-semibold text-gray-900 border-b-2 border-[#00915A]'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Focused
                  </button>
                  <button
                    type="button"
                    onClick={() => setFocusedTab('other')}
                    className={`pb-1 transition-colors cursor-pointer ${
                      focusedTab === 'other'
                        ? 'font-semibold text-gray-900 border-b-2 border-[#00915A]'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Other
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setOnlyUnread(!onlyUnread)}
                  className={`text-[11px] px-2 py-0.5 rounded cursor-pointer ${
                    onlyUnread
                      ? 'bg-[#EDF7F2] text-[#007348] font-medium'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {onlyUnread ? 'Unread only' : 'All'}
                </button>
              </div>

              {/* Chronological Collapsible Message List */}
              <div className="flex-1 overflow-y-auto">
                {filteredEmails.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-500">
                    No messages in this view.
                  </div>
                ) : (
                  <>
                    {todayEmails.length > 0 && (
                      <div>
                        <button
                          type="button"
                          onClick={() => setTodayOpen(!todayOpen)}
                          className="w-full px-3.5 py-1.5 bg-gray-50/70 border-b border-gray-100 flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 cursor-pointer"
                        >
                          {todayOpen ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                          <span>Today</span>
                        </button>
                        {todayOpen && todayEmails.map(renderEmailRow)}
                      </div>
                    )}

                    {yesterdayEmails.length > 0 && (
                      <div>
                        <button
                          type="button"
                          onClick={() => setYesterdayOpen(!yesterdayOpen)}
                          className="w-full px-3.5 py-1.5 bg-gray-50/70 border-b border-gray-100 flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 cursor-pointer"
                        >
                          {yesterdayOpen ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                          <span>Yesterday</span>
                        </button>
                        {yesterdayOpen && yesterdayEmails.map(renderEmailRow)}
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>

            {/* Right Reading / Inline Compose Card */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              {composeState?.open ? (
                <ComposeModal
                  initialTo={composeState.to}
                  initialSubject={composeState.subject}
                  initialBody={composeState.body}
                  clientName={composeState.clientName}
                  onClose={() => setComposeState(null)}
                  onSend={handleSendEmail}
                />
              ) : selectedEmail ? (
                selectedEmail.isNewsletter ? (
                  <NewsletterView
                    onOpenEvidence={handleOpenEvidence}
                    onDraftOutreach={handleDraftOutreach}
                    onOpenClientCrm={handleOpenClientCrm}
                    activeEvidenceId={activeEvidenceId}
                    dejaDueItems={dejaDueItems}
                    onUpdateDejaDueDate={handleUpdateDejaDueDate}
                    editionLabel={
                      selectedEmail.id === 'email-weekly-brief-prev'
                        ? 'Thursday, Nov 5, 2026 · 07:30 AM (Archived)'
                        : 'Thursday, Nov 12, 2026 · 07:30 AM'
                    }
                  />
                ) : (
                  <div className="bg-white border border-gray-200/90 rounded-lg shadow-2xs overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h1 className="text-lg font-semibold text-gray-900 mb-4">
                        {selectedEmail.subject}
                      </h1>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 font-semibold text-xs flex items-center justify-center">
                            {selectedEmail.senderInitials}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {selectedEmail.senderName}
                              {selectedEmail.senderRole && (
                                <span className="font-normal text-gray-500 ml-1.5 text-xs">
                                  · {selectedEmail.senderRole}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {selectedEmail.senderEmail} · {selectedEmail.dateLabel}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {selectedEmail.hasAttachment && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 mr-2">
                              <Paperclip className="w-3.5 h-3.5" />
                              <span>1 attachment</span>
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setComposeState({
                                open: true,
                                to: selectedEmail.senderEmail,
                                subject: `RE: ${selectedEmail.subject}`,
                                body: '',
                                clientName: selectedEmail.clientTag,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <Reply className="w-3.5 h-3.5" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-6 space-y-4 text-sm text-gray-800 leading-relaxed">
                      {(selectedEmail.bodyParagraphs || [selectedEmail.preview]).map(
                        (para, idx) => (
                          <p key={idx}>{para}</p>
                        )
                      )}
                    </div>

                    <div className="px-6 py-4 bg-[#F8FAF9] border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-gray-600">
                        View all matched market triggers, public filings & Déjà Due follow-ons in this week’s brief.
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectPrototypeFrame('newsletter')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#007348] rounded hover:bg-[#005E3A] transition-colors cursor-pointer"
                      >
                        <MailOpen className="w-3.5 h-3.5" />
                        <span>Open Rendez-Vous Brief</span>
                      </button>
                    </div>
                  </div>
                )
              ) : null}
            </main>

            {/* Rightmost Split Evidence Inspector (Frame 3) */}
            {activeEvidenceId && !composeState?.open && (
              <aside className="w-[430px] xl:w-[470px] shrink-0 h-full overflow-hidden">
                <EvidencePanel
                  evidenceId={activeEvidenceId}
                  onClose={() => setActiveEvidenceId(null)}
                  onSelectEvidence={(id) => {
                    setActiveEvidenceId(id);
                    setLastEvidenceId(id);
                  }}
                  onOpenClientCrm={handleOpenClientCrm}
                  onDraftOutreach={handleDraftOutreach}
                />
              </aside>
            )}
          </>
        )}
      </div>

      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#111827] text-white text-xs px-4 py-2 rounded shadow-lg border border-gray-700">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// BRAND LOGO COMPONENT
// ==========================================

function KobacLogo({ className = "", showText = true, darkText = false, size = "normal" }: { className?: string; showText?: boolean; darkText?: boolean; size?: "small" | "normal" | "large" }) {
  const scaleClass = size === "small" ? "scale-75 origin-left" : size === "large" ? "scale-125" : "";
  return (
    <div className={`flex items-center gap-2.5 ${scaleClass} ${className}`}>
      <img
        src={showText ? (darkText ? "/kobac-logo-dark.png" : "/kobac-logo.png") : (darkText ? "/kobac-icon-dark.png" : "/kobac-icon.png")}
        alt={showText ? "KOBAC SYSTEMS" : "KOBAC SYSTEMS logo"}
        className={showText ? "h-12 w-auto flex-shrink-0" : "h-8 w-8 flex-shrink-0"}
      />
    </div>
  );
}

// ==========================================
// TYPES & INTERFACES
// ==========================================

interface User {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  role: string;
  password?: string;
  responsibilities: string;
  avatar: string;
  active: boolean;
}

interface Client {
  id: string;
  name: string;
  org_name: string;
  contact_person: string;
  email: string;
  phone: string;
  location: string;
  industry: string;
  client_type: string;
  assigned_manager_id?: string;
  requirements: string;
  status: string;
}

interface DocumentItem {
  id: string;
  title: string;
  reference: string;
  category: string;
  description: string;
  file_url?: string;
  client_name?: string;
  project_name?: string;
  owner: string;
  department: string;
  confidentiality: string;
  status: string;
  version: string;
}

interface Negotiation {
  id: string;
  title: string;
  client: string;
  opportunity: string;
  owner: string;
  participants: string[];
  meeting_date: string;
  client_requirements: string;
  initial_proposal: string;
  counteroffers: string;
  notes: string;
  risks: string;
  next_action: string;
  follow_up_date: string;
  status: string;
}

interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

interface Project {
  id: string;
  name: string;
  client: string;
  scope: string;
  owner: string;
  team: string[];
  start_date: string;
  target_date: string;
  status: string;
  budget: string;
  milestones: Milestone[];
  deliverables: string;
}

interface TaskItem {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  created_by: string;
  client_or_project: string;
  priority: string;
  due_date: string;
  status: string;
  progress: number;
}

interface Contract {
  id: string;
  reference: string;
  title: string;
  client: string;
  project?: string;
  parties: string[];
  owner: string;
  start_date: string;
  expiration_date: string;
  value: string;
  status: string;
  approval_status: string;
  signed_document_url?: string;
}

interface BoardMember {
  id: string;
  name: string;
  position: string;
  appointment_date: string;
  term_end_date?: string;
  contact: string;
  bio: string;
  status: string;
}

interface MeetingItem {
  id: string;
  subject: string;
  client_or_project?: string;
  channel: string;
  participants: string[];
  date_time: string;
  summary: string;
  decisions: string;
  action_items: string;
  next_follow_up: string;
}

interface ReminderItem {
  id: string;
  title: string;
  due_date: string;
  priority: string;
  record_link?: string;
  status: string;
}

interface AuditLog {
  id: string;
  action: string;
  actor: string;
  ip: string;
  timestamp: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  project_title?: string;
  category: string;
  description?: string;
  summary?: string;
  problem?: string;
  solution?: string;
  key_improvements?: string[];
  business_impact?: string;
  image_url: string;
  client: string;
  industry: string;
  metrics?: string;
  result?: string;
}

interface CompanySettings {
  id: string;
  company_name: string;
  tagline: string;
  location: string;
  emails: string[];
  phones: string[];
  logo_url: string | null;
  primary_color: string;
  accent_color: string;
}

type ReportType = 'executive' | 'financial' | 'audit' | 'custom';

interface ReportItem {
  id: string;
  report_type: ReportType;
  title: string;
  description: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function App() {
  const [activePortal, setActivePortal] = useState<'public' | 'portal'>('public');
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Data States
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [publicTeam, setPublicTeam] = useState<User[]>([]);
  const [publicPortfolio, setPublicPortfolio] = useState<PortfolioItem[]>([]);
  const [publicCompanySettings, setPublicCompanySettings] = useState<CompanySettings | null>(null);

  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadPublicData = async () => {
    try {
      const res = await fetch('/api/public/bootstrap');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to load public website data.');
      setPublicPortfolio(data.portfolio);
      setPublicTeam(data.team);
      setPublicCompanySettings(data.settings);
    } catch (err) {
      console.error('Failed to load public website data:', err);
      showNotification(err instanceof Error ? err.message : 'Failed to load public website data.', 'error');
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to load dashboard data.');
      setUsers(data.users);
      setClients(data.clients);
      setDocuments(data.documents);
      setNegotiations(data.negotiations);
      setProjects(data.projects);
      setTasks(data.tasks);
      setContracts(data.contracts);
      setBoardMembers(data.board_members);
      setMeetings(data.meetings);
      setReminders(data.reminders);
      setAuditLogs(data.audit_logs);
      setPortfolio(data.portfolio);
      setReports(Array.isArray(data.reports) ? data.reports : []);
      setCompanySettings(data.company_settings);
      return true;
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      showNotification(err instanceof Error ? err.message : 'Failed to load dashboard data.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshAllData = async () => {
    if (currentUser) {
      await fetchAllData();
    } else {
      await loadPublicData();
    }
  };

  const handleLoginSuccess = async (user: User) => {
    if (await fetchAllData()) {
      setCurrentUser(user);
      return;
    }
    await fetch('/api/auth/logout', { method: 'POST' }).catch(err => console.error('Failed to clear invalid staff session:', err));
  };

  useEffect(() => {
    void (async () => {
      await loadPublicData();
      try {
        const sessionRes = await fetch('/api/auth/me');
        if (sessionRes.status === 401) return;
        const sessionData = await sessionRes.json();
        if (!sessionRes.ok) throw new Error(sessionData.error || 'Unable to restore staff session.');
        if (await fetchAllData()) setCurrentUser(sessionData.user);
      } catch (err) {
        console.error('Failed to restore staff session:', err);
        showNotification(err instanceof Error ? err.message : 'Unable to restore staff session.', 'error');
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F8F7] text-[#17231F] font-sans antialiased selection:bg-[#F5A623] selection:text-[#0B3B2C]">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl text-white font-medium flex items-center gap-3 animate-bounce ${
          notification.type === 'success' ? 'bg-[#0B3B2C]' : 'bg-red-600'
        }`}>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Mode Switcher Banner */}
      <div className="bg-[#0B3B2C] text-white px-4 py-2.5 text-sm flex flex-col gap-3 border-b border-[#144f3d] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <KobacLogo size="small" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <button 
            onClick={() => setActivePortal('public')}
            className={`whitespace-nowrap px-3.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              activePortal === 'public' ? 'bg-[#F5A623] text-[#0B3B2C]' : 'text-gray-300 hover:text-white hover:bg-[#144f3d]'
            }`}
          >
            Public Website
          </button>
          <button 
            onClick={() => setActivePortal('portal')}
            className={`whitespace-nowrap px-3.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              activePortal === 'portal' ? 'bg-[#F5A623] text-[#0B3B2C]' : 'text-gray-300 hover:text-white hover:bg-[#144f3d]'
            }`}
          >
            Operations Portal & CRM
          </button>
        </div>
      </div>

      {activePortal === 'public' ? (
        <PublicWebsite portfolio={publicPortfolio} companySettings={publicCompanySettings} users={publicTeam} setActivePortal={setActivePortal} onRefresh={refreshAllData} />
      ) : !currentUser ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} showNotification={showNotification} />
      ) : (
        <OperationsPortal 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          users={users}
          clients={clients}
          documents={documents}
          negotiations={negotiations}
          projects={projects}
          tasks={tasks}
          contracts={contracts}
          boardMembers={boardMembers}
          meetings={meetings}
          reminders={reminders}
          auditLogs={auditLogs}
          portfolio={portfolio}
          reports={reports}
          companySettings={companySettings}
          currentUser={currentUser}
          onLogout={() => {
            void fetch('/api/auth/logout', { method: 'POST' }).catch(err => console.error('Sign-out request failed:', err));
            setCurrentUser(null);
            void loadPublicData();
            showNotification('Signed out successfully');
          }}
          onRefresh={refreshAllData}
          showNotification={showNotification}
        />
      )}

      {/* Floating AI Chat Assistant */}
      <AiChatAssistant />
    </div>
  );
}

// ==========================================
// PUBLIC WEBSITE COMPONENT
// ==========================================

function PublicWebsite({ portfolio, companySettings, users, setActivePortal, onRefresh }: { 
  portfolio: PortfolioItem[]; 
  companySettings: CompanySettings | null; 
  users: User[];
  setActivePortal: (portal: 'public' | 'portal') => void;
  onRefresh: () => void;
}) {
  const [subPage, setSubPage] = useState<'home' | 'services' | 'portfolio' | 'about' | 'contact' | 'wizard'>('home');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<PortfolioItem | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        setSubmitted(true);
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Unable to send your message. Please try again.');
      }
    } catch (err) {
      setContactError(err instanceof Error ? err.message : 'Unable to send your message. Please try again.');
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSubPage('home'); setSelectedCaseStudy(null); setMobileMenuOpen(false); }}>
          <KobacLogo darkText={true} />
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <button onClick={() => { setSubPage('home'); setSelectedCaseStudy(null); }} className={`hover:text-[#0B3B2C] transition-colors ${subPage === 'home' ? 'text-[#0B3B2C]' : ''}`}>Home</button>
          <button onClick={() => { setSubPage('services'); setSelectedCaseStudy(null); }} className={`hover:text-[#0B3B2C] transition-colors ${subPage === 'services' ? 'text-[#0B3B2C]' : ''}`}>Services</button>
          <button onClick={() => { setSubPage('portfolio'); setSelectedCaseStudy(null); }} className={`hover:text-[#0B3B2C] transition-colors ${subPage === 'portfolio' ? 'text-[#0B3B2C]' : ''}`}>Portfolio & Case Studies</button>
          <button onClick={() => { setSubPage('about'); setSelectedCaseStudy(null); }} className={`hover:text-[#0B3B2C] transition-colors ${subPage === 'about' ? 'text-[#0B3B2C]' : ''}`}>About & Team</button>
          <button onClick={() => { setSubPage('wizard'); setSelectedCaseStudy(null); }} className={`hover:text-[#0B3B2C] transition-colors ${subPage === 'wizard' ? 'text-[#0B3B2C]' : ''}`}>AI Project Scoper</button>
          <button onClick={() => { setSubPage('contact'); setSelectedCaseStudy(null); }} className={`hover:text-[#0B3B2C] transition-colors ${subPage === 'contact' ? 'text-[#0B3B2C]' : ''}`}>Contact</button>
        </nav>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActivePortal('portal')} 
            className="hidden sm:flex bg-[#0B3B2C] hover:bg-[#144f3d] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all items-center gap-2"
          >
            <span>Operations Portal</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#0B3B2C] focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-4 space-y-3 shadow-lg animate-in slide-in-from-top">
          <button onClick={() => { setSubPage('home'); setMobileMenuOpen(false); setSelectedCaseStudy(null); }} className="block w-full text-left font-semibold text-gray-700 py-2">Home</button>
          <button onClick={() => { setSubPage('services'); setMobileMenuOpen(false); setSelectedCaseStudy(null); }} className="block w-full text-left font-semibold text-gray-700 py-2">Services</button>
          <button onClick={() => { setSubPage('portfolio'); setMobileMenuOpen(false); setSelectedCaseStudy(null); }} className="block w-full text-left font-semibold text-gray-700 py-2">Portfolio & Case Studies</button>
          <button onClick={() => { setSubPage('about'); setMobileMenuOpen(false); setSelectedCaseStudy(null); }} className="block w-full text-left font-semibold text-gray-700 py-2">About & Team Permissions</button>
          <button onClick={() => { setSubPage('wizard'); setMobileMenuOpen(false); setSelectedCaseStudy(null); }} className="block w-full text-left font-semibold text-gray-700 py-2">AI Project Scoper</button>
          <button onClick={() => { setSubPage('contact'); setMobileMenuOpen(false); setSelectedCaseStudy(null); }} className="block w-full text-left font-semibold text-gray-700 py-2">Contact</button>
          <button onClick={() => { setActivePortal('portal'); setMobileMenuOpen(false); }} className="w-full bg-[#0B3B2C] text-white py-2.5 rounded-xl font-bold text-center block mt-2">Operations Portal</button>
        </div>
      )}

      {/* Main Content */}
      {subPage === 'home' && (
        <div>
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-[#0B3B2C] via-[#0e4d3a] to-[#17231F] text-white py-24 px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <span className="bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  Digital Solutions Built for Somalia
                </span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                  Technology That Moves <span className="text-[#F5A623]">Your Business Forward</span>
                </h1>
                <p className="text-lg text-gray-300 font-normal leading-relaxed">
                  KOBAC SYSTEMS builds reliable digital solutions that help businesses and institutions across Somalia streamline their operations, organize their data, improve service delivery, and manage their day-to-day activities more efficiently. We provide practical business software, digital transformation services, and secure technology solutions tailored to local needs.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <button onClick={() => setSubPage('wizard')} className="bg-[#F5A623] hover:bg-[#e0961d] text-[#0B3B2C] px-8 py-3.5 rounded-xl font-bold shadow-xl transition-all transform hover:-translate-y-0.5">
                    Launch AI Project Scoper
                  </button>
                  <button onClick={() => setSubPage('portfolio')} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3.5 rounded-xl font-semibold transition-all">
                    Explore Case Studies
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-sm font-semibold text-gray-300">Live Enterprise Hub</span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-xs text-gray-400">Active Clients</p>
                      <p className="text-2xl font-black text-[#F5A623] mt-1">48+</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-xs text-gray-400">Delivered Projects</p>
                      <p className="text-2xl font-black text-[#F5A623] mt-1">120+</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-xs text-gray-400">Uptime SLA</p>
                      <p className="text-2xl font-black text-emerald-400 mt-1">99.99%</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-xs text-gray-400">Security Audit</p>
                      <p className="text-2xl font-black text-emerald-400 mt-1">Passed</p>
                    </div>
                  </div>
                  <button onClick={() => setActivePortal('portal')} className="w-full bg-[#F5A623]/20 hover:bg-[#F5A623]/30 border border-[#F5A623]/40 text-[#F5A623] py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2 transition-all">
                    Open Operations Dashboard
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14m-7-7 7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Services Highlights */}
          <section className="py-20 px-6 max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-black text-[#0B3B2C]">Core Enterprise Capabilities</h2>
              <p className="text-gray-600">We architect robust, scalable systems tailored to government agencies, financial institutions, and enterprise corporations.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#F6F8F7] p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-[#0B3B2C] text-[#F5A623] flex items-center justify-center font-bold text-2xl mb-6 shadow-md group-hover:scale-110 transition-transform">01</div>
                <h3 className="text-xl font-bold text-[#0B3B2C] mb-3">Enterprise CRM & Client Operations</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Centralize client communications, negotiations, contract lifecycle management, and secure document vaults.</p>
              </div>
              <div className="bg-[#F6F8F7] p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-[#0B3B2C] text-[#F5A623] flex items-center justify-center font-bold text-2xl mb-6 shadow-md group-hover:scale-110 transition-transform">02</div>
                <h3 className="text-xl font-bold text-[#0B3B2C] mb-3">Custom Software & Cloud Infrastructure</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Full-stack web and mobile application engineering, cloud migration, and automated CI/CD security pipelines.</p>
              </div>
              <div className="bg-[#F6F8F7] p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-[#0B3B2C] text-[#F5A623] flex items-center justify-center font-bold text-2xl mb-6 shadow-md group-hover:scale-110 transition-transform">03</div>
                <h3 className="text-xl font-bold text-[#0B3B2C] mb-3">Governance & Board Management</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Secure document sharing, board member governance tracking, meeting minutes, and compliance audit logging.</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {subPage === 'services' && (
        <div className="py-20 px-6 max-w-5xl mx-auto space-y-16 animate-in fade-in">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="bg-[#0B3B2C]/10 text-[#0B3B2C] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Our Comprehensive Services</span>
            <h1 className="text-4xl md:text-5xl font-black text-[#0B3B2C]">Turning Business Challenges into Real Solutions</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              We help businesses and institutions identify operational challenges, improve the way they work, and turn ideas into practical digital solutions that deliver real value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#F6F8F7] border border-gray-200 p-8 md:p-10 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0B3B2C] text-[#F5A623] flex items-center justify-center font-bold text-xl shadow-md">01</div>
                <h3 className="text-2xl font-bold text-[#0B3B2C]">Digital Transformation & Business Solutions</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We analyze business challenges and design practical solutions that improve efficiency, simplify operations, and support sustainable growth.
                </p>
              </div>
              <ul className="space-y-3 text-sm text-gray-700 font-medium pt-4 border-t border-gray-200">
                <li className="flex items-center gap-3"><span className="text-[#F5A623] font-bold text-base">✓</span> Business Process Improvement & Automation</li>
                <li className="flex items-center gap-3"><span className="text-[#F5A623] font-bold text-base">✓</span> Digital Transformation & Operational Efficiency</li>
                <li className="flex items-center gap-3"><span className="text-[#F5A623] font-bold text-base">✓</span> Business Analysis & Solution Planning</li>
              </ul>
            </div>

            <div className="bg-[#F6F8F7] border border-gray-200 p-8 md:p-10 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0B3B2C] text-[#F5A623] flex items-center justify-center font-bold text-xl shadow-md">02</div>
                <h3 className="text-2xl font-bold text-[#0B3B2C]">Custom Business Systems & Applications</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We design and build tailored digital systems that solve real-world problems, organize business operations, and help organizations manage their daily activities more effectively.
                </p>
              </div>
              <ul className="space-y-3 text-sm text-gray-700 font-medium pt-4 border-t border-gray-200">
                <li className="flex items-center gap-3"><span className="text-[#F5A623] font-bold text-base">✓</span> Business Management Systems</li>
                <li className="flex items-center gap-3"><span className="text-[#F5A623] font-bold text-base">✓</span> School & Educational Management Systems</li>
                <li className="flex items-center gap-3"><span className="text-[#F5A623] font-bold text-base">✓</span> Customer, Sales & Inventory Management Solutions</li>
                <li className="flex items-center gap-3"><span className="text-[#F5A623] font-bold text-base">✓</span> Document & Records Management Systems</li>
                <li className="flex items-center gap-3"><span className="text-[#F5A623] font-bold text-base">✓</span> Custom Web Applications & Digital Platforms</li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-8 md:p-12 rounded-3xl shadow-sm space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-3xl font-black text-[#0B3B2C]">From Ideas to Real Solutions</h3>
              <p className="text-sm text-gray-600">Every project begins with understanding the client's needs. We identify the problem, plan the right solution, build a system around real business requirements, and refine it to support practical, measurable improvements.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              <div className="bg-[#F6F8F7] p-6 rounded-2xl border border-gray-200 space-y-2">
                <span className="text-[#F5A623] font-black text-lg">✓</span>
                <h4 className="font-bold text-sm text-[#0B3B2C]">Problem Identification & Requirements Analysis</h4>
              </div>
              <div className="bg-[#F6F8F7] p-6 rounded-2xl border border-gray-200 space-y-2">
                <span className="text-[#F5A623] font-black text-lg">✓</span>
                <h4 className="font-bold text-sm text-[#0B3B2C]">Solution Design & Implementation</h4>
              </div>
              <div className="bg-[#F6F8F7] p-6 rounded-2xl border border-gray-200 space-y-2">
                <span className="text-[#F5A623] font-black text-lg">✓</span>
                <h4 className="font-bold text-sm text-[#0B3B2C]">Testing, Deployment & Continuous Improvement</h4>
              </div>
              <div className="bg-[#F6F8F7] p-6 rounded-2xl border border-gray-200 space-y-2">
                <span className="text-[#F5A623] font-black text-lg">✓</span>
                <h4 className="font-bold text-sm text-[#0B3B2C]">Ongoing Technical Support & Maintenance</h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {subPage === 'portfolio' && !selectedCaseStudy && (
        <div className="py-20 px-6 max-w-6xl mx-auto space-y-12 animate-in fade-in">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="bg-[#0B3B2C]/10 text-[#0B3B2C] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Verified Case Studies</span>
            <h1 className="text-4xl font-black text-[#0B3B2C]">Portfolio & Real-World Solutions</h1>
            <p className="text-gray-600">Discover how Kobac Systems partners with institutions and enterprises to solve operational challenges and deliver practical digital solutions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolio.map(item => (
              <div 
                key={item.id} 
                onClick={() => setSelectedCaseStudy(item)}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#0B3B2C]/10 text-[#0B3B2C] text-xs font-bold px-3 py-1 rounded-full">{item.category}</span>
                    <span className="text-xs text-gray-500 font-medium">{item.industry}</span>
                  </div>
                  <h3 className="text-2xl font-black text-[#0B3B2C] group-hover:text-[#F5A623] transition-colors">{item.title}</h3>
                  {item.project_title && item.project_title.trim().toLowerCase() !== item.summary?.trim().toLowerCase() && (
                    <p className="text-sm font-bold text-gray-700">{item.project_title}</p>
                  )}
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{item.summary || item.description}</p>
                </div>
                <div className="p-8 pt-0 flex items-center justify-between border-t border-gray-100 bg-gray-50/50 mt-4">
                  <span className="text-xs font-bold text-gray-500">Client: {item.client}</span>
                  <span className="text-sm font-bold text-[#0B3B2C] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    View Case Study &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subPage === 'portfolio' && selectedCaseStudy && (
        <div className="py-20 px-6 max-w-4xl mx-auto space-y-12 animate-in fade-in">
          <button 
            onClick={() => setSelectedCaseStudy(null)}
            className="text-sm font-bold text-[#0B3B2C] hover:underline flex items-center gap-2"
          >
            &larr; Back to Portfolio & Case Studies
          </button>

          <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-xl space-y-8">
            <div className="space-y-4 border-b border-gray-200 pb-8">
              <span className="bg-[#F5A623]/20 text-[#0B3B2C] text-xs font-bold px-3 py-1 rounded-full uppercase">{selectedCaseStudy.category}</span>
              <h1 className="text-3xl md:text-5xl font-black text-[#0B3B2C]">{selectedCaseStudy.title}</h1>
              <p className="text-lg font-semibold text-gray-700">{selectedCaseStudy.project_title || selectedCaseStudy.summary}</p>
              <div className="flex flex-wrap gap-6 text-xs text-gray-500 pt-2 font-medium">
                <span><strong>Client:</strong> {selectedCaseStudy.client}</span>
                <span><strong>Industry:</strong> {selectedCaseStudy.industry}</span>
              </div>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <div>
                <h3 className="text-xl font-bold text-[#0B3B2C] mb-3">The Business Challenge</h3>
                <p className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-sm leading-relaxed">
                  {selectedCaseStudy.problem || selectedCaseStudy.description}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#0B3B2C] mb-3">The Solution Delivered by KOBAC SYSTEMS</h3>
                <p className="text-sm leading-relaxed mb-4">
                  {selectedCaseStudy.solution || 'KOBAC SYSTEMS designed and delivered a tailored digital workflow solution to streamline operations and enhance organization.'}
                </p>
                {selectedCaseStudy.key_improvements && selectedCaseStudy.key_improvements.length > 0 && (
                  <ul className="space-y-2 bg-[#F6F8F7] p-6 rounded-2xl border border-gray-200 text-sm">
                    {selectedCaseStudy.key_improvements.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-[#F5A623] font-bold text-lg">&#10003;</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#0B3B2C] mb-3">Business Impact</h3>
                <p className="bg-emerald-50 text-emerald-900 p-6 rounded-2xl border border-emerald-200 text-sm leading-relaxed font-medium">
                  {selectedCaseStudy.business_impact || selectedCaseStudy.result || 'The solution successfully helped the organization achieve higher operational efficiency and reliable recordkeeping.'}
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-[#0B3B2C]">Interested in a similar solution?</h4>
                <p className="text-xs text-gray-500">Contact our engineering team to discuss your requirements.</p>
              </div>
              <button 
                onClick={() => setSubPage('contact')}
                className="bg-[#0B3B2C] hover:bg-[#144f3d] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-all"
              >
                Discuss a Similar Project &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {subPage === 'about' && (
        <div className="py-20 px-6 max-w-5xl mx-auto space-y-16 animate-in fade-in">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="bg-[#0B3B2C]/10 text-[#0B3B2C] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">About Kobac Systems</span>
            <h1 className="text-4xl font-black text-[#0B3B2C]">Enterprise Excellence & Leadership</h1>
            <p className="text-lg text-gray-600">Engineering the digital backbone for modern enterprises, educational institutions, and government agencies across Somalia.</p>
          </div>
          <div className="bg-[#F6F8F7] p-8 md:p-12 rounded-3xl border border-gray-200 space-y-6 text-gray-700 leading-relaxed shadow-sm">
            <h3 className="text-2xl font-bold text-[#0B3B2C]">Our Mission & Vision</h3>
            <p>
              Founded with a mission to bridge the technology gap in emerging markets, Kobac Systems brings elite software engineering, rigorous project management, and enterprise-grade security to our clients.
            </p>
            <p>
              Our multidisciplinary team works hand-in-hand with organizational leaders to deliver transparent, scalable, and impactful solutions tailored to local needs.
            </p>
          </div>

          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-[#0B3B2C]">Team & Role-Based Permissions</h2>
              <p className="text-sm text-gray-600">Live directory of authorized operational personnel and their assigned system permissions.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map(member => (
                <div key={member.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-2xl object-cover shadow-md" />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-[#0B3B2C] text-[#F5A623] flex items-center justify-center font-black text-xl shadow-md">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-[#0B3B2C] text-lg leading-tight">{member.name}</h4>
                        <p className="text-xs font-semibold text-[#F5A623] mt-0.5">{member.title}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-xs space-y-1.5 font-medium text-gray-600">
                      <p><strong>Department:</strong> {member.department}</p>
                      <p><strong>System Role:</strong> <span className="text-[#0B3B2C] font-bold">{member.role}</span></p>
                      <p><strong>Email:</strong> {member.email}</p>
                      <p><strong>Phone:</strong> {member.phone || 'N/A'}</p>
                    </div>
                    {member.responsibilities && (
                      <p className="text-xs text-gray-600 leading-relaxed italic">
                        "{member.responsibilities}"
                      </p>
                    )}
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${member.active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {member.active ? 'Active Access' : 'Inactive'}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-400">ID: {member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {subPage === 'wizard' && (
        <ProjectRequestWizard setSubPage={setSubPage} />
      )}

      {subPage === 'contact' && (
        <div className="py-20 px-6 max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black text-[#0B3B2C]">Get in Touch</h1>
            <p className="text-gray-600">Have a project in mind or need enterprise consulting? Contact us directly or send a message.</p>
            <div className="flex flex-wrap justify-center gap-4 pt-2 text-sm font-bold text-[#0B3B2C]">
              <span className="bg-[#F5A623]/20 px-4 py-2 rounded-xl">+252 61 5283292</span>
              <span className="bg-[#F5A623]/20 px-4 py-2 rounded-xl">+252 61 7747801</span>
              <span className="bg-[#F5A623]/20 px-4 py-2 rounded-xl">+252 61 4163362</span>
            </div>
          </div>
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-4">
              <h3 className="text-2xl font-bold text-emerald-800">Message Received Successfully!</h3>
              <p className="text-emerald-700">Thank you for reaching out. Our team will review your inquiry and get back to you within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="bg-[#0B3B2C] text-white px-6 py-2.5 rounded-xl font-semibold text-sm">Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="bg-[#F6F8F7] p-8 rounded-2xl border border-gray-200 space-y-6">
              {contactError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">{contactError}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Your Name</label>
                  <input 
                    type="text" 
                    required 
                    value={contactForm.name} 
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0B3B2C]"
                    placeholder="Abdi Farah"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={contactForm.email} 
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0B3B2C]"
                    placeholder="abdi@enterprise.so"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Subject</label>
                <input 
                  type="text" 
                  required 
                  value={contactForm.subject} 
                  onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0B3B2C]"
                  placeholder="Enterprise CRM Integration"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Message</label>
                <textarea 
                  rows={5} 
                  required 
                  value={contactForm.message} 
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0B3B2C]"
                  placeholder="Describe your requirements..."
                />
              </div>
              <button type="submit" disabled={contactSubmitting} className="w-full bg-[#0B3B2C] hover:bg-[#144f3d] disabled:opacity-60 text-white py-3.5 rounded-xl font-bold shadow-lg transition-all">
                {contactSubmitting ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#0B3B2C] text-white py-12 px-6 mt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <KobacLogo />
            <p className="text-xs text-gray-300">Empowering enterprises with intelligent software systems and secure operations.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#F5A623] uppercase mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><button onClick={() => setSubPage('home')}>Home</button></li>
              <li><button onClick={() => setSubPage('services')}>Services</button></li>
              <li><button onClick={() => setSubPage('portfolio')}>Portfolio & Case Studies</button></li>
              <li><button onClick={() => setSubPage('about')}>About Us</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#F5A623] uppercase mb-3">Contact</h4>
            <p className="text-xs text-gray-300">{companySettings?.emails?.[0] || 'contactkobacsystems@gmail.com'}</p>
            {(companySettings?.phones?.length ? companySettings.phones : ['+252 61 5283292', '+252 61 7747801', '+252 61 4163362']).map(phone => (
              <p key={phone} className="text-xs text-gray-300 mt-1">{phone}</p>
            ))}
            <p className="text-xs text-gray-300 mt-1">{companySettings?.location || 'Mogadishu, Somalia'}</p>
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#F5A623] uppercase mb-3">Operations Portal</h4>
            <p className="text-xs text-gray-300 mb-3">Access internal enterprise dashboards, client CRM, contracts, and audit logs.</p>
            <button onClick={() => setActivePortal('portal')} className="bg-[#F5A623] text-[#0B3B2C] px-4 py-2 rounded-lg font-bold text-xs">
              Sign In to Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// AI PROJECT SCOPER WIZARD
// ==========================================

const MIN_PROJECT_CHALLENGE_LENGTH = 20;

function ProjectRequestWizard({ setSubPage }: { setSubPage: (p: 'home' | 'services' | 'portfolio' | 'about' | 'contact' | 'wizard') => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    solutionType: 'Business Management Systems',
    problemDescription: '',
    organizationType: 'Corporate Enterprise',
  });
  const [contactDetails, setContactDetails] = useState({ name: '', organizationName: '', email: '', phone: '' });
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submissionKey = useRef(crypto.randomUUID());
  const submissionInProgress = useRef(false);
  const challengeLength = formData.problemDescription.trim().length;

  const solutionTypes = [
    ['Business Management Systems', 'Digitize business operations, records, workflows, reporting, and administration.'],
    ['Custom Software Development', 'Build tailored web applications, business platforms, portals, and software.'],
    ['Business Process Automation', 'Automate repetitive tasks, approvals, documentation, reporting, and manual workflows.'],
    ['Enterprise Operations & Workflow Management', 'Coordinate departments, employees, tasks, projects, approvals, and operational reporting.'],
    ['Digital Transformation & Consulting', 'Assess existing processes, identify bottlenecks, and develop a practical digital roadmap.'],
    ['Secure Document & Information Management', 'Organize business documents, permissions, records, retrieval, and document workflows.'],
    ['Customer & Client Management', 'Manage customer records, client relationships, inquiries, service requests, and follow-ups.'],
    ['Custom Solution / Not Sure Yet', 'Describe your challenge and KOBAC SYSTEMS will help identify an appropriate solution.'],
  ] as const;

  const handleGenerate = async () => {
    if (challengeLength < MIN_PROJECT_CHALLENGE_LENGTH) {
      const remainingCharacters = MIN_PROJECT_CHALLENGE_LENGTH - challengeLength;
      setError(`Please add ${remainingCharacters} more character${remainingCharacters === 1 ? '' : 's'} to describe your business challenge.`);
      return;
    }
    setError('');
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/scope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to generate a recommendation. Please try again.');
      if (typeof data.recommendation !== 'string' || !data.recommendation.trim()) {
        throw new Error('The scoping service returned an empty recommendation. Please try again.');
      }
      setRecommendation(data.recommendation);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate a recommendation. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submissionInProgress.current) return;
    submissionInProgress.current = true;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/contact-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactDetails.name,
          email: contactDetails.email,
          phone: contactDetails.phone,
          subject: `${formData.solutionType} inquiry`,
          organizationName: contactDetails.organizationName,
          message: formData.problemDescription,
          organizationType: formData.organizationType,
          solutionType: formData.solutionType,
          recommendation,
          submissionKey: submissionKey.current
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to submit your inquiry. Please try again.');
      const savedReference = data.reference_id ?? data.referenceId;
      if (typeof savedReference !== 'string' || !savedReference.trim()) {
        throw new Error('Your inquiry was saved, but its reference could not be confirmed. Please contact KOBAC SYSTEMS before submitting again.');
      }
      setReferenceId(savedReference);
    } catch (err) {
      submissionInProgress.current = false;
      setError(err instanceof Error ? err.message : 'Unable to submit your inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-20 px-6 max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <span className="bg-[#0B3B2C]/10 text-[#0B3B2C] px-3 py-1 rounded-full text-xs font-bold uppercase">KOBAC SYSTEMS Business Solutions</span>
        <h1 className="text-4xl font-black text-[#0B3B2C]">AI Project Scoping Wizard</h1>
        <p className="text-gray-600">Describe your operational challenge to receive a practical digital solution recommendation tailored to your organization.</p>
      </div>

      <div className="bg-[#F6F8F7] p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#0B3B2C]">Step 1: Select Your Business Solution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {solutionTypes.map(([type, description]) => (
                <button
                  key={type}
                  onClick={() => setFormData({ ...formData, solutionType: type })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    formData.solutionType === type ? 'bg-[#0B3B2C] text-white border-[#0B3B2C]' : 'bg-white text-gray-700 border-gray-200 hover:border-[#0B3B2C]'
                  }`}
                >
                  <span className="block font-semibold text-sm">{type}</span>
                  <span className={`block text-xs mt-1 leading-relaxed ${formData.solutionType === type ? 'text-gray-200' : 'text-gray-500'}`}>{description}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={() => setStep(2)} className="bg-[#0B3B2C] text-white px-6 py-3 rounded-xl font-bold text-sm">Next &rarr;</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#0B3B2C]">Step 2: Understand Your Business Problem</h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Organization Type</label>
              <select 
                value={formData.organizationType}
                onChange={e => setFormData({ ...formData, organizationType: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0B3B2C]"
              >
                <option>Small and Medium-Sized Business</option>
                <option>Corporate Enterprise</option>
                <option>Education / Nonprofit Organization</option>
                <option>Government / Public Sector</option>
                <option>Financial Institution</option>
                <option>Education Institution &amp; schools</option>
                <option>Other Organization</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Describe Your Business Challenge <span className="text-red-600">*</span></label>
              <textarea 
                rows={4}
                required
                minLength={MIN_PROJECT_CHALLENGE_LENGTH}
                maxLength={12000}
                value={formData.problemDescription}
                onChange={e => {
                  setFormData({ ...formData, problemDescription: e.target.value });
                  setError('');
                }}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0B3B2C]"
                placeholder="Describe how your organization currently operates, what problems you are experiencing, which processes are difficult to manage, and what you want to improve or automate."
              />
              <p className="text-xs text-gray-500 mt-2">You can mention manual processes, records, team coordination, approvals, reporting, software limitations, integrations, or the outcomes you want.</p>
              <p className={`mt-2 text-xs ${challengeLength < MIN_PROJECT_CHALLENGE_LENGTH ? 'text-amber-700' : 'text-emerald-700'}`}>
                {challengeLength < MIN_PROJECT_CHALLENGE_LENGTH
                  ? `Enter at least ${MIN_PROJECT_CHALLENGE_LENGTH} characters (${MIN_PROJECT_CHALLENGE_LENGTH - challengeLength} more needed).`
                  : `${challengeLength} characters — ready to generate.`}
              </p>
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm">&larr; Back</button>
              <button 
                onClick={handleGenerate} 
                disabled={generating}
                aria-busy={generating}
                className="bg-[#F5A623] hover:bg-[#e0961d] text-[#0B3B2C] px-8 py-3 rounded-xl font-bold text-sm shadow-lg"
              >
                {generating ? 'Generating Tailored Recommendation...' : 'Generate AI Architecture Scope'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            {referenceId ? (
              <div className="text-center space-y-4 py-8">
                <h3 className="text-2xl font-bold text-[#0B3B2C]">Project Inquiry Received</h3>
                <p className="text-gray-600">Thank you. The KOBAC SYSTEMS team will review your business challenge and recommendation.</p>
                <p className="font-bold text-[#0B3B2C]">Request reference: {referenceId}</p>
                <button onClick={() => setSubPage('home')} className="bg-[#0B3B2C] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg">Return to Website</button>
              </div>
            ) : (
              <>
            <h3 className="text-xl font-bold text-[#0B3B2C]">Business-Specific AI Recommendation</h3>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 space-y-2">
              <p><strong>Service:</strong> {formData.solutionType}</p>
              <p><strong>Organization:</strong> {formData.organizationType}</p>
              <p className="whitespace-pre-wrap"><strong>Business challenge:</strong> {formData.problemDescription}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-emerald-200 text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
              {recommendation}
            </div>
            <form onSubmit={handleSubmitRequest} className="border-t border-gray-200 pt-6 space-y-4">
              <h4 className="text-lg font-bold text-[#0B3B2C]">Review your details and save your inquiry</h4>
              <p className="text-sm text-gray-600">This saves your inquiry and AI recommendation only. KOBAC staff can review it in the Operations Portal under Communications &amp; Inquiries. It will not create a project automatically.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required maxLength={160} value={contactDetails.name} onChange={e => setContactDetails({ ...contactDetails, name: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm" placeholder="Your name" />
                <input required maxLength={200} value={contactDetails.organizationName} onChange={e => setContactDetails({ ...contactDetails, organizationName: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm" placeholder="Organization name" />
                <input required type="email" maxLength={254} value={contactDetails.email} onChange={e => setContactDetails({ ...contactDetails, email: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm" placeholder="Work email" />
                <input type="tel" maxLength={40} value={contactDetails.phone} onChange={e => setContactDetails({ ...contactDetails, phone: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm" placeholder="Phone (optional)" />
              </div>
              <div className="flex justify-between pt-2">
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => { setError(''); setStep(1); }} className="border border-gray-300 text-gray-700 px-4 py-3 rounded-xl font-bold text-sm">&larr; Change Service</button>
                  <button type="button" onClick={() => { setError(''); setStep(2); }} className="border border-gray-300 text-gray-700 px-4 py-3 rounded-xl font-bold text-sm">Edit Challenge</button>
                </div>
                <button type="submit" disabled={submitting} className="bg-[#0B3B2C] disabled:opacity-60 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg">
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
              </>
            )}
          </div>
        )}
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">{error}</p>}
      </div>
    </div>
  );
}

// ==========================================
// OPERATIONS PORTAL COMPONENT
// ==========================================

function LoginScreen({ onLoginSuccess, showNotification }: { onLoginSuccess: (user: User) => void; showNotification: (msg: string, type?: 'success' | 'error') => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const responseText = await res.text();
      let data: { success?: boolean; user?: User; error?: string };
      try {
        data = JSON.parse(responseText) as typeof data;
      } catch {
        throw new Error(`Login service returned a non-JSON response (HTTP ${res.status}). The deployment API route may not be configured.`);
      }
      if (res.ok && data.success && data.user) {
        showNotification(`Welcome back, ${data.user.name}!`);
        onLoginSuccess(data.user);
      } else {
        showNotification(data.error || 'Invalid credentials', 'error');
      }
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Login connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F6F8F7]">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-200 p-8 space-y-8 animate-in fade-in">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <KobacLogo showText={false} darkText size="large" />
          </div>
          <h2 className="text-2xl font-black text-[#0B3B2C]">Operations Portal Login</h2>
          <p className="text-xs text-gray-500 font-medium">Secure Authentication for Kobac Systems Authorized Personnel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Staff Email</label>
            <input 
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0B3B2C]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Password</label>
            <input 
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0B3B2C]"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0B3B2C] hover:bg-[#144f3d] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

      </div>
    </div>
  );
}

// ==========================================
// OPERATIONS PORTAL COMPONENT
// ==========================================

function OperationsPortal({ 
  activeTab, setActiveTab, users, clients, documents, negotiations, 
  projects, tasks, contracts, boardMembers, meetings, reminders, auditLogs, portfolio, reports, companySettings, currentUser, onLogout, onRefresh, showNotification 
}: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  users: User[];
  clients: Client[];
  documents: DocumentItem[];
  negotiations: Negotiation[];
  projects: Project[];
  tasks: TaskItem[];
  contracts: Contract[];
  boardMembers: BoardMember[];
  meetings: MeetingItem[];
  reminders: ReminderItem[];
  auditLogs: AuditLog[];
  portfolio: PortfolioItem[];
  reports: ReportItem[];
  companySettings: CompanySettings | null;
  currentUser: User;
  onLogout: () => void;
  onRefresh: () => Promise<void>;
  showNotification: (msg: string, type?: 'success' | 'error') => void;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const tabs = [
    { id: 'overview', label: 'Overview Dashboard' },
    { id: 'clients', label: 'Clients & CRM' },
    { id: 'documents', label: 'Central Document Management' },
    { id: 'negotiations', label: 'Negotiations Tracker' },
    { id: 'projects', label: 'Projects & Milestones' },
    { id: 'tasks', label: 'Tasks & Operations' },
    { id: 'communications', label: 'Communications & Inquiries' },
    { id: 'reports', label: 'Reports & Presentations' },
    { id: 'board', label: 'Board Members & Governance' },
    { id: 'contracts', label: 'Contracts & Agreements' },
    { id: 'meetings', label: 'Meetings & Minutes' },
    { id: 'reminders', label: 'Reminders & Calendar' },
    { id: 'team', label: 'Team & Permissions' },
    { id: 'audit', label: 'Audit Logs' },
    { id: 'settings', label: 'Company Settings' },
  ];

  const currentTabLabel = tabs.find(t => t.id === activeTab)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#F6F8F7] flex flex-col md:flex-row relative">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0B3B2C] text-white px-4 py-3 flex items-center justify-between border-b border-[#144f3d] sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 bg-[#144f3d] text-white rounded-xl focus:outline-none hover:bg-[#1b634e] transition-colors"
            aria-label="Toggle Navigation Drawer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              )}
            </svg>
          </button>
          <div>
            <span className="text-[11px] uppercase font-bold text-[#F5A623] tracking-wider">Operations Portal</span>
            <h2 className="font-bold text-sm leading-tight text-white">{currentTabLabel}</h2>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0B3B2C] text-white flex-shrink-0 flex flex-col justify-between border-r border-[#144f3d] transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <KobacLogo showText={false} />
              <div>
                <h2 className="font-bold text-base leading-tight">Operations Portal</h2>
                <p className="text-xs text-gray-300">Enterprise Control Center</p>
              </div>
            </div>
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-gray-300 hover:text-white p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <nav className="space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  activeTab === tab.id ? 'bg-[#F5A623] text-[#0B3B2C] shadow-lg font-bold' : 'text-gray-300 hover:bg-[#144f3d] hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                {activeTab === tab.id && <span className="w-2 h-2 rounded-full bg-[#0B3B2C]"></span>}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6 border-t border-[#144f3d] space-y-3 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-xl object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[#F5A623] text-[#0B3B2C] font-black flex items-center justify-center">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[11px] text-gray-300 truncate">{currentUser.title}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>Sign Out (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {activeTab === 'overview' && <OverviewDashboard clients={clients} projects={projects} tasks={tasks} contracts={contracts} />}
          {activeTab === 'clients' && <ClientsModule clients={clients} users={users} onRefresh={onRefresh} showNotification={showNotification} />}
          {activeTab === 'documents' && <DocumentsModule documents={documents} onRefresh={onRefresh} showNotification={showNotification} />}
          {activeTab === 'negotiations' && <NegotiationsModule negotiations={negotiations} onRefresh={onRefresh} showNotification={showNotification} />}
          {activeTab === 'projects' && <ProjectsModule projects={projects} users={users} onRefresh={onRefresh} showNotification={showNotification} />}
          {activeTab === 'tasks' && <TasksModule tasks={tasks} users={users} onRefresh={onRefresh} showNotification={showNotification} />}
          {activeTab === 'communications' && <CommunicationsModule users={users} onRefresh={onRefresh} setActiveTab={setActiveTab} showNotification={showNotification} />}
          {activeTab === 'reports' && <ReportsModule reports={reports} projects={projects} clients={clients} contracts={contracts} auditLogs={auditLogs} onRefresh={onRefresh} showNotification={showNotification} />}
          {activeTab === 'board' && <BoardModule boardMembers={boardMembers} onRefresh={onRefresh} showNotification={showNotification} />}
          {activeTab === 'contracts' && <ContractsModule contracts={contracts} clients={clients} onRefresh={onRefresh} showNotification={showNotification} />}
          {activeTab === 'meetings' && <MeetingsModule meetings={meetings} onRefresh={onRefresh} showNotification={showNotification} />}
          {activeTab === 'reminders' && <RemindersModule reminders={reminders} onRefresh={onRefresh} showNotification={showNotification} />}
          {activeTab === 'team' && <TeamModule users={users} onRefresh={onRefresh} showNotification={showNotification} />}
          {activeTab === 'audit' && <AuditLogsModule auditLogs={auditLogs} />}
          {activeTab === 'settings' && <SettingsModule companySettings={companySettings} onRefresh={onRefresh} showNotification={showNotification} />}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// 1. OVERVIEW DASHBOARD
// ==========================================

function OverviewDashboard({ clients, projects, tasks, contracts }: { clients: Client[]; projects: Project[]; tasks: TaskItem[]; contracts: Contract[] }) {
  const activeProjectsCount = projects.filter(p => p.status === 'In Progress').length;
  const activeContractsValue = contracts.reduce((acc, c) => acc + (parseFloat(c.value.replace(/[^0-9.]/g, '')) || 0), 0);
  const pendingTasksCount = tasks.filter(t => t.status !== 'Completed').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-[#0B3B2C]">Overview Dashboard</h1>
        <p className="text-gray-600 text-sm">Real-time enterprise intelligence and operational metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase">Total Clients</p>
          <p className="text-3xl font-black text-[#0B3B2C]">{clients.length}</p>
          <p className="text-xs text-emerald-600 font-semibold">+12% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase">Active Projects</p>
          <p className="text-3xl font-black text-[#0B3B2C]">{activeProjectsCount}</p>
          <p className="text-xs text-emerald-600 font-semibold">{projects.length} total projects</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase">Pending Tasks</p>
          <p className="text-3xl font-black text-[#0B3B2C]">{pendingTasksCount}</p>
          <p className="text-xs text-amber-600 font-semibold">{tasks.length} total assigned</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase">Active Contracts Value</p>
          <p className="text-3xl font-black text-[#0B3B2C]">${activeContractsValue.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 font-semibold">{contracts.length} active agreements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-[#0B3B2C]">Recent Projects</h3>
          <div className="space-y-3">
            {projects.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <h4 className="font-bold text-sm text-[#0B3B2C]">{p.name}</h4>
                  <p className="text-xs text-gray-500">{p.client}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">{p.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-[#0B3B2C]">Priority Tasks</h3>
          <div className="space-y-3">
            {tasks.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <h4 className="font-bold text-sm text-[#0B3B2C]">{t.title}</h4>
                  <p className="text-xs text-gray-500">Assigned to: {t.assigned_to}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  t.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                }`}>{t.priority}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. CLIENTS & CRM MODULE
// ==========================================

function ClientsModule({ clients, users, onRefresh, showNotification }: { clients: Client[]; users: User[]; onRefresh: () => void; showNotification: (m: string, t?: any) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '', org_name: '', contact_person: '', email: '', phone: '', location: '', industry: 'Technology', client_type: 'Corporate', requirements: '', status: 'Prospect'
  });

  const handleOpenAdd = () => {
    setEditingClient(null);
    setFormData({ name: '', org_name: '', contact_person: '', email: '', phone: '', location: '', industry: 'Technology', client_type: 'Corporate', requirements: '', status: 'Prospect' });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Client) => {
    setEditingClient(c);
    setFormData({
      name: c.name, org_name: c.org_name, contact_person: c.contact_person, email: c.email, phone: c.phone, location: c.location, industry: c.industry, client_type: c.client_type, requirements: c.requirements, status: c.status
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    try {
      await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      showNotification('Client deleted successfully');
      onRefresh();
    } catch (err) {
      showNotification('Failed to delete client', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingClient ? `/api/clients/${editingClient.id}` : '/api/clients';
      const method = editingClient ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        showNotification(editingClient ? 'Client updated successfully' : 'Client created successfully');
        setModalOpen(false);
        onRefresh();
      }
    } catch (err) {
      showNotification('Operation failed', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#0B3B2C]">Clients & CRM</h1>
          <p className="text-gray-600 text-sm">Manage enterprise clients, partner organizations, and lead statuses.</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-[#0B3B2C] hover:bg-[#144f3d] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md">
          + Add New Client
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
              <th className="p-4">Organization / Client</th>
              <th className="p-4">Contact Person</th>
              <th className="p-4">Email & Phone</th>
              <th className="p-4">Industry</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {clients.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-bold text-[#0B3B2C]">{c.org_name}</div>
                  <div className="text-xs text-gray-500">{c.location}</div>
                </td>
                <td className="p-4 font-medium">{c.contact_person}</td>
                <td className="p-4">
                  <div className="text-xs text-gray-700">{c.email}</div>
                  <div className="text-xs text-gray-500">{c.phone}</div>
                </td>
                <td className="p-4">
                  <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">{c.industry}</span>
                </td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>{c.status}</span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleOpenEdit(c)} className="text-blue-600 hover:underline font-semibold text-xs">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline font-semibold text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#0B3B2C]">{editingClient ? 'Edit Client' : 'Add New Client'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Organization Name</label>
                <input type="text" required value={formData.org_name} onChange={e => setFormData({ ...formData, org_name: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Person</label>
                  <input type="text" required value={formData.contact_person} onChange={e => setFormData({ ...formData, contact_person: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Industry</label>
                  <input type="text" required value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone</label>
                  <input type="text" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Location</label>
                  <input type="text" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm">
                    <option>Prospect</option>
                    <option>Active</option>
                    <option>Archived</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Requirements</label>
                <textarea rows={3} value={formData.requirements} onChange={e => setFormData({ ...formData, requirements: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-sm">Cancel</button>
                <button type="submit" className="bg-[#0B3B2C] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">Save Client</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. CENTRAL DOCUMENT MANAGEMENT MODULE
// ==========================================

function DocumentsModule({ documents, onRefresh, showNotification }: { documents: DocumentItem[]; onRefresh: () => void; showNotification: (m: string, t?: any) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [formData, setFormData] = useState({
    title: '', reference: '', category: 'Policy', description: '', owner: 'Admin', department: 'Executive', confidentiality: 'Confidential', status: 'Approved', version: '1.0'
  });

  const handleOpenAdd = () => {
    setEditingDoc(null);
    setFormData({ title: '', reference: `DOC-${Math.floor(1000 + Math.random() * 9000)}`, category: 'Policy', description: '', owner: 'Admin', department: 'Executive', confidentiality: 'Confidential', status: 'Approved', version: '1.0' });
    setModalOpen(true);
  };

  const handleOpenEdit = (d: DocumentItem) => {
    setEditingDoc(d);
    setFormData({
      title: d.title, reference: d.reference, category: d.category, description: d.description || '', owner: d.owner, department: d.department, confidentiality: d.confidentiality, status: d.status, version: d.version
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      showNotification('Document deleted successfully');
      onRefresh();
    } catch (err) {
      showNotification('Failed to delete document', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingDoc ? `/api/documents/${editingDoc.id}` : '/api/documents';
      const method = editingDoc ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        showNotification(editingDoc ? 'Document updated successfully' : 'Document uploaded successfully');
        setModalOpen(false);
        onRefresh();
      }
    } catch (err) {
      showNotification('Operation failed', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#0B3B2C]">Central Document Management</h1>
          <p className="text-gray-600 text-sm">Secure enterprise repository for policies, agreements, and deliverables.</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-[#0B3B2C] hover:bg-[#144f3d] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md">
          + Upload Document
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
              <th className="p-4">Document Title & Ref</th>
              <th className="p-4">Category</th>
              <th className="p-4">Department</th>
              <th className="p-4">Confidentiality</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {documents.map(d => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-bold text-[#0B3B2C]">{d.title}</div>
                  <div className="text-xs text-gray-500 font-mono">{d.reference} (v{d.version})</div>
                </td>
                <td className="p-4"><span className="bg-gray-100 px-2.5 py-1 rounded-full text-xs font-semibold">{d.category}</span></td>
                <td className="p-4 font-medium">{d.department}</td>
                <td className="p-4"><span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold">{d.confidentiality}</span></td>
                <td className="p-4"><span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold">{d.status}</span></td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleOpenEdit(d)} className="text-blue-600 hover:underline font-semibold text-xs">Edit</button>
                  <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:underline font-semibold text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#0B3B2C]">{editingDoc ? 'Edit Document' : 'Upload New Document'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Document Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Reference Code</label>
                  <input type="text" required value={formData.reference} onChange={e => setFormData({ ...formData, reference: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm">
                    <option>Policy</option>
                    <option>Contract</option>
                    <option>Financial</option>
                    <option>Technical</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Department</label>
                  <input type="text" required value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confidentiality</label>
                  <select value={formData.confidentiality} onChange={e => setFormData({ ...formData, confidentiality: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm">
                    <option>Internal</option>
                    <option>Confidential</option>
                    <option>Restricted</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-sm">Cancel</button>
                <button type="submit" className="bg-[#0B3B2C] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">Save Document</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. NEGOTIATIONS TRACKER MODULE
// ==========================================

function NegotiationsModule({ negotiations, onRefresh, showNotification }: { negotiations: Negotiation[]; onRefresh: () => void; showNotification: (m: string, t?: any) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNeg, setEditingNeg] = useState<Negotiation | null>(null);
  const [formData, setFormData] = useState({
    title: '', client: '', opportunity: '', owner: 'Admin', client_requirements: '', initial_proposal: '', status: 'In Discussion'
  });

  const handleOpenAdd = () => {
    setEditingNeg(null);
    setFormData({ title: '', client: '', opportunity: '', owner: 'Admin', client_requirements: '', initial_proposal: '', status: 'In Discussion' });
    setModalOpen(true);
  };

  const handleOpenEdit = (n: Negotiation) => {
    setEditingNeg(n);
    setFormData({
      title: n.title, client: n.client, opportunity: n.opportunity, owner: n.owner, client_requirements: n.client_requirements || '', initial_proposal: n.initial_proposal || '', status: n.status
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingNeg ? `/api/negotiations/${editingNeg.id}` : '/api/negotiations';
      const method = editingNeg ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, participants: ['Admin', formData.client], meeting_date: '2026-10-25' })
      });
      if (res.ok) {
        showNotification(editingNeg ? 'Negotiation updated successfully' : 'Negotiation created successfully');
        setModalOpen(false);
        onRefresh();
      }
    } catch (err) {
      showNotification('Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete negotiation item?')) return;
    await fetch(`/api/negotiations/${id}`, { method: 'DELETE' });
    showNotification('Negotiation deleted');
    onRefresh();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#0B3B2C]">Negotiations Tracker</h1>
          <p className="text-gray-600 text-sm">Track deals, counter-offers, requirements, and next steps.</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-[#0B3B2C] hover:bg-[#144f3d] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md">
          + Add Negotiation
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
              <th className="p-4">Title / Opportunity</th>
              <th className="p-4">Client</th>
              <th className="p-4">Owner</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {negotiations.map(n => (
              <tr key={n.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-bold text-[#0B3B2C]">{n.title}</div>
                  <div className="text-xs text-gray-500">{n.opportunity}</div>
                </td>
                <td className="p-4 font-medium">{n.client}</td>
                <td className="p-4 text-xs text-gray-600">{n.owner}</td>
                <td className="p-4"><span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">{n.status}</span></td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleOpenEdit(n)} className="text-blue-600 hover:underline font-semibold text-xs">Edit</button>
                  <button onClick={() => handleDelete(n.id)} className="text-red-600 hover:underline font-semibold text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#0B3B2C]">{editingNeg ? 'Edit Negotiation' : 'Add New Negotiation'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Client</label>
                  <input type="text" required value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Opportunity</label>
                  <input type="text" required value={formData.opportunity} onChange={e => setFormData({ ...formData, opportunity: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Client Requirements</label>
                <textarea rows={3} value={formData.client_requirements} onChange={e => setFormData({ ...formData, client_requirements: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-sm">Cancel</button>
                <button type="submit" className="bg-[#0B3B2C] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">Save Negotiation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. PROJECTS & MILESTONES MODULE
// ==========================================

function ProjectsModule({ projects, users, onRefresh, showNotification }: { projects: Project[]; users: User[]; onRefresh: () => void; showNotification: (m: string, t?: any) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '', client: '', scope: '', owner: 'Admin', start_date: '2026-10-01', target_date: '2026-12-31', budget: '$50,000', status: 'In Progress'
  });

  const handleOpenAdd = () => {
    setEditingProj(null);
    setFormData({ name: '', client: '', scope: '', owner: 'Admin', start_date: '2026-10-01', target_date: '2026-12-31', budget: '$50,000', status: 'In Progress' });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Project) => {
    setEditingProj(p);
    setFormData({
      name: p.name, client: p.client, scope: p.scope, owner: p.owner, start_date: p.start_date, target_date: p.target_date, budget: p.budget || '$50,000', status: p.status
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProj ? `/api/projects/${editingProj.id}` : '/api/projects';
      const method = editingProj ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, team: ['Admin'], milestones: editingProj?.milestones || [{ id: '1', title: 'Phase 1 Complete', dueDate: '2026-11-01', completed: false }] })
      });
      if (res.ok) {
        showNotification(editingProj ? 'Project updated successfully' : 'Project created successfully');
        setModalOpen(false);
        onRefresh();
      }
    } catch (err) {
      showNotification('Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete project?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    showNotification('Project deleted');
    onRefresh();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#0B3B2C]">Projects & Milestones</h1>
          <p className="text-gray-600 text-sm">End-to-end execution tracking, timelines, and milestones.</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-[#0B3B2C] hover:bg-[#144f3d] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md">
          + Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#0B3B2C]">{p.name}</h3>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">{p.status}</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">Client: {p.client} | Owner: {p.owner}</p>
            <p className="text-sm text-gray-700">{p.scope}</p>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Target: {p.target_date}</span>
              <div className="space-x-2">
                <button onClick={() => handleOpenEdit(p)} className="text-blue-600 hover:underline font-semibold">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline font-semibold">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#0B3B2C]">{editingProj ? 'Edit Project' : 'Add New Project'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Project Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Client</label>
                  <input type="text" required value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Budget</label>
                  <input type="text" required value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Scope</label>
                <textarea rows={3} value={formData.scope} onChange={e => setFormData({ ...formData, scope: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-sm">Cancel</button>
                <button type="submit" className="bg-[#0B3B2C] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. TASKS & OPERATIONS MODULE
// ==========================================

function TasksModule({ tasks, users, onRefresh, showNotification }: { tasks: TaskItem[]; users: User[]; onRefresh: () => void; showNotification: (m: string, t?: any) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', assigned_to: 'Admin', priority: 'Medium', due_date: '2026-10-30', status: 'Not Started'
  });

  const handleOpenAdd = () => {
    setEditingTask(null);
    setFormData({ title: '', description: '', assigned_to: 'Admin', priority: 'Medium', due_date: '2026-10-30', status: 'Not Started' });
    setModalOpen(true);
  };

  const handleOpenEdit = (t: TaskItem) => {
    setEditingTask(t);
    setFormData({
      title: t.title, description: t.description || '', assigned_to: t.assigned_to, priority: t.priority, due_date: t.due_date, status: t.status
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTask ? `/api/tasks/${editingTask.id}` : '/api/tasks';
      const method = editingTask ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, created_by: 'Admin', client_or_project: 'General', progress: editingTask?.progress || 0 })
      });
      if (res.ok) {
        showNotification(editingTask ? 'Task updated successfully' : 'Task created successfully');
        setModalOpen(false);
        onRefresh();
      }
    } catch (err) {
      showNotification('Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete task?')) return;
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    showNotification('Task deleted');
    onRefresh();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#0B3B2C]">Tasks & Operations</h1>
          <p className="text-gray-600 text-sm">Assign, track, and manage team operational tasks.</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-[#0B3B2C] hover:bg-[#144f3d] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md">
          + Add Task
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
              <th className="p-4">Task Title</th>
              <th className="p-4">Assigned To</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {tasks.map(t => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="p-4 font-bold text-[#0B3B2C]">{t.title}</td>
                <td className="p-4 font-medium">{t.assigned_to}</td>
                <td className="p-4 text-xs text-gray-600">{t.due_date}</td>
                <td className="p-4"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${t.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>{t.priority}</span></td>
                <td className="p-4"><span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">{t.status}</span></td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleOpenEdit(t)} className="text-blue-600 hover:underline font-semibold text-xs">Edit</button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline font-semibold text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#0B3B2C]">{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Task Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Assigned To</label>
                  <input type="text" required value={formData.assigned_to} onChange={e => setFormData({ ...formData, assigned_to: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Priority</label>
                  <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-sm">Cancel</button>
                <button type="submit" className="bg-[#0B3B2C] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 7. COMMUNICATIONS & INQUIRIES MODULE
// ==========================================

function CommunicationsModule({ users, onRefresh, setActiveTab, showNotification }: { users: User[]; onRefresh: () => Promise<void>; setActiveTab: (tab: string) => void; showNotification: (m: string, t?: any) => void }) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadError, setLoadError] = useState('');
  const [convertingId, setConvertingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/contact-submissions')
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load inquiries.');
        setSubmissions(data);
      })
      .catch(err => setLoadError(err instanceof Error ? err.message : 'Unable to load inquiries.'));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/contact-submissions/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to delete inquiry.');
      setSubmissions(current => current.filter(s => s.id !== id));
      showNotification('Inquiry deleted');
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Unable to delete inquiry.', 'error');
    }
  };

  const handleUpdate = async (submission: any) => {
    try {
      const response = await fetch(`/api/contact-submissions/${submission.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: ['Converted', 'Converting'].includes(submission.status) ? undefined : submission.status,
          assignedStaffId: submission.assigned_staff_id || null,
          internalNotes: submission.internal_notes || ''
        })
      });
      const updated = await response.json();
      if (!response.ok) throw new Error(updated.error || 'Unable to update inquiry.');
      setSubmissions(current => current.map(item => item.id === updated.id ? updated : item));
      showNotification('Inquiry updated');
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Unable to update inquiry.', 'error');
    }
  };

  const handleConvertToProject = async (e: React.FormEvent, submission: any) => {
    e.preventDefault();
    setConvertingId(submission.id);
    try {
      const response = await fetch(`/api/contact-submissions/${submission.id}/convert-to-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: submission.projectNameDraft || '',
          ownerId: submission.projectOwnerDraft || '',
          startDate: submission.projectStartDraft || '',
          targetDate: submission.projectTargetDraft || ''
        })
      });
      const updated = await response.json();
      if (!response.ok) throw new Error(updated.error || 'Unable to create project from inquiry.');
      setSubmissions(current => current.map(item => item.id === updated.id ? updated : item));
      await onRefresh();
      showNotification('Project created from accepted inquiry');
      setActiveTab('projects');
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Unable to create project from inquiry.', 'error');
    } finally {
      setConvertingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-[#0B3B2C]">Communications & Inquiries</h1>
        <p className="text-gray-600 text-sm">Review contact messages and AI-scoped business project inquiries.</p>
      </div>

      {loadError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">{loadError}</p>}
      {!loadError && submissions.length === 0 && <p className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">No inquiries have been received yet.</p>}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {submissions.map(s => (
          <article key={s.id} className="border-b border-gray-100 p-6 last:border-b-0 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-bold text-[#0B3B2C]">{s.organization_name || s.name}</h2>
                  {s.request_reference && <span className="rounded-full bg-[#0B3B2C]/10 px-3 py-1 text-xs font-bold text-[#0B3B2C]">{s.request_reference}</span>}
                </div>
                <p className="text-sm text-gray-600">{s.name} · {s.email}{s.phone ? ` · ${s.phone}` : ''}</p>
                <p className="mt-1 text-xs text-gray-500">{s.created_at ? new Date(s.created_at).toLocaleString() : ''}</p>
              </div>
              <button onClick={() => handleDelete(s.id)} className="text-xs font-semibold text-red-600 hover:underline">Delete</button>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <p className="text-sm font-semibold">{s.subject || 'Website inquiry'}</p>
                {s.solution_type && <p className="text-sm text-gray-600"><strong>Service:</strong> {s.solution_type}<br /><strong>Organization:</strong> {s.organization_type}</p>}
                <div>
                  <h3 className="text-xs font-bold uppercase text-gray-500">Business challenge</h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{s.message}</p>
                </div>
                {s.recommendation && (
                  <details className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <summary className="cursor-pointer text-sm font-bold text-[#0B3B2C]">AI Recommendation</summary>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{s.recommendation}</p>
                  </details>
                )}
              </div>
              <div className="space-y-3 rounded-xl bg-gray-50 p-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Request Status</label>
                  <select value={s.status} onChange={e => setSubmissions(current => current.map(item => item.id === s.id ? { ...item, status: e.target.value } : item))} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" disabled={s.status === 'Converted' || s.status === 'Converting'}>
                    {['New', 'In Review', 'Accepted', 'Declined', 'Unread', 'Converted', 'Converting'].map(status => <option key={status}>{status}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Assigned Staff</label>
                  <select value={s.assigned_staff_id || ''} onChange={e => setSubmissions(current => current.map(item => item.id === s.id ? { ...item, assigned_staff_id: e.target.value || null } : item))} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
                    <option value="">Unassigned</option>
                    {users.filter(user => user.active).map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Internal Notes</label>
                  <textarea rows={3} maxLength={5000} value={s.internal_notes || ''} onChange={e => setSubmissions(current => current.map(item => item.id === s.id ? { ...item, internal_notes: e.target.value } : item))} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" placeholder="Staff-only follow-up notes" />
                </div>
                <button onClick={() => handleUpdate(s)} className="rounded-lg bg-[#0B3B2C] px-4 py-2 text-sm font-bold text-white">Save Updates</button>
              </div>
            </div>
            {s.status === 'Accepted' && !s.project_id && (
              <form onSubmit={e => handleConvertToProject(e, s)} className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
                <h3 className="font-bold text-[#0B3B2C]">Move accepted inquiry into Projects</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <input required maxLength={200} value={s.projectNameDraft ?? `${s.organization_name || s.name} Business Solution`} onChange={e => setSubmissions(current => current.map(item => item.id === s.id ? { ...item, projectNameDraft: e.target.value } : item))} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" placeholder="Project name" />
                  <select required value={s.projectOwnerDraft ?? s.assigned_staff_id ?? ''} onChange={e => setSubmissions(current => current.map(item => item.id === s.id ? { ...item, projectOwnerDraft: e.target.value } : item))} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
                    <option value="">Choose a project owner</option>
                    {users.filter(user => user.active).map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                  </select>
                  <label className="text-xs font-semibold text-gray-600">Start date<input required type="date" value={s.projectStartDraft || ''} onChange={e => setSubmissions(current => current.map(item => item.id === s.id ? { ...item, projectStartDraft: e.target.value } : item))} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" /></label>
                  <label className="text-xs font-semibold text-gray-600">Target date<input required type="date" min={s.projectStartDraft || undefined} value={s.projectTargetDraft || ''} onChange={e => setSubmissions(current => current.map(item => item.id === s.id ? { ...item, projectTargetDraft: e.target.value } : item))} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" /></label>
                </div>
                <button type="submit" disabled={convertingId === s.id} className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-bold text-white disabled:opacity-60">{convertingId === s.id ? 'Creating Project...' : 'Create Client & Project'}</button>
              </form>
            )}
            {s.status === 'Converted' && s.project_id && <p className="rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">This inquiry has been converted to a project. Project ID: {s.project_id}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 8. REPORTS & PRESENTATIONS MODULE
// ==========================================

function ReportsModule({ reports = [], projects, clients, contracts, auditLogs, onRefresh, showNotification }: {
  reports: ReportItem[];
  projects: Project[];
  clients: Client[];
  contracts: Contract[];
  auditLogs: AuditLog[];
  onRefresh: () => Promise<void>;
  showNotification: (message: string, type?: 'success' | 'error') => void;
}) {
  const emptyDraft = { reportType: 'custom' as ReportType, title: '', description: '', content: '' };
  const [editingReport, setEditingReport] = useState<ReportItem | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingReport(null);
    setDraft(emptyDraft);
    setModalOpen(true);
  };

  const openEdit = (report: ReportItem) => {
    setEditingReport(report);
    setDraft({
      reportType: report.report_type,
      title: report.title,
      description: report.description,
      content: report.content
    });
    setModalOpen(true);
  };

  const saveReport = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(editingReport ? `/api/reports/${editingReport.id}` : '/api/reports', {
        method: editingReport ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to save report.');
      await onRefresh();
      setModalOpen(false);
      showNotification(editingReport ? 'Report updated successfully.' : 'Report created successfully.');
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'Unable to save report.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteReport = async (report: ReportItem) => {
    if (!window.confirm(`Delete "${report.title}"? This cannot be undone.`)) return;
    try {
      const response = await fetch(`/api/reports/${report.id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to delete report.');
      await onRefresh();
      showNotification('Report deleted successfully.');
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'Unable to delete report.', 'error');
    }
  };

  const csvRows = (report: ReportItem): string[][] => {
    if (report.report_type === 'financial') {
      return [
        ['Reference', 'Title', 'Client', 'Project', 'Value', 'Status', 'Approval status', 'Start date', 'Expiration date'],
        ...contracts.map(contract => [
          contract.reference, contract.title, contract.client, contract.project || '',
          contract.value, contract.status, contract.approval_status, contract.start_date, contract.expiration_date
        ])
      ];
    }
    if (report.report_type === 'audit') {
      return [
        ['Timestamp', 'Action', 'Actor', 'IP address'],
        ...auditLogs.map(log => [log.timestamp, log.action, log.actor, log.ip])
      ];
    }
    if (report.report_type === 'executive') {
      return [
        ['Metric', 'Value'],
        ['Clients', String(clients.length)],
        ['Projects', String(projects.length)],
        ['Contracts', String(contracts.length)],
        ['Active contracts', String(contracts.filter(contract => contract.status.toLowerCase() === 'active').length)],
        ['Report notes', report.content]
      ];
    }
    return [['Title', 'Description', 'Content'], [report.title, report.description, report.content]];
  };

  const downloadCsv = (report: ReportItem) => {
    const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csv = csvRows(report).map(row => row.map(escapeCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const printReport = (report: ReportItem) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showNotification('Allow pop-ups to print or save this report as PDF.', 'error');
      return;
    }
    const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char] || char);
    const reportDetails = report.report_type === 'executive'
      ? `<h2>Overview</h2><p>Clients: ${clients.length} &nbsp; Projects: ${projects.length} &nbsp; Contracts: ${contracts.length}</p><h2>Projects</h2><ul>${projects.map(project => `<li>${escapeHtml(project.name)} — ${escapeHtml(project.status)} (Client: ${escapeHtml(project.client)})</li>`).join('')}</ul><h2>Clients</h2><ul>${clients.map(client => `<li>${escapeHtml(client.name)} — ${escapeHtml(client.org_name)} (${escapeHtml(client.status)})</li>`).join('')}</ul>`
      : report.report_type === 'financial'
        ? `<h2>Contracts</h2><table><thead><tr><th>Reference</th><th>Title</th><th>Client</th><th>Value</th><th>Status</th><th>Expires</th></tr></thead><tbody>${contracts.map(contract => `<tr><td>${escapeHtml(contract.reference)}</td><td>${escapeHtml(contract.title)}</td><td>${escapeHtml(contract.client)}</td><td>${escapeHtml(contract.value)}</td><td>${escapeHtml(contract.status)}</td><td>${escapeHtml(contract.expiration_date)}</td></tr>`).join('')}</tbody></table>`
        : report.report_type === 'audit'
          ? `<h2>Audit log</h2><table><thead><tr><th>Timestamp</th><th>Action</th><th>Actor</th><th>IP address</th></tr></thead><tbody>${auditLogs.map(log => `<tr><td>${escapeHtml(log.timestamp)}</td><td>${escapeHtml(log.action)}</td><td>${escapeHtml(log.actor)}</td><td>${escapeHtml(log.ip)}</td></tr>`).join('')}</tbody></table>`
          : '';
    printWindow.document.write(`<!doctype html><html><head><title>${escapeHtml(report.title)}</title><style>body{font:14px Arial,sans-serif;color:#17231f;margin:40px}h1{color:#0b3b2c}h2{margin-top:28px;color:#0b3b2c}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccd5d0;padding:8px;text-align:left}th{background:#edf3ef}.notes{white-space:pre-wrap;margin-top:24px}@media print{body{margin:18mm}}</style></head><body><h1>${escapeHtml(report.title)}</h1><p>${escapeHtml(report.description)}</p>${reportDetails}${report.content ? `<h2>Notes</h2><p class="notes">${escapeHtml(report.content)}</p>` : ''}<script>window.onload=()=>window.print()</script></body></html>`);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0B3B2C]">Reports & Presentations</h1>
          <p className="text-gray-600 text-sm">Create, edit, and download reports using live dashboard data.</p>
        </div>
        <button onClick={openCreate} className="rounded-xl bg-[#0B3B2C] px-5 py-3 text-sm font-bold text-white hover:bg-[#144f3d]">Create Report</button>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">No reports have been created yet.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reports.map(report => (
            <article key={report.id} className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex-1">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-800">{report.report_type} report</p>
                <h3 className="text-lg font-bold text-[#0B3B2C]">{report.title}</h3>
                <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-gray-600">{report.description}</p>
                {report.content && <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-xs text-gray-500">{report.content}</p>}
              </div>
              <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                <button onClick={() => printReport(report)} className="rounded-lg bg-[#0B3B2C] px-3 py-2 text-xs font-bold text-white">Print / Save PDF</button>
                <button onClick={() => downloadCsv(report)} className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900">Download CSV</button>
                <button onClick={() => openEdit(report)} className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700">Edit</button>
                <button onClick={() => void deleteReport(report)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700">Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="report-editor-title">
          <form onSubmit={saveReport} className="max-h-[90vh] w-full max-w-xl space-y-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <h2 id="report-editor-title" className="text-xl font-black text-[#0B3B2C]">{editingReport ? 'Edit Report' : 'Create Report'}</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100" aria-label="Close report editor">Close</button>
            </div>
            <label className="block text-xs font-bold text-gray-700">Report type
              <select value={draft.reportType} onChange={event => setDraft({ ...draft, reportType: event.target.value as ReportType })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <option value="executive">Executive summary</option><option value="financial">Financial contracts</option><option value="audit">Operations audit</option><option value="custom">Custom report</option>
              </select>
            </label>
            <label className="block text-xs font-bold text-gray-700">Title
              <input required maxLength={160} value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </label>
            <label className="block text-xs font-bold text-gray-700">Description
              <textarea required maxLength={1000} rows={2} value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </label>
            <label className="block text-xs font-bold text-gray-700">Report notes / content
              <textarea maxLength={20000} rows={6} value={draft.content} onChange={event => setDraft({ ...draft, content: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700">Cancel</button>
              <button type="submit" disabled={saving} className="rounded-xl bg-[#0B3B2C] px-5 py-2 text-sm font-bold text-white disabled:opacity-60">{saving ? 'Saving...' : 'Save Report'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 9. BOARD MEMBERS & GOVERNANCE MODULE
// ==========================================

function BoardModule({ boardMembers, onRefresh, showNotification }: { boardMembers: BoardMember[]; onRefresh: () => void; showNotification: (m: string, t?: any) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<BoardMember | null>(null);
  const [formData, setFormData] = useState({
    name: '', position: 'Board Member', appointment_date: '2025-01-01', contact: '', bio: '', status: 'Active'
  });

  const handleOpenAdd = () => {
    setEditingBoard(null);
    setFormData({ name: '', position: 'Board Member', appointment_date: '2025-01-01', contact: '', bio: '', status: 'Active' });
    setModalOpen(true);
  };

  const handleOpenEdit = (b: BoardMember) => {
    setEditingBoard(b);
    setFormData({
      name: b.name, position: b.position, appointment_date: b.appointment_date, contact: b.contact, bio: b.bio || '', status: b.status
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBoard ? `/api/board-members/${editingBoard.id}` : '/api/board-members';
      const method = editingBoard ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        showNotification(editingBoard ? 'Board member updated successfully' : 'Board member added successfully');
        setModalOpen(false);
        onRefresh();
      }
    } catch (err) {
      showNotification('Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete board member?')) return;
    await fetch(`/api/board-members/${id}`, { method: 'DELETE' });
    showNotification('Board member deleted');
    onRefresh();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#0B3B2C]">Board Members & Governance</h1>
          <p className="text-gray-600 text-sm">Governance oversight, board roster, and term details.</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-[#0B3B2C] hover:bg-[#144f3d] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md">
          + Add Board Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {boardMembers.map(b => (
          <div key={b.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-[#0B3B2C]">{b.name}</h3>
                <p className="text-xs text-[#F5A623] font-bold uppercase">{b.position}</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">{b.status}</span>
            </div>
            <p className="text-xs text-gray-500">Contact: {b.contact} | Appointed: {b.appointment_date}</p>
            <p className="text-sm text-gray-700">{b.bio}</p>
            <div className="text-right pt-2 space-x-2">
              <button onClick={() => handleOpenEdit(b)} className="text-blue-600 hover:underline font-semibold text-xs">Edit</button>
              <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:underline font-semibold text-xs">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#0B3B2C]">{editingBoard ? 'Edit Board Member' : 'Add Board Member'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Position / Title</label>
                  <input type="text" required value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Email</label>
                  <input type="email" required value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Bio / Background</label>
                <textarea rows={3} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-sm">Cancel</button>
                <button type="submit" className="bg-[#0B3B2C] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 10. CONTRACTS & AGREEMENTS MODULE
// ==========================================

function ContractsModule({ contracts, clients, onRefresh, showNotification }: { contracts: Contract[]; clients: Client[]; onRefresh: () => void; showNotification: (m: string, t?: any) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [formData, setFormData] = useState({
    reference: `CNT-${Math.floor(1000 + Math.random() * 9000)}`,
    title: '', client: '', owner: 'Admin', start_date: '2026-10-01', expiration_date: '2027-10-01', value: '$25,000', status: 'Active', approval_status: 'Approved'
  });

  const handleOpenAdd = () => {
    setEditingContract(null);
    setFormData({
      reference: `CNT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: '', client: '', owner: 'Admin', start_date: '2026-10-01', expiration_date: '2027-10-01', value: '$25,000', status: 'Active', approval_status: 'Approved'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Contract) => {
    setEditingContract(c);
    setFormData({
      reference: c.reference, title: c.title, client: c.client, owner: c.owner, start_date: c.start_date, expiration_date: c.expiration_date, value: c.value, status: c.status, approval_status: c.approval_status
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingContract ? `/api/contracts/${editingContract.id}` : '/api/contracts';
      const method = editingContract ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, parties: ['Kobac Systems', formData.client] })
      });
      if (res.ok) {
        showNotification(editingContract ? 'Contract updated successfully' : 'Contract created successfully');
        setModalOpen(false);
        onRefresh();
      }
    } catch (err) {
      showNotification('Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete contract?')) return;
    await fetch(`/api/contracts/${id}`, { method: 'DELETE' });
    showNotification('Contract deleted');
    onRefresh();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#0B3B2C]">Contracts & Agreements</h1>
          <p className="text-gray-600 text-sm">Legal agreements, renewals, and financial valuations.</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-[#0B3B2C] hover:bg-[#144f3d] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md">
          + Add Contract
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
              <th className="p-4">Reference & Title</th>
              <th className="p-4">Client</th>
              <th className="p-4">Value</th>
              <th className="p-4">Expiration</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {contracts.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-bold text-[#0B3B2C]">{c.title}</div>
                  <div className="text-xs text-gray-500 font-mono">{c.reference}</div>
                </td>
                <td className="p-4 font-medium">{c.client}</td>
                <td className="p-4 font-bold text-emerald-700">{c.value}</td>
                <td className="p-4 text-xs text-gray-600">{c.expiration_date}</td>
                <td className="p-4"><span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">{c.status}</span></td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleOpenEdit(c)} className="text-blue-600 hover:underline font-semibold text-xs">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline font-semibold text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#0B3B2C]">{editingContract ? 'Edit Contract' : 'Add New Contract'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contract Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Client Name</label>
                  <input type="text" required value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contract Value</label>
                  <input type="text" required value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Start Date</label>
                  <input type="date" required value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Expiration Date</label>
                  <input type="date" required value={formData.expiration_date} onChange={e => setFormData({ ...formData, expiration_date: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-sm">Cancel</button>
                <button type="submit" className="bg-[#0B3B2C] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">Save Contract</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 11. MEETINGS & MINUTES MODULE
// ==========================================

function MeetingsModule({ meetings, onRefresh, showNotification }: { meetings: MeetingItem[]; onRefresh: () => void; showNotification: (m: string, t?: any) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<MeetingItem | null>(null);
  const [formData, setFormData] = useState({
    subject: '', channel: 'Boardroom / Zoom', date_time: '2026-10-20 10:00 AM', summary: '', decisions: '', action_items: '', next_follow_up: '2026-10-27'
  });

  const handleOpenAdd = () => {
    setEditingMeeting(null);
    setFormData({ subject: '', channel: 'Boardroom / Zoom', date_time: '2026-10-20 10:00 AM', summary: '', decisions: '', action_items: '', next_follow_up: '2026-10-27' });
    setModalOpen(true);
  };

  const handleOpenEdit = (m: MeetingItem) => {
    setEditingMeeting(m);
    setFormData({
      subject: m.subject, channel: m.channel, date_time: m.date_time, summary: m.summary || '', decisions: m.decisions || '', action_items: m.action_items || '', next_follow_up: m.next_follow_up || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingMeeting ? `/api/meetings/${editingMeeting.id}` : '/api/meetings';
      const method = editingMeeting ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, participants: ['Admin', 'Board'] })
      });
      if (res.ok) {
        showNotification(editingMeeting ? 'Meeting updated successfully' : 'Meeting saved successfully');
        setModalOpen(false);
        onRefresh();
      }
    } catch (err) {
      showNotification('Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete meeting?')) return;
    await fetch(`/api/meetings/${id}`, { method: 'DELETE' });
    showNotification('Meeting deleted');
    onRefresh();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#0B3B2C]">Meetings & Minutes</h1>
          <p className="text-gray-600 text-sm">Schedule meetings, record minutes, decisions, and action items.</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-[#0B3B2C] hover:bg-[#144f3d] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md">
          + Schedule Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meetings.map(m => (
          <div key={m.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#0B3B2C]">{m.subject}</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">{m.channel}</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">Date: {m.date_time}</p>
            <p className="text-sm text-gray-700">{m.summary}</p>
            <div className="text-right pt-2 space-x-2">
              <button onClick={() => handleOpenEdit(m)} className="text-blue-600 hover:underline font-semibold text-xs">Edit</button>
              <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:underline font-semibold text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#0B3B2C]">{editingMeeting ? 'Edit Meeting' : 'Schedule Meeting'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subject</label>
                <input type="text" required value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Channel</label>
                  <input type="text" required value={formData.channel} onChange={e => setFormData({ ...formData, channel: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date & Time</label>
                  <input type="text" required value={formData.date_time} onChange={e => setFormData({ ...formData, date_time: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Summary / Minutes</label>
                <textarea rows={3} value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-sm">Cancel</button>
                <button type="submit" className="bg-[#0B3B2C] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">Save Meeting</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 12. REMINDERS & CALENDAR MODULE
// ==========================================

function RemindersModule({ reminders, onRefresh, showNotification }: { reminders: ReminderItem[]; onRefresh: () => void; showNotification: (m: string, t?: any) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRem, setEditingRem] = useState<ReminderItem | null>(null);
  const [formData, setFormData] = useState({
    title: '', due_date: '2026-10-25', priority: 'Medium', status: 'Active'
  });

  const handleOpenAdd = () => {
    setEditingRem(null);
    setFormData({ title: '', due_date: '2026-10-25', priority: 'Medium', status: 'Active' });
    setModalOpen(true);
  };

  const handleOpenEdit = (r: ReminderItem) => {
    setEditingRem(r);
    setFormData({
      title: r.title, due_date: r.due_date, priority: r.priority, status: r.status
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingRem ? `/api/reminders/${editingRem.id}` : '/api/reminders';
      const method = editingRem ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        showNotification(editingRem ? 'Reminder updated successfully' : 'Reminder created successfully');
        setModalOpen(false);
        onRefresh();
      }
    } catch (err) {
      showNotification('Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete reminder?')) return;
    await fetch(`/api/reminders/${id}`, { method: 'DELETE' });
    showNotification('Reminder deleted');
    onRefresh();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#0B3B2C]">Reminders & Calendar</h1>
          <p className="text-gray-600 text-sm">Set deadline alerts, follow-up notifications, and calendar events.</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-[#0B3B2C] hover:bg-[#144f3d] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md">
          + Add Reminder
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
              <th className="p-4">Reminder Title</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {reminders.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="p-4 font-bold text-[#0B3B2C]">{r.title}</td>
                <td className="p-4 text-xs text-gray-600">{r.due_date}</td>
                <td className="p-4"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>{r.priority}</span></td>
                <td className="p-4"><span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">{r.status}</span></td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleOpenEdit(r)} className="text-blue-600 hover:underline font-semibold text-xs">Edit</button>
                  <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline font-semibold text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#0B3B2C]">{editingRem ? 'Edit Reminder' : 'Add Reminder'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Reminder Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Due Date</label>
                  <input type="date" required value={formData.due_date} onChange={e => setFormData({ ...formData, due_date: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Priority</label>
                  <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-sm">Cancel</button>
                <button type="submit" className="bg-[#0B3B2C] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">Save Reminder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 13. TEAM & PERMISSIONS MODULE
// ==========================================

function TeamModule({ users, onRefresh, showNotification }: { users: User[]; onRefresh: () => void; showNotification: (m: string, t?: any) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '', title: '', department: 'Executive Leadership', email: '', phone: '', role: 'CEO / Executive', responsibilities: '', avatar: '', active: true, password: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', title: '', department: 'Executive Leadership', email: '', phone: '', role: 'CEO / Executive', responsibilities: '', avatar: '', active: true, password: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setFormData({
      name: u.name, title: u.title, department: u.department, email: u.email, phone: u.phone || '', role: u.role, responsibilities: u.responsibilities || '', avatar: u.avatar || '', active: u.active, password: ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      showNotification('Team member deleted successfully');
      onRefresh();
    } catch (err) {
      showNotification('Failed to delete team member', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!editingUser || formData.password) && formData.password.length < 12) {
      showNotification('Set a password with at least 12 characters.', 'error');
      return;
    }
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';
      const { password, ...userFields } = formData;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser && !password ? userFields : { ...userFields, password })
      });
      if (res.ok) {
        showNotification(editingUser ? 'Team member updated successfully' : 'Team member created successfully');
        setModalOpen(false);
        onRefresh();
      }
    } catch (err) {
      showNotification('Operation failed', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#0B3B2C]">Team & Role-Based Permissions</h1>
          <p className="text-gray-600 text-sm">Manage enterprise staff accounts, roles, departments, responsibilities, and access levels.</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-[#0B3B2C] hover:bg-[#144f3d] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md">
          + Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {users.map(u => (
          <div key={u.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                {u.avatar ? (
                  <img src={u.avatar} alt={u.name} className="w-14 h-14 rounded-2xl object-cover shadow-md" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-[#0B3B2C] text-[#F5A623] flex items-center justify-center font-black text-xl shadow-md">
                    {u.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-[#0B3B2C] text-base leading-tight">{u.name}</h3>
                  <p className="text-xs text-gray-500 font-semibold">{u.title}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl text-xs space-y-1 font-medium text-gray-600 border border-gray-100">
                <p><strong>Department:</strong> {u.department}</p>
                <p><strong>System Role:</strong> <span className="text-[#0B3B2C] font-bold">{u.role}</span></p>
                <p><strong>Email:</strong> {u.email}</p>
                <p><strong>Phone:</strong> {u.phone || 'N/A'}</p>
              </div>
              {u.responsibilities && (
                <p className="text-xs text-gray-600 italic leading-relaxed">"{u.responsibilities}"</p>
              )}
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${u.active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {u.active ? 'Active Access' : 'Inactive'}
              </span>
              <div className="space-x-3 text-xs font-semibold">
                <button onClick={() => handleOpenEdit(u)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-[#0B3B2C]">{editingUser ? 'Edit Team Member' : 'Add Team Member'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Profile Avatar Image</label>
                <div className="flex items-center gap-4">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Preview" className="w-12 h-12 rounded-xl object-cover border" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-xs text-gray-500">No Image</div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0B3B2C] file:text-white hover:file:bg-[#144f3d]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Job Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Department</label>
                  <input type="text" required value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">System Role</label>
                  <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-[#0B3B2C]">
                    <option>CEO / Executive</option>
                    <option>Digital Strategy Lead</option>
                    <option>Operations Lead</option>
                    <option>Super Admin</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{editingUser ? 'New Password (leave blank to keep current)' : 'Initial Password'}</label>
                <input type="password" autoComplete="new-password" required={!editingUser} minLength={12} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Responsibilities</label>
                <textarea rows={2} value={formData.responsibilities} onChange={e => setFormData({ ...formData, responsibilities: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="activeToggle" checked={formData.active} onChange={e => setFormData({ ...formData, active: e.target.checked })} className="w-4 h-4 rounded text-[#0B3B2C]" />
                <label htmlFor="activeToggle" className="text-xs font-bold text-gray-700">Active Access (Display on Public Website)</label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-sm">Cancel</button>
                <button type="submit" className="bg-[#0B3B2C] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">Save Team Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 14. AUDIT LOGS MODULE
// ==========================================

function AuditLogsModule({ auditLogs }: { auditLogs: AuditLog[] }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-[#0B3B2C]">Security Audit Logs</h1>
        <p className="text-gray-600 text-sm">Immutable system activity logs and security tracking.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
              <th className="p-4">Action</th>
              <th className="p-4">Performed By</th>
              <th className="p-4">IP Address</th>
              <th className="p-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {auditLogs.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="p-4 font-bold text-[#0B3B2C]">{a.action}</td>
                <td className="p-4 font-medium">{a.actor}</td>
                <td className="p-4 text-xs font-mono text-gray-500">{a.ip}</td>
                <td className="p-4 text-xs text-gray-600">{new Date(a.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 15. COMPANY SETTINGS MODULE
// ==========================================

function SettingsModule({ companySettings, onRefresh, showNotification }: { companySettings: CompanySettings | null; onRefresh: () => void; showNotification: (m: string, t?: any) => void }) {
  const [formData, setFormData] = useState({
    company_name: companySettings?.company_name || 'Kobac Systems Inc.',
    tagline: companySettings?.tagline || 'Enterprise Digital Transformation',
    email: companySettings?.emails?.[0] || 'contactkobacsystems@gmail.com',
    phone: companySettings?.phones?.join(', ') || '+252 61 5283292',
    location: companySettings?.location || 'Mogadishu, Somalia',
    logo_url: companySettings?.logo_url || '',
    primary_color: companySettings?.primary_color || '#0B3B2C',
    accent_color: companySettings?.accent_color || '#F5A623'
  });

  useEffect(() => {
    setFormData({
      company_name: companySettings?.company_name || 'Kobac Systems Inc.',
      tagline: companySettings?.tagline || 'Enterprise Digital Transformation',
      email: companySettings?.emails?.[0] || 'contactkobacsystems@gmail.com',
      phone: companySettings?.phones?.join(', ') || '+252 61 5283292',
      location: companySettings?.location || 'Mogadishu, Somalia',
      logo_url: companySettings?.logo_url || '',
      primary_color: companySettings?.primary_color || '#0B3B2C',
      accent_color: companySettings?.accent_color || '#F5A623'
    });
  }, [companySettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/company-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: formData.company_name,
          tagline: formData.tagline,
          location: formData.location,
          emails: formData.email.split(',').map(value => value.trim()).filter(Boolean),
          phones: formData.phone.split(',').map(value => value.trim()).filter(Boolean),
          logo_url: formData.logo_url || null,
          primary_color: formData.primary_color,
          accent_color: formData.accent_color
        })
      });
      if (res.ok) {
        showNotification('Company settings updated successfully');
        onRefresh();
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update company settings.');
      }
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Failed to update settings.', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-black text-[#0B3B2C]">Company Settings</h1>
        <p className="text-gray-600 text-sm">Configure global enterprise identity, contact details, and financial parameters.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Company Name</label>
            <input type="text" value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tagline</label>
            <input type="text" value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone numbers (comma separated)</label>
            <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Location</label>
          <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Logo URL (optional)</label>
          <input type="url" value={formData.logo_url} onChange={e => setFormData({ ...formData, logo_url: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Primary color</label>
            <input type="color" value={formData.primary_color} onChange={e => setFormData({ ...formData, primary_color: e.target.value })} className="w-full h-11 bg-gray-50 border border-gray-300 rounded-xl px-2" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Accent color</label>
            <input type="color" value={formData.accent_color} onChange={e => setFormData({ ...formData, accent_color: e.target.value })} className="w-full h-11 bg-gray-50 border border-gray-300 rounded-xl px-2" />
          </div>
        </div>
        <button type="submit" className="bg-[#0B3B2C] hover:bg-[#144f3d] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md">
          Save Settings
        </button>
      </form>
    </div>
  );
}

// ==========================================
// AI CHAT ASSISTANT WIDGET
// ==========================================

function AiChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Mahadsanid! Soo dhowow. Anigu waa Caawinta AI ee Kobac Systems. Sidee baan ku caawin karaa maanta? (Welcome! How can I help you today?)' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: messages.slice(-8) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI chat is temporarily unavailable.');
      setMessages(prev => [...prev, { role: 'assistant', text: data.response || data.reply }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI chat is temporarily unavailable. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', text: message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#0B3B2C] hover:bg-[#144f3d] text-white p-4 rounded-full shadow-2xl flex items-center gap-3 border-2 border-[#F5A623] transition-all transform hover:scale-105 group"
        >
          <div className="w-8 h-8 rounded-full bg-[#F5A623] text-[#0B3B2C] flex items-center justify-center font-bold text-base shadow">
            🤖
          </div>
          <div className="text-left pr-2">
            <p className="text-xs font-bold text-[#F5A623] uppercase tracking-wider">Caawinta AI</p>
            <p className="text-xs font-medium text-white">ku dhufo caawinta AI ga</p>
          </div>
        </button>
      ) : (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-96 max-w-[calc(100vw-2rem)] flex flex-col h-[520px] overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="bg-[#0B3B2C] text-white p-4 flex items-center justify-between border-b border-[#144f3d]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F5A623] text-[#0B3B2C] flex items-center justify-center font-bold text-lg shadow">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-sm">Caawinta AI ee Kobac</h3>
                <p className="text-[11px] text-emerald-300">Gemini 2.5 Flash • Somali & English</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white font-bold text-lg p-1">
              &times;
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F6F8F7]">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user' ? 'bg-[#0B3B2C] text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border border-gray-200 text-xs text-gray-500 animate-pulse shadow-sm">
                  AI waa uu qorayaa...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              maxLength={4000}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Weydii su'aal (Ask a question)..."
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0B3B2C]"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0B3B2C] hover:bg-[#144f3d] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md"
            >
              Dir
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
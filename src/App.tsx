import React, { useState, useEffect, useMemo } from 'react';
import { usePersistentState } from './usePersistentState';
import { 
  GraduationCap, Globe, BookOpen, Compass, CheckCircle, AlertCircle, 
  FileText, DollarSign, UserCheck, ShieldAlert, ChevronRight, Play, 
  MessageSquare, Layers, Download, Sparkles, Filter, Search, ArrowRight,
  TrendingUp, Check, Info, Bell, RefreshCw, Eye, ExternalLink, Settings,
  Award, HelpCircle, Lock, Edit3, Trash2, Plus, Users, BarChart3, Star,
  Send, RefreshCcw, FileCheck, Landmark, Heart, Cpu
} from 'lucide-react';

// --- DATA CONSTANTS & SEEDS ---

const COUNTRIES_DATA = [
  {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    symbol: '€',
    exchangeRateToPKR: 302.50,
    avgTuition: '€0 - €3,000 / year (Public Universities mostly tuition-free)',
    avgLiving: '€11,208 / year (Blocked Account requirement)',
    blockedAccountReq: '€11,904 (approx PKR 3.6M)',
    languageReq: 'IELTS 6.5+ or TOEFL 80+ / German B2 for German-taught',
    intakes: 'Winter (Oct) & Summer (April)',
    postStudyVisa: '18 Months Job Seeking Visa',
    officialPortal: 'https://www.daad.de',
    verifiedDate: '2026-10-15',
    checklist: [
      { id: 'g1', title: 'Check Anabin Eligibility (H+ Institution)', category: 'Academic', mandatory: true },
      { id: 'g2', title: 'Open Sperrkonto (Blocked Account - Expatrio/Fintiba)', category: 'Financial', mandatory: true },
      { id: 'g3', title: 'Obtain Health Insurance (TK / Barmer)', category: 'Insurance', mandatory: true },
      { id: 'g4', title: 'APS Certificate (if applicable)', category: 'Verification', mandatory: true },
      { id: 'g5', title: 'Draft Letter of Motivation (SOP)', category: 'Document', mandatory: true },
      { id: 'g6', title: 'Book German Embassy Islamabad / Consulate Karachi Slot', category: 'Visa', mandatory: true }
    ]
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    symbol: '£',
    exchangeRateToPKR: 355.00,
    avgTuition: '£13,000 - £25,000 / year',
    avgLiving: '£9,207 (Outside London) / £12,006 (Inside London) for 9 months',
    blockedAccountReq: 'Bank statement held for 28 consecutive days',
    languageReq: 'IELTS UKVI 6.0 - 7.0 or Medium of Instruction (MOI) waiver',
    intakes: 'September / October & January / February',
    postStudyVisa: '2-Year Graduate Route Visa (PSW)',
    officialPortal: 'https://www.gov.uk/student-visa',
    verifiedDate: '2026-09-30',
    checklist: [
      { id: 'u1', title: 'Receive unconditional offer and CAS (Confirmation of Acceptance)', category: 'Academic', mandatory: true },
      { id: 'u2', title: '28-Day Bank Statement meeting maintenance requirements', category: 'Financial', mandatory: true },
      { id: 'u3', title: 'Pay IHS (Immigration Health Surcharge)', category: 'Fee', mandatory: true },
      { id: 'u4', title: 'TB Test Certificate from IOM Pakistan', category: 'Health', mandatory: true },
      { id: 'u5', title: 'Credibility Interview Preparation', category: 'Visa', mandatory: true }
    ]
  },
  {
    id: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    symbol: '$',
    exchangeRateToPKR: 279.00,
    avgTuition: '$20,000 - $45,000 / year',
    avgLiving: '$12,000 - $18,000 / year',
    blockedAccountReq: 'Bank Statement + I-20 proof of funds',
    languageReq: 'IELTS 6.5+ / TOEFL 80+ / Duolingo 115+ / GRE optional',
    intakes: 'Fall (August) & Spring (January)',
    postStudyVisa: '1-Year OPT (3-Years for STEM Majors)',
    officialPortal: 'https://travel.state.gov',
    verifiedDate: '2026-11-01',
    checklist: [
      { id: 'us1', title: 'Receive Form I-20 from admitted institution', category: 'Academic', mandatory: true },
      { id: 'us2', title: 'Pay SEVIS I-901 Fee ($350)', category: 'Fee', mandatory: true },
      { id: 'us3', title: 'Complete DS-160 Non-immigrant Visa Form', category: 'Visa', mandatory: true },
      { id: 'us4', title: 'Schedule F-1 Interview at US Embassy Islamabad/Karachi', category: 'Visa', mandatory: true },
      { id: 'us5', title: 'Prepare Financial Affidavit & Sponsor Proof', category: 'Financial', mandatory: true }
    ]
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    symbol: 'CA$',
    exchangeRateToPKR: 205.00,
    avgTuition: 'CA$17,000 - CA$35,000 / year',
    avgLiving: 'CA$20,635 / year (GIC requirement)',
    blockedAccountReq: 'Guaranteed Investment Certificate (GIC) CA$20,635',
    languageReq: 'IELTS Academic 6.5 overall (Min 6.0 each band) or PTE',
    intakes: 'Fall (Sept), Winter (Jan), Summer (May)',
    postStudyVisa: 'Post-Graduation Work Permit (PGWP) up to 3 years',
    officialPortal: 'https://www.canada.ca/en/immigration-refugees-citizenship.html',
    verifiedDate: '2026-10-20',
    checklist: [
      { id: 'c1', title: 'Letter of Acceptance (LOA) from DLI Institution', category: 'Academic', mandatory: true },
      { id: 'c2', title: 'Provincial Attestation Letter (PAL) if applicable', category: 'Regulatory', mandatory: true },
      { id: 'c3', title: 'Purchase GIC (CA$20,635) via Scotiabank/CIBC', category: 'Financial', mandatory: true },
      { id: 'c4', title: 'Medical Exam with Panel Physician', category: 'Health', mandatory: true },
      { id: 'c5', title: 'Submit Statement of Purpose (Study Plan)', category: 'Document', mandatory: true }
    ]
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    symbol: 'A$',
    exchangeRateToPKR: 185.00,
    avgTuition: 'A$22,000 - A$42,000 / year',
    avgLiving: 'A$29,710 / year (Official living requirement)',
    blockedAccountReq: 'Liquid Bank Balance proof for 1 year fees + living',
    languageReq: 'IELTS 6.5 overall (PTE 58+)',
    intakes: 'February & July Intakes',
    postStudyVisa: 'Temporary Graduate Visa (Subclass 485) 2-4 years',
    officialPortal: 'https://homeaffairs.gov.au',
    verifiedDate: '2026-10-10',
    checklist: [
      { id: 'a1', title: 'Obtain Confirmation of Enrolment (CoE)', category: 'Academic', mandatory: true },
      { id: 'a2', title: 'Genuine Student (GS) Requirement statement', category: 'Document', mandatory: true },
      { id: 'a3', title: 'Purchase OSHC (Overseas Student Health Cover)', category: 'Insurance', mandatory: true },
      { id: 'a4', title: 'Proof of Funds (A$29,710 + Tuition)', category: 'Financial', mandatory: true },
      { id: 'a5', title: 'Biometrics & Subclass 500 Visa Lodgement', category: 'Visa', mandatory: true }
    ]
  }
];

const INITIAL_UNIVERSITIES = [
  {
    id: 'u-tum',
    name: 'Technical University of Munich (TUM)',
    country: 'Germany',
    city: 'Munich',
    course: 'M.Sc. Informatics / Data Engineering',
    tuition: '€0 - €1,500/sem',
    gpaReq: '3.2 / 4.0 (80%)',
    ieltsReq: '6.5',
    deadline: 'May 31 (Winter Intake)',
    matchPotential: 'Strong Match',
    link: 'https://www.tum.de'
  },
  {
    id: 'u-rwth',
    name: 'RWTH Aachen University',
    country: 'Germany',
    city: 'Aachen',
    course: 'M.Sc. Software Systems Engineering',
    tuition: '€0 (Admin fee €320/sem)',
    gpaReq: '3.0 / 4.0',
    ieltsReq: '6.5',
    deadline: 'July 15 (Winter Intake)',
    matchPotential: 'Strong Match',
    link: 'https://www.rwth-aachen.de'
  },
  {
    id: 'u-manchester',
    name: 'University of Manchester',
    country: 'United Kingdom',
    city: 'Manchester',
    course: 'MSc Advanced Computer Science',
    tuition: '£31,000 / year',
    gpaReq: '3.3 / 4.0',
    ieltsReq: '7.0',
    deadline: 'Rolling Basis (Recommended Jan 15)',
    matchPotential: 'Possible Match',
    link: 'https://www.manchester.ac.uk'
  },
  {
    id: 'u-alberta',
    name: 'University of Alberta',
    country: 'Canada',
    city: 'Edmonton',
    course: 'M.Sc. Computing Science',
    tuition: 'CA$19,500 / year',
    gpaReq: '3.5 / 4.0',
    ieltsReq: '7.0',
    deadline: 'December 15',
    matchPotential: 'Requirements Review',
    link: 'https://www.ualberta.ca'
  },
  {
    id: 'u-unsw',
    name: 'UNSW Sydney',
    country: 'Australia',
    city: 'Sydney',
    course: 'Master of Information Technology',
    tuition: 'A$49,000 / year',
    gpaReq: '3.0 / 4.0',
    ieltsReq: '6.5',
    deadline: 'November 30',
    matchPotential: 'Possible Match',
    link: 'https://www.unsw.edu.au'
  }
];

const DEMO_STUDENT = {
  name: "Ahmed Khan",
  city: "Karachi, Pakistan",
  degree: "BS Computer Science (FAST NUCES)",
  gpa: "3.4 / 4.0",
  targetCountry: "Germany",
  targetDegree: "Master's in Computer Science",
  budgetPKR: 3200000,
  ieltsScore: "7.5 Overall (L:8.0, R:7.5, W:7.0, S:7.0)",
  experience: "1.5 years Software Engineer at Systems Ltd",
  sopStatus: "Draft 2 - Optimized",
  savedUniversities: ['Technical University of Munich (TUM)', 'RWTH Aachen University']
};

const STAGES_LIST = [
  "Profile Completed",
  "Country Selected",
  "University Shortlisted",
  "Eligibility Checked",
  "Documents Prepared",
  "SOP Completed",
  "University Application Submitted",
  "Admission Decision Received",
  "Offer Accepted",
  "Financial Documents Prepared",
  "Visa Application Submitted",
  "Visa Decision Received"
];

// --- MAIN APP COMPONENT ---

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState('landing'); // landing, demo, onboarding, dashboard, copilot, sop, countries, universities, vault, finance, admin
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = usePersistentState('visionforge:isLoggedIn', false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login, signup

  // Student Profile State
  const [studentProfile, setStudentProfile] = usePersistentState('visionforge:studentProfile', {
    fullName: 'Ahmed Khan',
    email: 'ahmed.khan@example.pk',
    countryResidence: 'Pakistan',
    preferredLang: 'English',
    qualification: "Bachelor's Degree",
    institution: 'FAST-NUCES Karachi',
    cgpa: '3.4',
    fieldOfStudy: 'Computer Science',
    targetCountry: 'Germany',
    targetDegree: "Master's Degree",
    intake: 'Winter 2026',
    ieltsStatus: 'Completed',
    ieltsScore: '7.5',
    budgetPKR: 3500000,
    hasSponsor: true,
    workExpYears: '1.5',
    stageIndex: 4 // stage 5 of 12
  });

  // Shortlisted Universities
  const [savedUnis, setSavedUnis] = usePersistentState<string[]>('visionforge:savedUnis', ['u-tum', 'u-rwth']);

  // Dynamic Notification Toast
  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#101D35] font-sans flex flex-col selection:bg-[#16B8A6] selection:text-white">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-[#101D35] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#16B8A6]/40 animate-bounce">
          <Info className="w-5 h-5 text-[#16B8A6]" />
          <span className="text-sm font-medium">{notification.msg}</span>
        </div>
      )}

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#101D35] text-white border-b border-slate-800 backdrop-blur-md bg-opacity-95 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#16B8A6] to-teal-300 flex items-center justify-center text-[#101D35] font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
              VF
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-[#16B8A6] transition-colors">
                VisionForge
              </span>
              <span className="hidden sm:block text-[10px] text-teal-400 tracking-wider font-semibold uppercase">
                Global Edu Roadmap
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button 
              onClick={() => setCurrentTab('landing')} 
              className={`px-3 py-2 rounded-lg transition-colors ${currentTab === 'landing' ? 'text-[#16B8A6] bg-slate-800/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentTab('demo')} 
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${currentTab === 'demo' ? 'text-[#16B8A6] bg-slate-800/60' : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/40'}`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Demo Journey
            </button>
            <button 
              onClick={() => setCurrentTab('countries')} 
              className={`px-3 py-2 rounded-lg transition-colors ${currentTab === 'countries' ? 'text-[#16B8A6] bg-slate-800/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'}`}
            >
              Explore Countries
            </button>
            <button 
              onClick={() => setCurrentTab('universities')} 
              className={`px-3 py-2 rounded-lg transition-colors ${currentTab === 'universities' ? 'text-[#16B8A6] bg-slate-800/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'}`}
            >
              Uni Matcher
            </button>
            <button 
              onClick={() => setCurrentTab('sop')} 
              className={`px-3 py-2 rounded-lg transition-colors ${currentTab === 'sop' ? 'text-[#16B8A6] bg-slate-800/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'}`}
            >
              SOP Studio
            </button>
            <button 
              onClick={() => setCurrentTab('copilot')} 
              className={`px-3 py-2 rounded-lg transition-colors ${currentTab === 'copilot' ? 'text-[#16B8A6] bg-slate-800/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'}`}
            >
              AI Copilot
            </button>
            <button 
              onClick={() => setCurrentTab('finance')} 
              className={`px-3 py-2 rounded-lg transition-colors ${currentTab === 'finance' ? 'text-[#16B8A6] bg-slate-800/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'}`}
            >
              Finance
            </button>
            <button 
              onClick={() => setCurrentTab('vault')} 
              className={`px-3 py-2 rounded-lg transition-colors ${currentTab === 'vault' ? 'text-[#16B8A6] bg-slate-800/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'}`}
            >
              Vault
            </button>
          </nav>

          {/* User & Action CTAs */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentTab('dashboard')} 
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-teal-500/30 text-teal-300 hover:bg-teal-500/10 text-sm font-medium transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className="w-9 h-9 rounded-full bg-[#16B8A6] text-[#101D35] font-bold flex items-center justify-center text-sm shadow-md"
                  title={studentProfile.fullName}
                >
                  {studentProfile.fullName.charAt(0)}
                </button>
                <button 
                  onClick={() => { setIsLoggedIn(false); showToast("Logged out successfully"); }}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white font-medium"
                >
                  Login
                </button>
                <button 
                  onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                  className="px-4 py-2 text-sm bg-[#16B8A6] hover:bg-teal-400 text-[#101D35] font-bold rounded-xl shadow-lg hover:shadow-teal-500/20 transition-all"
                >
                  Get Started
                </button>
              </div>
            )}
            
            <button 
              onClick={() => setCurrentTab('admin')}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              title="Admin Portal Demo"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-nav bar for Mobile screens */}
        <div className="lg:hidden flex items-center overflow-x-auto gap-2 px-4 py-2 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 no-scrollbar">
          <button onClick={() => setCurrentTab('landing')} className={`whitespace-nowrap px-3 py-1 rounded ${currentTab==='landing'?'bg-[#16B8A6] text-black font-bold':''}`}>Home</button>
          <button onClick={() => setCurrentTab('demo')} className={`whitespace-nowrap px-3 py-1 rounded ${currentTab==='demo'?'bg-amber-400 text-black font-bold':''}`}>Demo Journey</button>
          <button onClick={() => setCurrentTab('dashboard')} className={`whitespace-nowrap px-3 py-1 rounded ${currentTab==='dashboard'?'bg-[#16B8A6] text-black font-bold':''}`}>Dashboard</button>
          <button onClick={() => setCurrentTab('copilot')} className={`whitespace-nowrap px-3 py-1 rounded ${currentTab==='copilot'?'bg-[#16B8A6] text-black font-bold':''}`}>AI Copilot</button>
          <button onClick={() => setCurrentTab('countries')} className={`whitespace-nowrap px-3 py-1 rounded ${currentTab==='countries'?'bg-[#16B8A6] text-black font-bold':''}`}>Countries</button>
          <button onClick={() => setCurrentTab('universities')} className={`whitespace-nowrap px-3 py-1 rounded ${currentTab==='universities'?'bg-[#16B8A6] text-black font-bold':''}`}>Unis</button>
          <button onClick={() => setCurrentTab('sop')} className={`whitespace-nowrap px-3 py-1 rounded ${currentTab==='sop'?'bg-[#16B8A6] text-black font-bold':''}`}>SOP Studio</button>
          <button onClick={() => setCurrentTab('finance')} className={`whitespace-nowrap px-3 py-1 rounded ${currentTab==='finance'?'bg-[#16B8A6] text-black font-bold':''}`}>Finance</button>
        </div>
      </header>

      {/* BODY CONTENT ROUTER */}
      <main className="flex-grow">
        {currentTab === 'landing' && (
          <LandingPage 
            onGetStarted={() => setCurrentTab('onboarding')} 
            onExploreDemo={() => setCurrentTab('demo')}
            onSelectCountry={(c) => { setCurrentTab('countries'); }}
          />
        )}
        
        {currentTab === 'demo' && (
          <DemoJourneySection onStartOwn={() => setCurrentTab('onboarding')} />
        )}

        {currentTab === 'onboarding' && (
          <OnboardingWizard 
            profile={studentProfile} 
            setProfile={setStudentProfile} 
            onComplete={() => {
              setIsLoggedIn(true);
              setCurrentTab('dashboard');
              showToast("Profile created successfully! Welcome to your dashboard.", "success");
            }} 
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView 
            profile={studentProfile}
            savedUnis={savedUnis}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'copilot' && (
          <AICopilotView profile={studentProfile} />
        )}

        {currentTab === 'sop' && (
          <SOPStudioView profile={studentProfile} />
        )}

        {currentTab === 'countries' && (
          <CountryExplorerView 
            savedUnis={savedUnis}
            setSavedUnis={setSavedUnis}
            onSelectUni={(u) => setCurrentTab('universities')}
          />
        )}

        {currentTab === 'universities' && (
          <UniversityMatcher profile={studentProfile} savedUnis={savedUnis} setSavedUnis={setSavedUnis} />
        )}

        {currentTab === 'vault' && (
          <DocumentVaultView profile={studentProfile} />
        )}

        {currentTab === 'finance' && (
          <FinancialPlannerView profile={studentProfile} />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardView />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#101D35] text-white border-t border-slate-800 pt-16 pb-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#16B8A6] text-[#101D35] font-black flex items-center justify-center text-base">
                  VF
                </div>
                <span className="text-xl font-bold tracking-tight">VisionForge</span>
              </div>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                Transforming future ambitions into achievable plans. Pakistan's first transparent, tech-powered study-abroad guidance system.
              </p>
              <div className="text-xs text-slate-500">
                © {new Date().getFullYear()} VisionForge Tech (Pvt) Ltd. All rights reserved.
              </div>
            </div>

            <div>
              <h4 className="text-[#16B8A6] font-semibold text-sm tracking-wider uppercase mb-4">Features</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><button onClick={() => setCurrentTab('demo')} className="hover:text-white">Demo Student Journey</button></li>
                <li><button onClick={() => setCurrentTab('copilot')} className="hover:text-white">AI Copilot (Urdu & English)</button></li>
                <li><button onClick={() => setCurrentTab('sop')} className="hover:text-white">SOP Writing Studio</button></li>
                <li><button onClick={() => setCurrentTab('universities')} className="hover:text-white">University Matcher</button></li>
                <li><button onClick={() => setCurrentTab('finance')} className="hover:text-white">PKR Cost Calculator</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#16B8A6] font-semibold text-sm tracking-wider uppercase mb-4">Top Destinations</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><button onClick={() => setCurrentTab('countries')} className="hover:text-white">Germany (Free Education)</button></li>
                <li><button onClick={() => setCurrentTab('countries')} className="hover:text-white">United Kingdom (PSW Route)</button></li>
                <li><button onClick={() => setCurrentTab('countries')} className="hover:text-white">Canada (PGWP)</button></li>
                <li><button onClick={() => setCurrentTab('countries')} className="hover:text-white">United States (STEM OPT)</button></li>
                <li><button onClick={() => setCurrentTab('countries')} className="hover:text-white">Australia (Subclass 500)</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#16B8A6] font-semibold text-sm tracking-wider uppercase mb-4">Verification & Safety</h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                We never charge secret agent commissions or fabricate admission letters. Always double-check requirements on official university & embassy portals.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs">
                <CheckCircle className="w-4 h-4" /> Official Data Verification Active
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            Fictional student examples are for product demonstration purposes. VisionForge is an educational roadmap SaaS and not a visa issuing authority.
          </div>
        </div>
      </footer>

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative border border-slate-200">
            <button 
              onClick={() => setShowAuthModal(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg font-bold"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#101D35] text-[#16B8A6] font-extrabold text-2xl rounded-2xl flex items-center justify-center mx-auto mb-3">
                VF
              </div>
              <h3 className="text-2xl font-bold text-[#101D35]">
                {authMode === 'login' ? 'Welcome Back' : 'Create VisionForge Account'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {authMode === 'login' ? 'Access your personalized study-abroad roadmap' : 'Start your international degree journey without agent fees'}
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setIsLoggedIn(true);
              setShowAuthModal(false);
              setCurrentTab('dashboard');
              showToast(authMode === 'login' ? "Logged in successfully!" : "Account created! Redirecting to dashboard...", "success");
            }} className="space-y-4">
              
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    defaultValue="Ahmed Khan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#16B8A6]"
                    placeholder="e.g. Ahmed Khan"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  defaultValue="ahmed.khan@example.pk"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#16B8A6]"
                  placeholder="student@gmail.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  required 
                  defaultValue="password123"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#16B8A6]"
                  placeholder="••••••••"
                />
              </div>

              {authMode === 'signup' && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" required id="terms" className="accent-[#16B8A6]" defaultChecked />
                  <label htmlFor="terms" className="text-xs text-slate-600">
                    I agree to VisionForge Terms & Anti-Fraud policy
                  </label>
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-3 bg-[#16B8A6] hover:bg-teal-400 text-[#101D35] font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                {authMode === 'login' ? 'Sign In to Dashboard' : 'Create Free Account'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              {authMode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button onClick={() => setAuthMode('signup')} className="text-[#16B8A6] font-bold underline">
                    Sign up free
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{' '}
                  <button onClick={() => setAuthMode('login')} className="text-[#16B8A6] font-bold underline">
                    Log in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// --- VIEW 1: LANDING PAGE ---
function LandingPage({ onGetStarted, onExploreDemo, onSelectCountry }) {
  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-[#101D35] text-white pt-24 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-3xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-gradient-to-b from-teal-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Designed Specially for Pakistani Students & Applicants
          </div>

          {/* MAIN PROMINENT BRANDING */}
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-3">
            VisionForge
          </h1>
          
          {/* TAGLINE */}
          <p className="text-xl sm:text-2xl font-medium text-[#16B8A6] tracking-wide mb-8">
            Transforming future ambitions into achievable plans.
          </p>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Your study-abroad journey shouldn't cost you PKR 300,000+ in consultant fees or leave you confused by scattered YouTube guides. Get personalized guidance, verified checklists, AI SOP help, and visa roadmap—all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-[#16B8A6] hover:bg-teal-400 text-[#101D35] font-extrabold text-base rounded-xl shadow-xl hover:shadow-teal-500/25 transition-all flex items-center justify-center gap-2"
            >
              Start Your Free Journey
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button 
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-base rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
              See Interactive Student Demo
            </button>
          </div>

          {/* Visual Journey Card Mockup */}
          <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl max-w-3xl mx-auto text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-400 ml-2 font-mono">VisionForge Roadmap Live Engine</span>
              </div>
              <span className="text-xs text-teal-400 font-semibold px-2.5 py-1 rounded bg-teal-950 border border-teal-800">
                Germany Master's Track
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-emerald-500/40">
                <div className="text-[10px] text-emerald-400 font-bold uppercase">Stage 01</div>
                <div className="text-xs font-bold text-white mt-1">Profile Analysis</div>
                <div className="text-[10px] text-slate-400 mt-1">GPA 3.4 / IELTS 7.5 Verified</div>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-emerald-500/40">
                <div className="text-[10px] text-emerald-400 font-bold uppercase">Stage 05</div>
                <div className="text-xs font-bold text-white mt-1">SOP Optimization</div>
                <div className="text-[10px] text-slate-400 mt-1">AI Feedback Applied</div>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-amber-500/40">
                <div className="text-[10px] text-amber-400 font-bold uppercase">Stage 08</div>
                <div className="text-xs font-bold text-white mt-1">Offer Received</div>
                <div className="text-[10px] text-slate-400 mt-1">TUM Informatics M.Sc.</div>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-teal-500/40">
                <div className="text-[10px] text-teal-400 font-bold uppercase">Stage 12</div>
                <div className="text-xs font-bold text-white mt-1">Visa Approved</div>
                <div className="text-[10px] text-slate-400 mt-1">National Visa (Subclass D)</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Problem & Solution Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-[#101D35] mb-4">
            Why Traditional Consultancy is Broken for Pakistani Applicants
          </h2>
          <p className="text-slate-600 text-base">
            Students spend months watching endless YouTube vlogs, getting conflicting advice from unverified Facebook groups, or paying heavy agent fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Traditional Agent Card */}
          <div className="bg-white p-8 rounded-2xl border border-rose-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Traditional Way
            </div>
            <h3 className="text-xl font-bold text-rose-900 mb-6 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Old Agency Model
            </h3>
            <ul className="space-y-4 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold text-base">✕</span>
                <span><strong>Expensive Consultancy:</strong> Charges PKR 250,000 – 500,000 without guaranteed results.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold text-base">✕</span>
                <span><strong>Biased Recommendations:</strong> Pushes universities based on secret agent commissions, not student fit.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold text-base">✕</span>
                <span><strong>Copy-Paste SOPs:</strong> Generic statement templates that lead to university rejections.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold text-base">✕</span>
                <span><strong>Lack of Transparency:</strong> Zero visibility into your application status or official documents.</span>
              </li>
            </ul>
          </div>

          {/* VisionForge Solution Card */}
          <div className="bg-[#101D35] text-white p-8 rounded-2xl border border-[#16B8A6]/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#16B8A6] text-[#101D35] text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              VisionForge Way
            </div>
            <h3 className="text-xl font-bold text-[#16B8A6] mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              VisionForge Digital Roadmap
            </h3>
            <ul className="space-y-4 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#16B8A6] shrink-0" />
                <span><strong>Transparent & Affordable:</strong> Complete guidance at a fraction of traditional agent costs.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#16B8A6] shrink-0" />
                <span><strong>Unbiased AI Matcher:</strong> Recommends courses based solely on academic background & budget.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#16B8A6] shrink-0" />
                <span><strong>SOP Studio:</strong> AI-powered personal statement builder that maintains your original authentic voice.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#16B8A6] shrink-0" />
                <span><strong>Full Ownership:</strong> You control every application step, document, and deadline directly.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 7-Step Visual Process */}
      <section className="bg-slate-100 py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-[#101D35] mb-4">
              How VisionForge Guides You (7 Steps)
            </h2>
            <p className="text-slate-600 text-base">
              A structured step-by-step roadmap from profile evaluation to landing your student visa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Profile Onboarding', desc: 'Input GPA, degree, IELTS status, and budget in PKR.' },
              { num: '02', title: 'Explore Destinations', desc: 'Compare Germany, UK, US, Canada, Australia requirements.' },
              { num: '03', title: 'University Matching', desc: 'Find eligible courses matching your academic background.' },
              { num: '04', title: 'AI SOP Studio', desc: 'Draft authentic motivational statements with AI guidance.' },
              { num: '05', title: 'Document Vault Check', desc: 'Run automated health check on scans, dates, and names.' },
              { num: '06', title: 'Submit Applications', desc: 'Follow country-specific deadlines and official portals.' },
              { num: '07', title: 'Visa Preparation', desc: 'Blocked account, financial proof, and embassy interview prep.' }
            ].map((step, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-black text-[#16B8A6] mb-2">{step.num}</div>
                <h3 className="text-base font-bold text-[#101D35] mb-2">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Countries Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-[#101D35] mb-2">Featured Study Destinations</h2>
            <p className="text-slate-600 text-sm">Verified requirements, visa paths, and financial estimates.</p>
          </div>
          <button 
            onClick={onSelectCountry}
            className="mt-4 md:mt-0 text-sm font-bold text-[#16B8A6] hover:underline flex items-center gap-1"
          >
            Explore all country guides <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COUNTRIES_DATA.map((c) => (
            <div 
              key={c.id} 
              onClick={onSelectCountry}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{c.flag}</div>
                <span className="text-xs bg-teal-50 text-[#16B8A6] font-bold px-2.5 py-1 rounded-full border border-teal-200">
                  {c.currency} Rate: PKR {c.exchangeRateToPKR}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#101D35] group-hover:text-[#16B8A6] transition-colors mb-2">
                {c.name}
              </h3>
              <div className="space-y-2 text-xs text-slate-600 mb-6">
                <div><strong>Tuition:</strong> {c.avgTuition}</div>
                <div><strong>Living/Bank:</strong> {c.avgLiving}</div>
                <div><strong>Post-Study Visa:</strong> {c.postStudyVisa}</div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#16B8A6]">
                <span>View Complete Checklist</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scam Awareness Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 sm:p-10 text-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#101D35]">Pakistani Student Scam Awareness & Safety</h3>
              <p className="text-xs text-slate-600">Protecting your family's hard-earned savings from illegal practices.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
            <div className="bg-white p-5 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-900 text-sm mb-2">Fake Admission Offer Letters</h4>
              <p className="text-slate-600">Always verify university offer letters directly on official university domains (.de, .ac.uk, .edu). Never transfer tuition to unverified personal bank accounts.</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-900 text-sm mb-2">Guaranteed Visa Claims</h4>
              <p className="text-slate-600">No agent or software can guarantee a student visa. Visa decisions are made solely by official embassies (Islamabad/Karachi) based on genuine documentation.</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-900 text-sm mb-2">Fake Bank Statements</h4>
              <p className="text-slate-600">Using fabricated bank financial statements for embassy submissions leads to permanent 10-year visa bans. VisionForge promotes 100% legal funding sources.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section in PKR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-[#101D35] mb-4">Transparent Pricing in PKR</h2>
          <p className="text-slate-600 text-base">No hidden charges. Choose a plan that fits your preparation stage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#101D35] mb-2">Free Explorer</h3>
              <div className="text-3xl font-extrabold text-[#101D35] mb-4">PKR 0</div>
              <p className="text-xs text-slate-500 mb-6">Perfect for initial research & country exploration.</p>
              <ul className="space-y-3 text-xs text-slate-600 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#16B8A6]" /> Country eligibility overview</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#16B8A6]" /> Basic university matcher</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#16B8A6]" /> 5 AI Copilot queries / day</li>
              </ul>
            </div>
            <button onClick={onGetStarted} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-[#101D35] font-bold text-xs rounded-xl transition-colors">
              Get Started Free
            </button>
          </div>

          {/* Core Roadmap Plan */}
          <div className="bg-[#101D35] text-white p-8 rounded-2xl border-2 border-[#16B8A6] shadow-2xl relative flex flex-col justify-between scale-105">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#16B8A6] text-[#101D35] font-extrabold text-[10px] uppercase tracking-wider px-4 py-1 rounded-full">
              Most Popular
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#16B8A6] mb-2">Country Roadmap</h3>
              <div className="text-3xl font-extrabold text-white mb-4">PKR 14,999 <span className="text-xs font-normal text-slate-400">/ one-time</span></div>
              <p className="text-xs text-slate-300 mb-6">Complete step-by-step roadmap for your target country.</p>
              <ul className="space-y-3 text-xs text-slate-200 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#16B8A6]" /> Full country document checklist</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#16B8A6]" /> AI SOP Studio generator & editor</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#16B8A6]" /> Unlimited Urdu & English AI Copilot</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#16B8A6]" /> Financial PKR living cost calculator</li>
              </ul>
            </div>
            <button onClick={onGetStarted} className="w-full py-3 bg-[#16B8A6] hover:bg-teal-400 text-[#101D35] font-extrabold text-xs rounded-xl shadow-lg transition-all">
              Unlock Full Roadmap
            </button>
          </div>

          {/* Premium Guidance */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#101D35] mb-2">Premium Guidance</h3>
              <div className="text-3xl font-extrabold text-[#101D35] mb-4">PKR 34,999 <span className="text-xs font-normal text-slate-500">/ full cycle</span></div>
              <p className="text-xs text-slate-500 mb-6">For students wanting extra AI & expert document checks.</p>
              <ul className="space-y-3 text-xs text-slate-600 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#16B8A6]" /> Everything in Country Roadmap</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#16B8A6]" /> Document Health Scan (PDF format checks)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#16B8A6]" /> Visa interview mock prep assistant</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#16B8A6]" /> Priority WhatsApp support alerts</li>
              </ul>
            </div>
            <button onClick={onGetStarted} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-[#101D35] font-bold text-xs rounded-xl transition-colors">
              Choose Premium
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}

// --- VIEW 2: INTERACTIVE DEMO STUDENT JOURNEY ---
function DemoJourneySection({ onStartOwn }) {
  const [activeStep, setActiveStep] = useState(0);

  const demoSteps = [
    {
      title: "Stage 01: Account Creation & Profile Onboarding",
      actor: "Ahmed Khan (Karachi)",
      details: "Ahmed registers on VisionForge. He inputs his BS Computer Science qualification from FAST Karachi (CGPA 3.4/4.0), IELTS score of 7.5, and budget of PKR 3.2M.",
      outcome: "VisionForge auto-generates his Student ID profile and sets initial readiness score to 45%.",
      badge: "Completed"
    },
    {
      title: "Stage 02: Profile & Eligibility Analysis",
      actor: "VisionForge AI Engine",
      details: "System verifies FAST NUCES on Anabin database as H+ recognized. Confirms eligibility for German Master's in CS without needing preparatory Studienkolleg.",
      outcome: "Academic eligibility passed with High Potential Match.",
      badge: "Eligibility Passed"
    },
    {
      title: "Stage 03: Country Selection — Germany",
      actor: "Ahmed Khan",
      details: "Ahmed chooses Germany due to tuition-free education at public universities and 18-month post-study job seeker visa.",
      outcome: "Germany roadmap activated with Blocked Account (€11,904) financial requirement loaded.",
      badge: "Destination Set"
    },
    {
      title: "Stage 04: University & Course Matching",
      actor: "VisionForge Matcher",
      details: "Matches shortlists Technical University of Munich (TUM) M.Sc. Informatics and RWTH Aachen M.Sc. Software Systems.",
      outcome: "2 Universities saved to application tracker.",
      badge: "Shortlisted"
    },
    {
      title: "Stage 05: Document Vault Upload",
      actor: "Document Health Check",
      details: "Ahmed uploads FAST transcript, Degree, Passport copy, and IELTS TEF result. System flags transcript scan page 2 clarity notice.",
      outcome: "Ahmed re-scans transcript in high resolution. Document status updated to Verified.",
      badge: "Docs Clean"
    },
    {
      title: "Stage 06: SOP Studio Drafting",
      actor: "AI SOP Studio",
      details: "Ahmed enters his undergrad AI thesis project details. SOP Studio generates a 750-word Letter of Motivation tailored for TUM.",
      outcome: "Draft 2 finalized & exported as PDF.",
      badge: "SOP Ready"
    },
    {
      title: "Stage 07: Direct University Application",
      actor: "Uni-Assist / Direct Portal",
      details: "Ahmed submits online applications via Uni-Assist and TUM online portal before the May 31 deadline.",
      outcome: "Application status logged in VisionForge as 'Under Evaluation'.",
      badge: "Submitted"
    },
    {
      title: "Stage 08: Admission Offer Letter Received",
      actor: "TUM Admissions Office",
      details: "Notification received! Ahmed gets an unconditional admission letter for M.Sc. Informatics at TU Munich.",
      outcome: "VisionForge dashboard triggers celebratory offer alert!",
      badge: "Offer Received!"
    },
    {
      title: "Stage 09: Blocked Account & Insurance Setup",
      actor: "Financial Readiness",
      details: "Ahmed transfers €11,904 to Expatrio Sperrkonto and obtains TK Student Health Insurance certificate.",
      outcome: "Official Sperrbestätigung (Blocking Confirmation) issued for visa.",
      badge: "Finances Ready"
    },
    {
      title: "Stage 10: German Embassy Visa Appointment",
      actor: "German Embassy Islamabad",
      details: "Ahmed attends his visa interview at the German Embassy Islamabad with complete document checklist generated by VisionForge.",
      outcome: "Passport submitted for visa stamping.",
      badge: "Interview Passed"
    },
    {
      title: "Stage 11: Final Student Visa Approval!",
      actor: "German Federal Foreign Office",
      details: "Visa approved! Passport received with 1-Year National Student Visa stamp.",
      outcome: "Ahmed is ready to fly to Munich for his Master's degree!",
      badge: "VISA APPROVED 🎉"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Demo Disclaimer */}
      <div className="mb-8 p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
        <Info className="w-5 h-5 shrink-0 text-amber-600" />
        <span>
          <strong>Interactive Fictional Student Case Study:</strong> This journey demonstrates how a Pakistani applicant moves step-by-step through VisionForge. Official admission & visa decisions are governed by institutions and embassies.
        </span>
      </div>

      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold text-[#16B8A6] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Live Interactive Simulation
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#101D35] mt-3 mb-3">
          See Ahmed Khan's Journey to Germany
        </h1>
        <p className="text-slate-600 text-sm">
          Click through each stage to explore how VisionForge transformed confusion into a clear student visa approval.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Step Navigation Bar */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2 max-h-[600px] overflow-y-auto">
          {demoSteps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`w-full text-left p-3.5 rounded-xl transition-all border flex items-center justify-between ${
                activeStep === idx 
                  ? 'bg-[#101D35] text-white border-[#16B8A6] shadow-md' 
                  : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className={`text-[10px] font-mono ${activeStep === idx ? 'text-[#16B8A6]' : 'text-slate-400'}`}>
                  Step {idx + 1} of 11
                </div>
                <div className="text-xs font-bold truncate max-w-[220px]">
                  {s.title.split(':')[1] || s.title}
                </div>
              </div>

              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                idx === 10 ? 'bg-emerald-500 text-white animate-pulse' : 
                activeStep === idx ? 'bg-[#16B8A6] text-[#101D35]' : 'bg-slate-100 text-slate-600'
              }`}>
                {s.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Step Details Active Panel */}
        <div className="lg:col-span-7 bg-[#101D35] text-white rounded-3xl p-8 border border-slate-800 shadow-2xl relative">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6">
            <div>
              <span className="text-xs font-mono text-[#16B8A6] uppercase tracking-wider">
                Stage {activeStep + 1} Detailed Breakdown
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                {demoSteps[activeStep].title}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-[#16B8A6]">
              {activeStep + 1}
            </div>
          </div>

          <div className="space-y-6 text-sm">
            
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1 font-semibold">Primary Actor / System Module:</span>
              <span className="text-amber-400 font-bold">{demoSteps[activeStep].actor}</span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">What Happened at this Step?</h4>
              <p className="text-slate-200 leading-relaxed text-sm bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                {demoSteps[activeStep].details}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Milestone Outcome:</h4>
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-medium flex items-center gap-3">
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>{demoSteps[activeStep].outcome}</span>
              </div>
            </div>

            {/* Stage Controls */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <button 
                disabled={activeStep === 0}
                onClick={() => setActiveStep(prev => prev - 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-white"
              >
                ← Previous Stage
              </button>
              
              {activeStep < 10 ? (
                <button 
                  onClick={() => setActiveStep(prev => prev + 1)}
                  className="px-6 py-2 rounded-xl bg-[#16B8A6] hover:bg-teal-400 text-[#101D35] text-xs font-extrabold flex items-center gap-1.5"
                >
                  Next Stage →
                </button>
              ) : (
                <button 
                  onClick={onStartOwn}
                  className="px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#101D35] text-xs font-extrabold flex items-center gap-1.5 animate-bounce"
                >
                  Start Your Own Journey Now!
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

// --- VIEW 3: ONBOARDING WIZARD ---
function OnboardingWizard({ profile, setProfile, onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ ...profile });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      setProfile(formData);
      onComplete();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
        
        {/* Wizard Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span>Step {step} of 4</span>
            <span className="text-[#16B8A6]">{step * 25}% Completed</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#16B8A6] h-full transition-all duration-300" 
              style={{ width: `${step * 25}%` }}
            />
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
          
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#101D35]">Personal & Contact Info</h2>
              <p className="text-xs text-slate-500">Let's set up your core student profile.</p>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#16B8A6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#16B8A6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Country of Residence</label>
                <input 
                  type="text"
                  disabled
                  value="Pakistan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#101D35]">Academic Qualifications</h2>
              <p className="text-xs text-slate-500">Used for university eligibility matching.</p>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Highest Qualification</label>
                <select 
                  value={formData.qualification}
                  onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#16B8A6]"
                >
                  <option>Bachelor's Degree</option>
                  <option>Master's Degree</option>
                  <option>FSc / Intermediate / A-Levels</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Institution Name</label>
                <input 
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({...formData, institution: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#16B8A6]"
                  placeholder="e.g. NUST, FAST, LUMS, University of Karachi"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CGPA / Percentage</label>
                  <input 
                    type="text"
                    required
                    value={formData.cgpa}
                    onChange={(e) => setFormData({...formData, cgpa: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#16B8A6]"
                    placeholder="3.4 / 4.0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Field of Study</label>
                  <input 
                    type="text"
                    required
                    value={formData.fieldOfStudy}
                    onChange={(e) => setFormData({...formData, fieldOfStudy: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#16B8A6]"
                    placeholder="Computer Science, EE, BBA"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#101D35]">Target Study Preferences</h2>
              <p className="text-xs text-slate-500">Where do you want to study?</p>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Destination Country</label>
                <select 
                  value={formData.targetCountry}
                  onChange={(e) => setFormData({...formData, targetCountry: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#16B8A6]"
                >
                  <option value="Germany">Germany (Tuition-Free Focus)</option>
                  <option value="United Kingdom">United Kingdom (PSW Route)</option>
                  <option value="United States">United States (STEM OPT)</option>
                  <option value="Canada">Canada (PGWP Track)</option>
                  <option value="Australia">Australia (Subclass 500)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">English Proficiency Test</label>
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    value={formData.ieltsStatus}
                    onChange={(e) => setFormData({...formData, ieltsStatus: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  >
                    <option>Completed</option>
                    <option>Planning to take</option>
                    <option>Not taking (MOI)</option>
                  </select>
                  <input 
                    type="text"
                    value={formData.ieltsScore}
                    onChange={(e) => setFormData({...formData, ieltsScore: e.target.value})}
                    placeholder="Score (e.g. 7.5)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#101D35]">Financial Budget & Experience</h2>
              <p className="text-xs text-slate-500">Helps customize blocked account & fee estimates.</p>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Available Budget (in PKR)</label>
                <input 
                  type="number"
                  required
                  value={formData.budgetPKR}
                  onChange={(e) => setFormData({...formData, budgetPKR: Number(e.target.value)})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#16B8A6]"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Approx PKR {(formData.budgetPKR / 1000000).toFixed(2)} Million
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work / Research Experience (Years)</label>
                <input 
                  type="text"
                  value={formData.workExpYears}
                  onChange={(e) => setFormData({...formData, workExpYears: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#16B8A6]"
                  placeholder="e.g. 1.5 Years"
                />
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Back
              </button>
            ) : <div />}
            
            <button 
              type="submit"
              className="px-6 py-2.5 bg-[#16B8A6] hover:bg-teal-400 text-[#101D35] font-extrabold text-sm rounded-xl shadow-lg transition-all"
            >
              {step === 4 ? 'Save & Go to Dashboard' : 'Continue Step'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// --- VIEW 4: STUDENT DASHBOARD ---
function DashboardView({ profile, savedUnis, onNavigate }) {
  const currentStageIndex = profile.stageIndex || 4;

  const smartRecommendations = [
    { title: 'Upload Updated Degree Transcript', tag: 'Document Action', desc: 'Ensure your FAST NUCES transcript scan is clear and free of missing margins.', priority: 'High' },
    { title: 'Complete Draft 2 of SOP', tag: 'SOP Studio', desc: 'Use AI SOP Studio to refine your motivation statement for TU Munich.', priority: 'Medium' },
    { title: 'Check Sperrkonto Rates', tag: 'Financial', desc: 'Review EUR exchange rate against PKR (Currently 1 EUR = ~302 PKR).', priority: 'Low' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-[#101D35] text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#16B8A6] uppercase tracking-wider bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
            Active Student Portal
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">
            Welcome back, {profile.fullName}! 👋
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Target: <strong className="text-teal-300">{profile.targetDegree} in {profile.targetCountry}</strong> | Intake: {profile.intake}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('copilot')}
            className="px-4 py-2.5 bg-[#16B8A6] hover:bg-teal-400 text-[#101D35] font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Ask AI Copilot
          </button>
          <button 
            onClick={() => onNavigate('sop')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700"
          >
            Open SOP Studio
          </button>
        </div>
      </div>

      {/* 12-Stage Visual Progress Tracker */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#101D35]">Your Application Progress</h2>
            <p className="text-xs text-slate-500">Stage {currentStageIndex + 1} of 12: {STAGES_LIST[currentStageIndex]}</p>
          </div>
          <span className="text-sm font-extrabold text-[#16B8A6] bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
            {Math.round(((currentStageIndex + 1) / 12) * 100)}% Roadmap Completed
          </span>
        </div>

        {/* Stage Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {STAGES_LIST.map((stageName, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div 
                key={idx}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isCompleted ? 'bg-emerald-50 border-emerald-300 text-emerald-900' :
                  isCurrent ? 'bg-[#101D35] border-[#16B8A6] text-white shadow-md' :
                  'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span>{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                  {isCompleted && <Check className="w-3 h-3 text-emerald-600" />}
                </div>
                <div className="text-xs font-bold line-clamp-2">{stageName}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Action Recommendations & Saved Unis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recommended Actions */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-[#101D35] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              What Should I Do Next?
            </h3>
            <span className="text-xs text-slate-400 font-mono">Dynamic AI Rules Active</span>
          </div>

          <div className="space-y-4">
            {smartRecommendations.map((rec, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-[#16B8A6]">
                      {rec.tag}
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold">{rec.priority} Priority</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#101D35]">{rec.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{rec.desc}</p>
                </div>
                <button 
                  onClick={() => onNavigate(rec.tag.includes('SOP') ? 'sop' : 'vault')}
                  className="px-3 py-1.5 rounded-lg bg-[#101D35] text-white text-xs font-bold hover:bg-slate-800 shrink-0"
                >
                  Action
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Universities & Shortlist */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-[#101D35]">Shortlisted Universities</h3>
            <button onClick={() => onNavigate('universities')} className="text-xs text-[#16B8A6] font-bold hover:underline">
              Find More
            </button>
          </div>

          <div className="space-y-3">
            {savedUnis.map((uniId) => {
              const uni = INITIAL_UNIVERSITIES.find(u => u.id === uniId) || { name: uniId, country: 'Germany', course: 'M.Sc. Program' };
              return (
                <div key={uniId} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#101D35]">{uni.name}</div>
                    <div className="text-[10px] text-slate-500">{uni.course} • {uni.country}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800">
                    Saved
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

// --- VIEW 5: AI COPILOT (ENGLISH, URDU, ROMAN URDU) ---
// ONE-LINE SWITCH: true = real AI (Netlify function), false = built-in answers only (instant, never fails)
const USE_REAL_AI = false;

function AICopilotView({ profile }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Assalam-o-Alaikum ${profile.fullName}! Main aapka VisionForge AI Study-Abroad Copilot hoon. Main English, Urdu, aur Roman Urdu teenon samajhta hoon. Aap German Blocked Account, SOP writing, ya admission requirements ke baare mein kuch bhi pooch sakte hain.`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const quickPrompts = [
    "Germany ke liye Blocked Account kitna chahiye aur kaise khulta hai?",
    "What are the IELTS requirements for UK PSW visa?",
    "FAST Karachi CGPA 3.4 ke saath kon konsi unis Germany mein best hain?",
    "SOP mein kin baaton se bachna chahiye?"
  ];

  // Built-in answers: used when USE_REAL_AI is false, or if the real AI cannot be reached
  const getFallbackAnswer = (query) => {
    const q = query.toLowerCase();
    const has = (pattern) => pattern.test(q);
    if (has(/\buk\b|psw|graduate route|united kingdom|britain/)) {
      return "UK mein Master's ke baad 2-year Graduate Route (PSW) visa milta hai. Universities usually overall 6.5 IELTS (minimum 6.0 in each module) demand karti hain. Bank statement 28 consecutive days ke liye maintain karna hota hai.";
    }
    if (has(/\bsop\b|statement of purpose/)) {
      return "SOP mein generic claims se bachen. Direct apne undergrad projects, FAST thesis, aur target university ke exact modules ko discuss karen. AI SOP Studio tab use karke first draft tayar karen!";
    }
    if (has(/canada|\bgic\b|pgwp/)) {
      return "Canada: GIC approx CAD 20,635 hai, tuition approx CAD 17,000-35,000 per year, IELTS usually overall 6.5. Graduation ke baad PGWP up to 3 years tak mil sakta hai. Official portal canada.ca zaroor check karein.";
    }
    if (has(/australia|subclass|\b485\b/)) {
      return "Australia: living cost requirement approx AUD 29,710 per year, tuition approx AUD 22,000-42,000, IELTS usually overall 6.5. Graduation ke baad Subclass 485 graduate visa available hai. Official Home Affairs portal check karein.";
    }
    if (has(/\busa\b|\bus visa\b|america|united states|\bf-?1\b|\bopt\b/)) {
      return "USA: tuition approx USD 20,000-45,000 per year. Process: I-20, SEVIS fee USD 350, DS-160 form aur F-1 visa interview. Graduation ke baad 1-year OPT (STEM mein 3 years). Official portal travel.state.gov check karein.";
    }
    if (has(/ielts/)) {
      return "IELTS: Germany, Canada aur Australia ke liye usually overall 6.5; UK mein course ke hisab se 6.0-7.0 (UKVI). Har university ki apni requirement hoti hai, isliye official admission page zaroor check karein.";
    }
    if (has(/scholarship|daad|funding/)) {
      return "Scholarships (jaise DAAD Germany ke liye) ki eligibility aur deadlines har saal change hoti hain. Official scholarship portal par latest details check karein aur Documents Vault mein apne papers pehle se ready rakhein.";
    }
    if (has(/cgpa|\bgpa\b|universit|\bunis?\b/) && has(/german|fast/)) {
      return "3.4 CGPA ke saath aap Germany ki top CS programs ke liye competitive hain: TUM (M.Sc. Informatics, minimum GPA 3.2/4.0) aur RWTH Aachen (M.Sc. Software Systems Engineering, minimum 3.0/4.0). Poori list aur match score dekhne ke liye Uni Matcher tab kholein.";
    }
    if (has(/german|blocked|sperrkonto|expatrio|fintiba/)) {
      return "Germany ke liye updated Blocked Account (Sperrkonto) requirement €11,904 hai (approx PKR 3.6 Million). Aap Expatrio ya Fintiba se Pakistan mein ghar baithe online account khol sakte hain. Process 2-3 business days mein complete ho jata hai. Public universities mein usually tuition fee nahi hoti.";
    }
    if (has(/^\s*(hi|hello|hey|salam|assalam)/)) {
      return "Wa alaikum assalam! Main VisionForge AI Copilot hoon. Aap Germany Blocked Account, UK PSW visa, IELTS, SOP ya scholarships ke baare mein pooch sakte hain.";
    }
    return "VisionForge AI abhi thoda busy hai. Please 5-10 seconds baad apna sawal dobara bhejein, ya neeche diye gaye quick prompts try karein.";
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim() || isThinking) return;

    const newMsgs = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgs);
    setInputText('');
    setIsThinking(true);

    let botAnswer;
    const startedAt = Date.now();
    for (let attempt = 0; USE_REAL_AI && attempt < 2 && !botAnswer; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 24000);
        const response = await fetch('/.netlify/functions/copilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMsgs, profile }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error('AI request failed: ' + response.status);
        const data = await response.json();
        if (!data.reply) throw new Error('Empty AI reply');
        botAnswer = data.reply;
      } catch (error) {
        // if it failed quickly, wait a moment and try once more; if it was already slow, stop waiting
        if (attempt === 0 && Date.now() - startedAt < 8000) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        } else {
          break;
        }
      }
    }
    if (!USE_REAL_AI) await new Promise(resolve => setTimeout(resolve, 700)); // short pause so it feels natural
    if (!botAnswer) botAnswer = getFallbackAnswer(query);

    setMessages(prev => [...prev, { sender: 'bot', text: botAnswer }]);
    setIsThinking(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[650px]">
        
        {/* Copilot Header */}
        <div className="bg-[#101D35] text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16B8A6] text-[#101D35] font-extrabold flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">VisionForge AI Copilot</h2>
              <p className="text-xs text-teal-300">Multilingual: English • اردو • Roman Urdu</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-950 text-emerald-400 font-mono px-3 py-1 rounded-full border border-emerald-800">
            Active Context: {profile.targetCountry}
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user' 
                    ? 'bg-[#16B8A6] text-[#101D35] font-semibold rounded-br-none shadow' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start">
              <div className="p-4 rounded-2xl rounded-bl-none bg-white border border-slate-200 shadow-sm text-xs text-slate-500">
                VisionForge AI is typing...
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors shrink-0"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Poochhen: Germany Blocked Account, SOP, Visa, or Eligibility..."
            className="flex-grow px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#16B8A6]"
          />
          <button 
            onClick={() => handleSend()}
            className="px-5 py-3 bg-[#101D35] hover:bg-slate-800 text-[#16B8A6] font-bold rounded-xl shadow transition-all flex items-center gap-1 text-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

// --- VIEW 6: SOP WRITING STUDIO ---
function SOPStudioView({ profile }) {
  const [academicMotiv, setAcademicMotiv] = useState('My BS Computer Science at FAST Karachi focused on machine learning and software architecture...');
  const [whyCountry, setWhyCountry] = useState('Germany provides world-class research labs and tuition-free public university education...');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSOP = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedDraft(
        `STATEMENT OF PURPOSE\n\nApplicant: ${profile.fullName}\nTarget Institution: Technical University of Munich\nProgram: Master of Science in Computer Science\n\n1. ACADEMIC BACKGROUND & MOTIVATION\nHaving graduated with a CGPA of ${profile.cgpa} in Computer Science from ${profile.institution}, I have developed a rigorous foundation in computational theory and software engineering. ${academicMotiv}\n\n2. WHY GERMANY & TARGET UNIVERSITIES\nChoosing Germany as my higher education destination aligns with my desire for technical depth. ${whyCountry}\n\n3. FUTURE GOALS\nUpon completion of my Master's degree, I intend to leverage this specialized knowledge to contribute back to the global software ecosystem.`
      );
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#101D35]">SOP Studio — Letter of Motivation Builder</h1>
        <p className="text-slate-600 text-sm mt-1">Draft authentic, personalized SOPs for German, UK, and US university applications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Prompts Input Panel */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#101D35] border-b border-slate-100 pb-3">
            1. Input Your Academic Details
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Background & Projects</label>
            <textarea 
              rows={4}
              value={academicMotiv}
              onChange={(e) => setAcademicMotiv(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#16B8A6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Why This Target Country & Course?</label>
            <textarea 
              rows={4}
              value={whyCountry}
              onChange={(e) => setWhyCountry(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#16B8A6]"
            />
          </div>

          <button 
            onClick={handleGenerateSOP}
            disabled={isGenerating}
            className="w-full py-3 bg-[#16B8A6] hover:bg-teal-400 text-[#101D35] font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate Draft SOP
          </button>
        </div>

        {/* Live Draft & PDF Export Panel */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-bold text-[#101D35]">2. Live Draft Editor</h3>
              <span className="text-xs font-mono text-slate-500">
                Word Count: {generatedDraft ? generatedDraft.split(/\s+/).length : 0} words
              </span>
            </div>

            <textarea 
              rows={14}
              value={generatedDraft}
              onChange={(e) => setGeneratedDraft(e.target.value)}
              placeholder="Your generated SOP draft will appear here. You can freely edit every sentence."
              className="w-full p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-[#16B8A6] bg-slate-50"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              Draft saved locally • VisionForge SOP Engine v2.4
            </span>
            <button 
              onClick={() => alert("Downloading SOP Draft PDF Preview...")}
              className="px-4 py-2 bg-[#101D35] hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-[#16B8A6]" /> Export PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- VIEW 7: COUNTRY EXPLORER ---
function CountryExplorerView({ savedUnis, setSavedUnis, onSelectUni }) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES_DATA[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
        {COUNTRIES_DATA.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCountry(c)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              selectedCountry.id === c.id 
                ? 'bg-[#101D35] text-white shadow-md border-b-2 border-[#16B8A6]' 
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{c.flag}</span>
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* Country Detail Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{selectedCountry.flag}</div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#101D35]">{selectedCountry.name} Education Roadmap</h1>
              <span className="text-xs text-slate-500 font-mono">
                Official Portal Verified: {selectedCountry.verifiedDate}
              </span>
            </div>
          </div>
          
          <a 
            href={selectedCountry.officialPortal} 
            target="_blank" 
            rel="noreferrer"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2"
          >
            Official Government Source <ExternalLink className="w-3.5 h-3.5 text-[#16B8A6]" />
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Average Tuition</div>
            <div className="text-xs font-bold text-[#101D35] mt-1">{selectedCountry.avgTuition}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Living / Bank Proof</div>
            <div className="text-xs font-bold text-[#101D35] mt-1">{selectedCountry.avgLiving}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Language Requirement</div>
            <div className="text-xs font-bold text-[#101D35] mt-1">{selectedCountry.languageReq}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Post-Study Visa</div>
            <div className="text-xs font-bold text-[#101D35] mt-1">{selectedCountry.postStudyVisa}</div>
          </div>
        </div>

        {/* Tailored Country Checklist */}
        <div>
          <h3 className="text-base font-bold text-[#101D35] mb-4">
            Official Document & Visa Checklist ({selectedCountry.name})
          </h3>
          <div className="space-y-3">
            {selectedCountry.checklist.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 accent-[#16B8A6]" />
                  <div>
                    <span className="text-xs font-bold text-[#101D35] block">{item.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Category: {item.category}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  Mandatory
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- VIEW 8: UNIVERSITY & COURSE MATCHER ---
function UniversityMatcher({ profile, savedUnis, setSavedUnis }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUnis = useMemo(() => {
    return INITIAL_UNIVERSITIES.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.course.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const toggleSave = (id) => {
    if (savedUnis.includes(id)) {
      setSavedUnis(savedUnis.filter(x => x !== id));
    } else {
      setSavedUnis([...savedUnis, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#101D35]">University & Course Matcher</h1>
          <p className="text-slate-600 text-sm">Matching against your profile ({profile.qualification}, CGPA {profile.cgpa}).</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text"
            placeholder="Search university or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#16B8A6]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUnis.map((uni) => {
          const isSaved = savedUnis.includes(uni.id);
          return (
            <div key={uni.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">{uni.country} • {uni.city}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    uni.matchPotential === 'Strong Match' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {uni.matchPotential}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#101D35]">{uni.name}</h3>
                <p className="text-xs font-semibold text-[#16B8A6] mt-1">{uni.course}</p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div><strong>Tuition Fee:</strong> {uni.tuition}</div>
                  <div><strong>Academic Req:</strong> {uni.gpaReq}</div>
                  <div><strong>IELTS Score:</strong> {uni.ieltsReq}</div>
                  <div><strong>Intake Deadline:</strong> {uni.deadline}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <a 
                  href={uni.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
                >
                  Official Site <ExternalLink className="w-3 h-3" />
                </a>

                <button 
                  onClick={() => toggleSave(uni.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    isSaved 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-[#101D35] text-white hover:bg-slate-800'
                  }`}
                >
                  {isSaved ? 'Shortlisted ✓' : '+ Shortlist Course'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- VIEW 9: DOCUMENT VAULT & HEALTH CHECK ---
function DocumentVaultView({ profile }) {
  const [docs, setDocs] = useState([
    { name: 'Bachelor Degree Certificate (FAST)', status: 'Verified', date: '2026-10-01' },
    { name: 'Official Academic Transcript', status: 'Needs Review', date: '2026-10-05', note: 'Page 2 scan slightly blurred' },
    { name: 'IELTS Academic Test Result', status: 'Verified', date: '2026-09-12' },
    { name: 'Passport Copy (Valid till 2029)', status: 'Verified', date: '2026-08-20' },
    { name: 'Statement of Purpose (SOP)', status: 'Drafting', date: '2026-11-02' }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#101D35]">Document Vault & Health Check</h1>
          <p className="text-slate-600 text-sm">Securely organize application scans and run health integrity checks.</p>
        </div>
        
        <button 
          onClick={() => alert("Simulating file upload...")}
          className="px-4 py-2.5 bg-[#16B8A6] hover:bg-teal-400 text-[#101D35] font-extrabold text-xs rounded-xl shadow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        {docs.map((doc, idx) => (
          <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-slate-500" />
              <div>
                <h4 className="text-xs font-bold text-[#101D35]">{doc.name}</h4>
                <span className="text-[10px] text-slate-400 font-mono">Uploaded: {doc.date}</span>
                {doc.note && <p className="text-[10px] text-amber-700 mt-0.5">{doc.note}</p>}
              </div>
            </div>

            <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
              doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
              doc.status === 'Needs Review' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
            }`}>
              {doc.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- VIEW 10: FINANCIAL PLANNER ---
function FinancialPlannerView({ profile }) {
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const rate = targetCurrency === 'EUR' ? 302.5 : targetCurrency === 'GBP' ? 355 : 279;

  const tuitionForeign = 1500; // EUR admin fee/tuition
  const livingForeign = 11904; // Blocked account

  const totalPKR = (tuitionForeign + livingForeign) * rate;
  const userBudget = profile.budgetPKR || 3500000;
  const difference = userBudget - totalPKR;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#101D35]">PKR Financial Planner</h1>
        <p className="text-slate-600 text-sm">Estimate total expenses in PKR for your target destination.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-slate-700">Select Target Currency</span>
          <select 
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
          >
            <option value="EUR">Euro (€) - Germany</option>
            <option value="GBP">Pound (£) - UK</option>
            <option value="USD">Dollar ($) - USA</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Estimated Tuition</span>
            <div className="text-lg font-bold text-[#101D35] mt-1">{targetCurrency} {tuitionForeign}</div>
            <div className="text-[10px] text-slate-400 mt-1">PKR {(tuitionForeign * rate).toLocaleString()}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Blocked Bank Proof</span>
            <div className="text-lg font-bold text-[#101D35] mt-1">{targetCurrency} {livingForeign}</div>
            <div className="text-[10px] text-slate-400 mt-1">PKR {(livingForeign * rate).toLocaleString()}</div>
          </div>

          <div className="p-4 bg-[#101D35] text-white rounded-2xl">
            <span className="text-[10px] text-teal-400 font-bold uppercase">Total Estimated Budget</span>
            <div className="text-lg font-bold text-white mt-1">PKR {Math.round(totalPKR).toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 mt-1">Calculated at 1 {targetCurrency} = {rate} PKR</div>
          </div>
        </div>

        {/* Shortfall / Surplus Indicator */}
        <div className={`p-4 rounded-2xl border ${difference >= 0 ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'}`}>
          <div className="text-xs font-bold">
            {difference >= 0 
              ? `Budget Surplus: PKR ${Math.round(difference).toLocaleString()} (Your available budget covers all estimated costs!)`
              : `Budget Shortfall: PKR ${Math.abs(Math.round(difference)).toLocaleString()} (Consider Deutschlandstipendium scholarships)`
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// --- VIEW 11: ADMIN DASHBOARD VIEW ---
function AdminDashboardView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-[#101D35] text-white p-6 rounded-3xl border border-slate-800">
        <h1 className="text-2xl font-extrabold text-white">VisionForge Platform Admin Workspace</h1>
        <p className="text-xs text-teal-300">Manage country checklists, official source dates, and platform stats.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200">
          <div className="text-xs text-slate-500 font-bold">Total Registered Students</div>
          <div className="text-2xl font-black text-[#101D35] mt-1">1,248</div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200">
          <div className="text-xs text-slate-500 font-bold">Active Applications</div>
          <div className="text-2xl font-black text-[#16B8A6] mt-1">842</div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200">
          <div className="text-xs text-slate-500 font-bold">Managed Countries</div>
          <div className="text-2xl font-black text-[#101D35] mt-1">5</div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200">
          <div className="text-xs text-slate-500 font-bold">Verified Data Sources</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">100%</div>
        </div>
      </div>
    </div>
  );
}
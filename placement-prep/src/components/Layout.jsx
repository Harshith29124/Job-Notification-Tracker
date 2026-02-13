import { Outlet, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const STEPS = [
    { path: '/dashboard', label: 'Dashboard', step: 1 },
    { path: '/practice', label: 'Practice', step: 2 },
    { path: '/assessments', label: 'Analyze JD', step: 3 },
    { path: '/results', label: 'Report', step: 3 },
    { path: '/history', label: 'Archive', step: 4 },
    { path: '/resources', label: 'Resources', step: 5 },
    { path: '/profile', label: 'Profile', step: 6 },
    { path: '/test-checklist', label: 'QA Center', step: 7 },
    { path: '/shipping-verification', label: 'Ship Gate', step: 8 },
];

export default function Layout() {
    const location = useLocation();
    const currentStep = STEPS.find(s => location.pathname === s.path) || { step: 0, label: 'Navigation' };

    // QA Persistence for Proof Footer
    const [qaStatus, setQaStatus] = useState(() => {
        const saved = localStorage.getItem('prp_proof_footer');
        return saved ? JSON.parse(saved) : { ui: false, logic: false, test: false, deploy: false };
    });

    useEffect(() => {
        localStorage.setItem('prp_proof_footer', JSON.stringify(qaStatus));
    }, [qaStatus]);

    const toggleQa = (key) => setQaStatus(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-accent/10">
            {/* Top Bar */}
            <nav className="h-auto min-h-[72px] bg-white border-b border-border px-4 lg:px-10 py-4 flex flex-wrap items-center justify-between sticky top-0 z-[100] gap-4">
                <div className="font-black text-[18px] lg:text-[20px] text-accent tracking-tight uppercase">Placement Prep</div>

                <div className="bg-background px-3 lg:px-4 py-2 rounded-[8px] text-[11px] font-bold text-slate-500 uppercase tracking-widest border border-border/50">
                    Step {currentStep.step} / 8
                </div>

                <div className="flex items-center gap-4">
                    <div className={`px-3 lg:px-4 py-1.5 rounded-[12px] text-[10px] lg:text-[11px] font-black uppercase tracking-widest border border-current ${qaStatus.deploy ? 'bg-success/10 text-success' : 'bg-warning-soft text-warning'}`}>
                        {qaStatus.deploy ? 'Shipped' : (qaStatus.ui ? 'In Progress' : 'Not Started')}
                    </div>
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-bone border border-border flex items-center justify-center font-black text-accent text-sm lg:text-base">H</div>
                </div>
            </nav>

            {/* Context Header */}
            <header className="bg-white border-b border-border px-10 pt-10 pb-8">
                <div className="max-w-[1440px] mx-auto">
                    <h1 className="heading-lg text-text-primary mb-2">{getHeaderTitle(location.pathname)}</h1>
                    <p className="text-slate-500 font-medium text-[18px]">{getHeaderSubtext(location.pathname)}</p>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row p-4 lg:p-10 gap-6 lg:gap-10">
                {/* Primary Workspace (70%) */}
                <section className="w-full lg:flex-[0_0_70%] min-w-0">
                    <Outlet />
                </section>

                {/* Secondary Panel (30%) */}
                <aside className="w-full lg:flex-[0_0_30%] space-y-6">
                    <div className="card-premium p-6 border-accent/20">
                        <h3 className="text-[18px] font-bold mb-4 uppercase tracking-tighter text-accent">Intelligence Navigation</h3>
                        <nav className="space-y-1">
                            {STEPS.filter(s => s.label !== 'Report').map(s => (
                                <Link
                                    key={s.path}
                                    to={s.path}
                                    className={`block px-4 py-3 rounded text-sm font-bold transition-all ${location.pathname === s.path ? 'bg-accent text-white' : 'text-slate-600 hover:bg-background'}`}
                                >
                                    {s.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="card-premium p-6 bg-accent/[0.02]">
                        <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-3">Context Engine</h4>
                        <div className="bg-background p-4 border border-border rounded text-[13px] font-mono text-slate-600 whitespace-pre-wrap">
                            PLATFORM_STATE: {location.pathname.toUpperCase()}
                            AGENT_CONTEXT: ACTIVE
                            INTEGRITY: {qaStatus.test ? 'VERIFIED' : 'PENDING'}
                        </div>
                    </div>
                </aside>
            </main>

            {/* Proof Footer */}
            <footer className="h-auto min-h-[64px] bg-white border-t border-border px-4 lg:px-10 py-4 flex flex-wrap items-center justify-center gap-4 lg:gap-10 sticky bottom-0 z-[100]">
                <ProofCheck label="UI Built" checked={qaStatus.ui} onClick={() => toggleQa('ui')} />
                <ProofCheck label="Logic Working" checked={qaStatus.logic} onClick={() => toggleQa('logic')} />
                <ProofCheck label="Test Passed" checked={qaStatus.test} onClick={() => toggleQa('test')} />
                <ProofCheck label="Deployed" checked={qaStatus.deploy} onClick={() => toggleQa('deploy')} />
            </footer>
        </div>
    );
}

function ProofCheck({ label, checked, onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 group transition-all"
        >
            <div className={`w-5 h-5 border-2 rounded transition-all flex items-center justify-center ${checked ? 'bg-accent border-accent text-white' : 'border-border bg-background group-hover:border-accent/50'}`}>
                {checked && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
            <span className={`text-[13px] font-bold uppercase tracking-widest transition-colors ${checked ? 'text-accent' : 'text-slate-400 group-hover:text-slate-600'}`}>
                {label}
            </span>
        </button>
    );
}

function getHeaderTitle(path) {
    if (path === '/dashboard') return 'Readiness Dashboard';
    if (path === '/assessments') return 'Intelligence Engine';
    if (path === '/results') return 'Diagnostic Strategy';
    if (path === '/history') return 'Analysis Archive';
    if (path === '/practice') return 'Skill Simulation';
    if (path === '/resources') return 'Knowledge Base';
    if (path === '/profile') return 'Candidate Profile';
    if (path === '/test-checklist') return 'Quality Assurance';
    if (path === '/shipping-verification') return 'Shipment Protocol';
    return 'Placement Prep';
}

function getHeaderSubtext(path) {
    if (path === '/dashboard') return 'Strategic overview of your placement readiness components.';
    if (path === '/assessments') return 'Input job descriptions for clinical requirement extraction.';
    if (path === '/results') return 'Personalized preparation roadmap and skill gap analysis.';
    if (path === '/history') return 'Revisit historical diagnostic strategies and reports.';
    if (path === '/test-checklist') return 'Verify system integrity before final deployment phase.';
    return 'Authoritative career intelligence for high-stakes recruitment.';
}

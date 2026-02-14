import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    CheckSquare,
    Ship,
    ChevronLeft,
    ChevronRight,
    Terminal,
    Activity,
    ShieldCheck
} from 'lucide-react';

const MENU_ITEMS = [
    { id: 1, label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 2, label: 'Practice Lab', path: '/practice', icon: <BookOpen size={20} /> },
    { id: 3, label: 'Analysis Engine', path: '/assessments', icon: <Activity size={20} /> },
    { id: 7, label: 'Quality Center', path: '/test-checklist', icon: <CheckSquare size={20} /> },
    { id: 8, label: 'Shipment Gate', path: '/ship-ready', icon: <Ship size={20} /> }
];

export default function Layout({ children }) {
    const location = useLocation();
    const [status, setStatus] = useState({ ui: true, logic: true, test: false, deploy: false });

    useEffect(() => {
        const checkStatus = () => {
            const savedStatus = JSON.parse(localStorage.getItem('prp_proof_footer') || '{"ui":true,"logic":true,"test":false,"deploy":false}');
            setStatus(savedStatus);
        };
        checkStatus();
        window.addEventListener('storage', checkStatus);
        return () => window.removeEventListener('storage', checkStatus);
    }, []);

    return (
        <div className="min-h-screen bg-background text-text-primary selection:bg-accent selection:text-white">
            {/* Platinum Navigation Header */}
            <nav className="fixed top-0 left-0 right-0 h-24 bg-white/70 backdrop-blur-3xl border-b border-border z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-500">
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-text-primary text-white flex items-center justify-center font-black text-xl transition-all duration-500 group-hover:bg-accent group-hover:rotate-12">K</div>
                        <div className="hidden sm:block">
                            <div className="font-serif font-black text-xl uppercase tracking-tighter leading-none">KodNest <span className="text-accent underline decoration-4 underline-offset-4">Prep</span></div>
                            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">Platinum Intelligence Suite</div>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar py-2">
                    {MENU_ITEMS.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`flex items-center gap-3 px-6 py-3 rounded-none border-b-2 transition-all duration-500 whitespace-nowrap ${isActive ? 'border-accent bg-accent/5 text-accent' : 'border-transparent text-slate-400 hover:text-text-primary hover:bg-slate-50'}`}
                            >
                                <span className={isActive ? 'animate-pulse' : ''}>{item.icon}</span>
                                <span className="text-[11px] font-black uppercase tracking-widest hidden lg:block">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="hidden xl:flex items-center gap-8 border-l border-border pl-8">
                    <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">System Health</div>
                        <div className="flex items-center gap-2 text-success font-mono text-[11px] font-bold">
                            <Activity size={12} className="animate-pulse" /> 0.4ms LATENCY
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Domain */}
            <main className="pt-32 pb-32 min-h-screen">
                <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                    {children}
                </div>
            </main>

            {/* Persistent Platinum Footer */}
            <footer className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-3xl border-t border-border z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-500">
                <div className="flex items-center gap-10 overflow-x-auto no-scrollbar">
                    <StatusItem label="UI_LAYER" ready={status.ui} />
                    <StatusItem label="HEURISTIC_CORE" ready={status.logic} />
                    <StatusItem label="INTEGRITY_AUDIT" ready={status.test} />
                    <StatusItem label="SHIPMENT_GATE" ready={status.deploy} />
                </div>
                <div className="hidden md:flex items-center gap-4 font-mono text-[10px] font-black text-slate-400 tracking-widest">
                    <Terminal size={12} /> V3.0.0-PLA SECURITY_HANDSHAKE
                </div>
            </footer>
        </div>
    );
}

function StatusItem({ label, ready }) {
    return (
        <div className={`flex items-center gap-3 transition-all duration-500 ${ready ? 'text-success' : 'text-slate-300'}`}>
            <span className={`w-2 h-2 rounded-none rotate-45 ${ready ? 'bg-success animate-pulse' : 'bg-slate-200'}`}></span>
            <span className="text-[11px] font-black uppercase tracking-widest font-mono">{label}</span>
            {ready && <ShieldCheck size={12} className="shrink-0" />}
        </div>
    );
}

import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Circle, AlertCircle, Info, ChevronRight } from 'lucide-react';

const QA_PROTOCOLS = [
    { id: 'env', title: 'Environment Configuration', desc: 'Verify API endpoints and environment variables.', category: 'Infrastructure' },
    { id: 'data', title: 'Data Persistence Layer', desc: 'Ensure LocalStorage encryption and cache integrity.', category: 'Core Engine' },
    { id: 'ui', title: 'Interface Adherence', desc: 'Validate typography, spacing, and accent conformity.', category: 'Design System' },
    { id: 'logic', title: 'Heuristic Accuracy', desc: 'Process a sample JD to verify extraction logic.', category: 'Intelligence' },
    { id: 'res', title: 'Responsive Optimization', desc: 'Check layout stability across mobile/tablet views.', category: 'Platform' },
    { id: 'sec', title: 'Security Audit', desc: 'Verify data sanitization and preventing XSS in JD inputs.', category: 'Security' },
    { id: 'perf', title: 'Performance Benchmark', desc: 'Ensure diagnostic processing completes under 200ms.', category: 'Optimization' },
    { id: 'ux', title: 'UX Flow Verification', desc: 'Confirm navigation logic and back-button stability.', category: 'Interaction' },
    { id: 'seo', title: 'SEO Meta Validation', desc: 'Check presence of meta tags and descriptive titles.', category: 'Visibility' },
    { id: 'ship', title: 'Shipment Readiness', desc: 'Final check of all build artifacts and deployment configurations.', category: 'DevOps' }
];

export default function TestChecklist() {
    const [checked, setChecked] = useState(() => {
        const saved = localStorage.getItem('prp_qa_completed');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('prp_qa_completed', JSON.stringify(checked));

        // Track step 7 completion for the proof overview
        const progress = JSON.parse(localStorage.getItem('prp_steps_progress') || '{}');
        progress[7] = true;
        localStorage.setItem('prp_steps_progress', JSON.stringify(progress));
    }, [checked]);

    const toggle = (id) => {
        setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const progressPercentage = Math.round((checked.length / QA_PROTOCOLS.length) * 100);

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-8 gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                        Platform Integrity Protocol
                    </div>
                    <h2 className="heading-md uppercase">Quality Assurance Center</h2>
                    <p className="text-slate-500 font-medium text-sm md:text-base">Validating system core integrity for clinical recruitment readiness.</p>
                </div>
                <div className="flex items-center gap-5 bg-background border border-border px-6 py-3 shrink-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Integrity Score</span>
                    <span className="text-[20px] font-serif font-black text-accent">{checked.length} <span className="text-[14px] text-slate-300">/ 10</span></span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {QA_PROTOCOLS.map((protocol) => {
                    const isDone = checked.includes(protocol.id);
                    return (
                        <div
                            key={protocol.id}
                            onClick={() => toggle(protocol.id)}
                            className={`card-premium !p-6 flex items-center justify-between cursor-pointer transition-all duration-300 group ${isDone ? 'border-success/30 bg-success/[0.02]' : 'hover:border-accent/40'}`}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-11 h-11 border-2 rounded-none flex items-center justify-center transition-all duration-500 flex-shrink-0 ${isDone ? 'bg-success border-success text-white' : 'border-border bg-background text-slate-300 group-hover:border-accent/40'}`}>
                                    {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className={`text-[15px] md:text-[16px] font-serif font-black transition-colors ${isDone ? 'text-text-primary' : 'text-text-primary'}`}>{protocol.title}</h3>
                                        <span className="text-[8px] font-black uppercase tracking-[0.1em] text-slate-400 px-1.5 py-0.5 border border-border bg-white">{protocol.category}</span>
                                    </div>
                                    <p className="text-slate-500 text-[12px] font-medium leading-tight max-w-[240px] md:max-w-full">{protocol.desc}</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className={`transition-all duration-500 flex-shrink-0 sm:block hidden ${isDone ? 'text-success' : 'text-slate-200 group-hover:text-accent group-hover:translate-x-1'}`} />
                        </div>
                    );
                })}
            </div>

            <div className={`p-8 md:p-10 border flex flex-col md:flex-row items-center md:items-start gap-8 transition-all duration-500 ${checked.length === 10 ? 'bg-success/5 border-success/30' : 'bg-accent/5 border-accent/20'}`}>
                <div className={`w-14 h-14 md:w-16 md:h-16 flex-shrink-0 flex items-center justify-center border transition-all duration-500 ${checked.length === 10 ? 'bg-white border-success/20 text-success shadow-lg shadow-success/10' : 'bg-white border-accent/20 text-accent'}`}>
                    {checked.length === 10 ? <ShieldCheck size={32} /> : <AlertCircle size={32} />}
                </div>
                <div className="space-y-3 text-center md:text-left">
                    <h4 className={`text-[20px] md:text-[22px] font-serif font-black ${checked.length === 10 ? 'text-success' : 'text-text-primary'}`}>
                        {checked.length === 10 ? 'Pre-Flight Authorization Granted' : 'Verification Status: Pending'}
                    </h4>
                    <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed max-w-3xl">
                        {checked.length === 10
                            ? 'All platform layers have been verified against the KodNest Premium standards. The system architecture is now authorized for clinical production shipment.'
                            : `Strategic deployment is currently restricted until all 10 core integrity protocols are verified. Only ${checked.length} of 10 protocols have been authorized.`}
                    </p>
                </div>
            </div>
        </div>
    );
}

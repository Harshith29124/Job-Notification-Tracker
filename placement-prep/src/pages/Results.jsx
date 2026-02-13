import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAnalysisById, getLastAnalysis, updateAnalysis } from '../utils/analysisEngine';
import {
    CheckCircle2,
    Calendar,
    Target,
    Sparkles,
    ArrowLeft,
    ChevronRight,
    Circle,
    Copy,
    Download,
    Check,
    Building2,
    Truck,
    Info,
    Layout
} from 'lucide-react';

export default function Results() {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState(null);
    const [copyStatus, setCopyStatus] = useState({});
    const navigate = useNavigate();
    const id = searchParams.get('id');

    useEffect(() => {
        const analysis = id ? getAnalysisById(id) : getLastAnalysis();
        if (!analysis) {
            navigate('/assessments');
        } else {
            setData(analysis);
        }
    }, [id, navigate]);

    const handleToggleSkill = (skill) => {
        if (!data) return;
        const currentConf = data.skillConfidenceMap?.[skill] || 'practice';
        const newConf = currentConf === 'know' ? 'practice' : 'know';
        const newMap = { ...data.skillConfidenceMap, [skill]: newConf };

        // Pass to engine to calculate finalScore based on stability rules
        const updatedData = updateAnalysis(data.id, { skillConfidenceMap: newMap });
        if (updatedData) setData(updatedData);
    };

    const handleCopy = (type, text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyStatus({ ...copyStatus, [type]: true });
            setTimeout(() => setCopyStatus({ ...copyStatus, [type]: false }), 2000);
        });
    };

    const handleDownload = () => {
        if (!data) return;
        const skillsContent = Object.entries(data.extractedSkills)
            .filter(([_, skills]) => skills.length > 0)
            .map(([cat, skills]) => `${cat.toUpperCase()}: ${skills.join(', ')}`)
            .join('\n');

        const content = `
ANALYSIS RESULT: ${data.role} at ${data.company}
READINESS SCORE: ${data.finalScore}/100
DATE: ${new Date(data.createdAt).toLocaleDateString()}

SKILLS DETECTED:
${skillsContent}

RECRUITMENT PIPELINE:
${data.roundMapping?.map((r, i) => `Round ${i + 1}: ${r.roundTitle} (${r.focusAreas.join(', ')})`).join('\n')}

7-DAY ACTION PLAN:
${data.plan7Days.map(p => `${p.day} (${p.focus}):\n - ${p.tasks.join('\n - ')}`).join('\n\n')}
        `.trim();
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `prep-plan-${data.id}.txt`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    if (!data) return null;

    const allSkills = Object.values(data.extractedSkills).flat();

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
            <header className="flex items-center justify-between">
                <button onClick={() => navigate('/assessments')} className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold transition-colors">
                    <ArrowLeft size={20} /> New Analysis
                </button>
                <div className="flex gap-4">
                    <button onClick={handleDownload} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-primary hover:border-primary/20 transition-all font-bold group">
                        <Download size={20} className="group-hover:-translate-y-1 transition-transform" /> Download Plan
                    </button>
                </div>
            </header>

            <section className="bg-primary text-white rounded-[2.5rem] p-12 relative overflow-hidden shadow-2xl shadow-primary/30">
                <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-150"><Sparkles size={200} /></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="relative w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 flex-shrink-0 text-center">
                        <div>
                            <span className="text-6xl font-black block leading-none">{data.finalScore}</span>
                            <span className="text-sm font-bold opacity-80 uppercase tracking-widest">Score</span>
                        </div>
                        <svg className="absolute inset-0 -rotate-90">
                            <circle cx="96" cy="96" r="90" className="stroke-white/10 fill-none stroke-[6]" />
                            <circle cx="96" cy="96" r="90" style={{ strokeDasharray: 565, strokeDashoffset: 565 - (data.finalScore / 100) * 565, transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} className="stroke-white fill-none stroke-[6] stroke-round" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <p className="text-white/70 font-bold uppercase tracking-[0.2em] text-xs">Strategy Report</p>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-black uppercase">v2.0 Harden</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-3">{data.role || 'Strategic Candidate'}</h1>
                        <p className="text-2xl font-medium text-white/90">at {data.company || 'Market Network Enterprise'}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <ExportButton icon={copyStatus.raw ? <Check size={18} /> : <Copy size={18} />} label="Copy Brief" onClick={() => handleCopy('raw', `Preparing for ${data.role} at ${data.company}`)} />
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">

                    {/* Round Mapping Engine */}
                    <Section icon={<Layout className="text-primary" />} title="Recruitment Flow Architect">
                        <div className="relative ml-4 border-l-2 border-slate-100 pl-8 space-y-10 py-4">
                            {data.roundMapping?.map((round, idx) => (
                                <div key={idx} className="relative group">
                                    <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-white border-4 border-primary shadow-sm group-hover:scale-125 transition-transform z-10"></div>
                                    <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2rem] group-hover:border-primary/20 transition-all">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-black text-slate-900 text-lg">Round {idx + 1}: {round.roundTitle}</h4>
                                            <div className="flex gap-2">
                                                {round.focusAreas.map(f => (
                                                    <span key={f} className="bg-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20">{f}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Why this round matters</p>
                                            <p className="text-sm text-slate-600 font-bold leading-relaxed italic">"{round.whyItMatters}"</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section icon={<CheckCircle2 className="text-primary" />} title="Strategic Checklist">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.checklist?.map((check, idx) => (
                                <div key={idx} className="bg-slate-50 border border-slate-200 p-6 rounded-3xl hover:border-primary/20 transition-all group">
                                    <h4 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-tighter flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        {check.roundTitle}
                                    </h4>
                                    <ul className="space-y-3">
                                        {check.items.map((item, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">
                                                <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center flex-shrink-0">
                                                    <Check size={10} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section icon={<Target className="text-primary" />} title="Skill Assessment Matrix">
                        <div className="space-y-8">
                            {Object.entries(data.extractedSkills).map(([cat, skills]) => skills.length > 0 && (
                                <div key={cat}>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{cat}</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {skills.map(s => {
                                            const isKnown = data.skillConfidenceMap?.[s] === 'know';
                                            return (
                                                <button key={s} onClick={() => handleToggleSkill(s)} className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all border flex items-center gap-2 ${isKnown ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-primary/30 hover:text-primary'}`}>
                                                    {isKnown ? <Check size={14} /> : <Circle size={4} fill="currentColor" className="opacity-30" />}
                                                    {s}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                    <Section icon={<Calendar className="text-primary" />} title="Preparation Roadmap">
                        <div className="space-y-6">
                            {data.plan7Days.map((p, idx) => (
                                <div key={idx} className="flex gap-6 group">
                                    <div className="flex-shrink-0 w-24">
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                                            <span className="text-[10px] font-black text-slate-400 uppercase block tracking-widest">{p.day.split(' ')[0]}</span>
                                            <span className="text-lg font-black text-primary">{p.day.split(' ')[1]}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h4 className="text-lg font-black text-slate-900">{p.focus}</h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {p.tasks.map((t, ti) => (
                                                <li key={ti} className="flex items-center gap-3 text-sm font-bold text-slate-600 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-all">
                                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                                    {t}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>

                <div className="space-y-10">
                    {/* Company Intel Block */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-primary/10 text-primary rounded-xl"><Building2 size={24} /></div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Company Intel</h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Industry & Tier</h4>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-800">{data.companyIntel?.industry || "Tech Services"}</span>
                                    <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-black">{data.companyIntel?.sizeCategory || "Startup"}</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Hiring Philosophy</h4>
                                <p className="text-sm font-bold text-slate-600 leading-relaxed">{data.companyIntel?.hiringFocus}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-primary/10 text-primary rounded-xl"><Target size={24} /></div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Focus Tactics</h3>
                        </div>
                        <div className="space-y-4">
                            {data.plan7Days.slice(0, 2).map((p, i) => (
                                <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{p.day}: {p.focus}</h4>
                                    <ul className="space-y-2">
                                        {p.tasks.slice(0, 2).map((t, ti) => (
                                            <li key={ti} className="text-xs font-bold text-slate-600 flex items-center gap-2">
                                                <div className="w-1 h-1 bg-primary rounded-full"></div> {t}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-50 flex items-start gap-2 italic">
                            <Info size={14} className="text-slate-300 mt-1 flex-shrink-0" />
                            <p className="text-[10px] text-slate-400 font-medium">Scores only update when skills are toggled as "Known".</p>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                        <h3 className="text-2xl font-black mb-6 relative z-10 text-primary italic">Action Next</h3>
                        <p className="text-slate-400 text-sm mb-10 leading-relaxed relative z-10">Strategy recommendation:<br /><span className="text-white font-black italic">"Begin your {data.plan7Days[0]?.focus} sprint immediately."</span></p>
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full py-5 bg-primary rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 shadow-xl shadow-primary/20">Begin Prep Sprint <ChevronRight size={18} /></button>
                        <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform"><Target size={150} /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ icon, title, children }) {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/5 group-hover:bg-primary transition-colors"></div>
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform duration-500">{icon}</div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
            </div>
            {children}
        </div>
    );
}

function ExportButton({ icon, label, onClick, active }) {
    return (
        <button onClick={onClick} className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-sm transition-all border backdrop-blur-sm ${active ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'}`}>{icon} {active ? 'Copied' : label}</button>
    );
}

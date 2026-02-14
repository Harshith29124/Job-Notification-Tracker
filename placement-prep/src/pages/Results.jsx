import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAnalysisById, getLastAnalysis, updateAnalysis } from '../utils/analysisEngine';
import {
    CheckCircle2,
    Calendar,
    Target,
    Sparkles,
    ArrowLeft,
    Circle,
    Copy,
    Download,
    Check,
    Building2,
    Layout,
    ArrowRight
} from 'lucide-react';

export default function Results() {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState(null);
    const [copyStatus, setCopyStatus] = useState({});
    const navigate = useNavigate();
    const id = searchParams.get('id');

    useEffect(() => {
        // Track step 3 completion
        const progress = JSON.parse(localStorage.getItem('prp_steps_progress') || '{}');
        progress[3] = true;
        localStorage.setItem('prp_steps_progress', JSON.stringify(progress));

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

        const content = `ANALYSIS RESULT: ${data.role} at ${data.company}\nREADINESS SCORE: ${data.finalScore}/100\nDATE: ${new Date(data.createdAt).toLocaleDateString()}\n\nSKILLS DETECTED:\n${skillsContent}\n\nRECRUITMENT PIPELINE:\n${data.roundMapping?.map((r, i) => `Round ${i + 1}: ${r.roundTitle} (${r.focusAreas.join(', ')})`).join('\n')}\n\n7-DAY ACTION PLAN:\n${data.plan7Days.map(p => `${p.day} (${p.focus}):\n - ${p.tasks.join('\n - ')}`).join('\n\n')}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `prep-plan-${data.id}.txt`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    if (!data) return null;

    return (
        <div className="space-y-12 pb-24 animate-fade-in">
            <header className="flex flex-col sm:flex-row items-canter justify-between border-b border-border pb-8 gap-6">
                <button onClick={() => navigate('/assessments')} className="flex items-center gap-3 text-slate-500 hover:text-accent font-black text-xs uppercase tracking-widest transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> New Diagnostic Analysis
                </button>
                <div className="flex gap-4">
                    <button onClick={handleDownload} className="btn btn-secondary !py-2.5 !px-6 flex items-center gap-3 text-[11px] font-black">
                        <Download size={14} /> Export Plan Artifacts
                    </button>
                </div>
            </header>

            {/* Score Highlight - Calm Version */}
            <div className="card-premium flex flex-col xl:flex-row items-center gap-12 relative overflow-hidden">
                <div className="flex-shrink-0 text-center space-y-2">
                    <div className="text-[80px] md:text-[96px] font-serif font-black text-accent leading-none">{data.finalScore}</div>
                    <div className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Readiness Index Scale</div>
                </div>
                <div className="flex-1 space-y-4 text-center xl:text-left">
                    <div className="flex flex-col xl:flex-row items-center gap-4">
                        <h2 className="text-[32px] md:text-[42px] font-serif font-black text-text-primary leading-tight tracking-tight">{data.role}</h2>
                        <span className="bg-background border border-border px-4 py-1.5 rounded-none text-[9px] font-black uppercase text-accent tracking-widest shrink-0">Strategic Config</span>
                    </div>
                    <p className="text-[20px] md:text-[24px] font-medium text-slate-500 italic">Candidate profile for recruitment at {data.company}</p>
                </div>
                <div className="flex flex-col gap-3 w-full xl:w-auto">
                    <button onClick={() => handleCopy('raw', `Preparing for ${data.role} at ${data.company}`)} className="btn btn-secondary !py-3 !px-6 text-[11px] font-black uppercase tracking-widest">
                        {copyStatus.raw ? <Check size={14} className="mr-3" /> : <Copy size={14} className="mr-3" />}
                        {copyStatus.raw ? 'Artifact Copied' : 'Copy Brief'}
                    </button>
                </div>
            </div>

            {/* Main Sections */}
            <div className="space-y-16">
                <Section icon={<Layout size={20} className="text-accent" />} title="Recruitment Pipeline Architecture">
                    <div className="grid grid-cols-1 gap-6">
                        {data.roundMapping?.map((round, idx) => (
                            <div key={idx} className="bg-background border border-border p-8 md:p-10 transition-all duration-500 hover:border-accent/30 group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                    <h4 className="font-serif font-black text-text-primary text-xl md:text-2xl tracking-tight uppercase">Round {idx + 1}: {round.roundTitle}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {round.focusAreas?.map(f => (
                                            <span key={f} className="bg-white border border-border px-4 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest text-slate-500">{f}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="w-1.5 h-auto bg-accent/20 rounded-full shrink-0"></div>
                                    <p className="text-[15px] md:text-[16px] text-slate-500 font-medium leading-relaxed italic">"{round.whyItMatters}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                <Section icon={<Target size={20} className="text-accent" />} title="Clinical Skill Assessment Matrix">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                        {Object.entries(data.extractedSkills).map(([cat, skills]) => skills.length > 0 && (
                            <div key={cat} className="space-y-6">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-border pb-3 flex items-center justify-between">
                                    {cat}
                                    <span className="bg-background px-2 py-0.5 text-[9px] border border-border">{skills.length} DETECTED</span>
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {skills.map(s => {
                                        const isKnown = data.skillConfidenceMap?.[s] === 'know';
                                        return (
                                            <button
                                                key={s}
                                                onClick={() => handleToggleSkill(s)}
                                                className={`px-5 py-3 rounded-none text-[12px] md:text-[13px] font-black uppercase tracking-widest transition-all duration-500 border-2 ${isKnown ? 'bg-success border-success text-white shadow-lg shadow-success/10' : 'bg-white border-border text-slate-500 hover:border-accent/40'}`}
                                            >
                                                {isKnown && <Check size={12} className="inline mr-2" />}
                                                {s}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                <Section icon={<Calendar size={20} className="text-accent" />} title="7-Day Strategic Preparation Roadmap">
                    <div className="space-y-10">
                        {data.plan7Days?.map((p, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row gap-8 md:gap-12 group animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                                <div className="flex-shrink-0 w-full md:w-32">
                                    <div className="bg-background border border-border p-6 text-center transition-all duration-500 group-hover:border-accent">
                                        <span className="text-[10px] font-black text-slate-400 uppercase block tracking-widest mb-1">{p.day?.split(' ')[0]}</span>
                                        <span className="text-3xl font-serif font-black text-accent">{p.day?.split(' ')[1]}</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-6">
                                    <h4 className="text-2xl font-serif font-black text-text-primary tracking-tight uppercase group-hover:text-accent transition-colors">{p.focus}</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {p.tasks?.map((t, ti) => (
                                            <li key={ti} className="flex items-center gap-4 text-[13px] md:text-[14px] font-medium text-slate-500 bg-background/50 p-5 border border-border transition-all duration-300 hover:bg-white hover:border-accent/20">
                                                <div className="w-2 h-2 bg-accent shrink-0 rotate-45"></div>
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

            <div className="pt-16 border-t border-border flex justify-center">
                <button onClick={() => navigate('/practice')} className="btn btn-primary min-w-full sm:min-w-[400px] h-[64px] md:h-[80px] text-[16px] md:text-[18px] uppercase tracking-widest flex items-center justify-center gap-6 group hover:gap-8 transition-all duration-500 shadow-2xl shadow-text-primary/10">
                    Commence Skill Simulation <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
        </div>
    );
}

function Section({ icon, title, children }) {
    return (
        <div className="space-y-10">
            <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-none bg-background border border-border flex items-center justify-center text-accent">{icon}</div>
                <h2 className="heading-md uppercase tracking-tighter">{title}</h2>
            </div>
            <div>{children}</div>
        </div>
    );
}

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
        <div className="space-y-12 pb-20">
            <header className="flex items-center justify-between border-b border-border pb-6">
                <button onClick={() => navigate('/assessments')} className="flex items-center gap-2 text-slate-500 hover:text-accent font-bold text-sm uppercase tracking-widest transition-colors">
                    <ArrowLeft size={16} /> New Analysis
                </button>
                <div className="flex gap-4">
                    <button onClick={handleDownload} className="btn btn-secondary !py-2 !px-5 flex items-center gap-2">
                        <Download size={16} /> Export Data
                    </button>
                </div>
            </header>

            {/* Score Highlight - Calm Version */}
            <div className="bg-white border border-border p-12 rounded relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
                <div className="flex-shrink-0 text-center space-y-2">
                    <div className="text-[72px] font-serif font-black text-accent leading-none">{data.finalScore}</div>
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Readiness Index</div>
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-[32px] font-serif font-bold text-text-primary leading-tight">{data.role}</h2>
                        <span className="bg-background border border-border px-3 py-1 rounded text-[10px] font-black uppercase text-slate-400 tracking-widest">Target Configuration</span>
                    </div>
                    <p className="text-[20px] font-medium text-slate-500 italic">Candidate at {data.company}</p>
                </div>
                <button onClick={() => handleCopy('raw', `Preparing for ${data.role} at ${data.company}`)} className="btn btn-secondary !py-2 !px-4 text-[12px]">
                    {copyStatus.raw ? <Check size={14} className="mr-2" /> : <Copy size={14} className="mr-2" />}
                    {copyStatus.raw ? 'Copied' : 'Copy Brief'}
                </button>
            </div>

            {/* Main Sections */}
            <div className="space-y-12">
                <Section icon={<Layout size={20} className="text-accent" />} title="Recruitment Flow Architect">
                    <div className="space-y-6">
                        {data.roundMapping?.map((round, idx) => (
                            <div key={idx} className="bg-background border border-border p-8 rounded group hover:border-accent/30 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-text-primary text-[18px]">Round {idx + 1}: {round.roundTitle}</h4>
                                    <div className="flex gap-2">
                                        {round.focusAreas?.map(f => (
                                            <span key={f} className="bg-white border border-border px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest text-slate-500">{f}</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-[14px] text-slate-500 font-medium leading-[1.7] italic">"{round.whyItMatters}"</p>
                            </div>
                        ))}
                    </div>
                </Section>

                <Section icon={<Target size={20} className="text-accent" />} title="Skill Assessment Matrix">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {Object.entries(data.extractedSkills).map(([cat, skills]) => skills.length > 0 && (
                            <div key={cat} className="space-y-4">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-border pb-2">{cat}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map(s => {
                                        const isKnown = data.skillConfidenceMap?.[s] === 'know';
                                        return (
                                            <button
                                                key={s}
                                                onClick={() => handleToggleSkill(s)}
                                                className={`px-4 py-2 rounded text-[13px] font-bold transition-all border ${isKnown ? 'bg-success text-white border-success' : 'bg-white border-border text-slate-500 hover:border-accent/40'}`}
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

                <Section icon={<Calendar size={20} className="text-accent" />} title="Strategic Roadmap">
                    <div className="space-y-6">
                        {data.plan7Days?.map((p, idx) => (
                            <div key={idx} className="flex gap-8 group">
                                <div className="flex-shrink-0 w-24">
                                    <div className="bg-background border border-border rounded p-4 text-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase block tracking-widest">{p.day?.split(' ')[0]}</span>
                                        <span className="text-[20px] font-serif font-black text-accent">{p.day?.split(' ')[1]}</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <h4 className="text-[18px] font-bold text-text-primary tracking-tight">{p.focus}</h4>
                                    <ul className="grid grid-cols-1 gap-3">
                                        {p.tasks?.map((t, ti) => (
                                            <li key={ti} className="flex items-center gap-3 text-[14px] font-medium text-slate-500 bg-background/50 p-4 border border-border rounded">
                                                <div className="w-1 h-1 bg-accent rounded-full"></div>
                                                {t}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                        {(!data.plan7Days || data.plan7Days.length === 0) && (
                            <div className="text-slate-400 font-serif italic py-10">No roadmap artifacts found for this diagnostic entry.</div>
                        )}
                    </div>
                </Section>
            </div>

            <div className="pt-10 border-t border-border flex justify-center">
                <button onClick={() => navigate('/practice')} className="btn btn-primary min-w-[320px] h-[64px] text-[16px] uppercase tracking-widest">
                    Begin Skill Simulation <ArrowRight size={18} className="ml-3" />
                </button>
            </div>
        </div>
    );
}

function Section({ icon, title, children }) {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-background border border-border flex items-center justify-center">{icon}</div>
                <h2 className="heading-md uppercase tracking-tight">{title}</h2>
            </div>
            <div>{children}</div>
        </div>
    );
}

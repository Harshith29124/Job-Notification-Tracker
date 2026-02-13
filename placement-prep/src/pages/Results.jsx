import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAnalysisById, getLastAnalysis, updateAnalysis } from '../utils/analysisEngine';
import {
    CheckCircle2,
    Calendar,
    Target,
    Sparkles,
    ArrowLeft,
    Share2,
    ChevronRight,
    Circle,
    Copy,
    Download,
    Check
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

        // Calculate new score
        const skillsCount = Object.values(data.extractedSkills).flat().length;
        const knowCount = Object.values(newMap).filter(v => v === 'know').length;
        const practiceCount = skillsCount - knowCount;

        let newScore = (data.baseReadinessScore || data.readinessScore) + (knowCount * 2) - (practiceCount * 2);
        newScore = Math.max(0, Math.min(100, newScore));

        const updates = {
            skillConfidenceMap: newMap,
            readinessScore: newScore
        };

        const updatedData = updateAnalysis(data.id, updates);
        setData(updatedData);
    };

    const handleCopy = (type, text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyStatus({ ...copyStatus, [type]: true });
            setTimeout(() => setCopyStatus({ ...copyStatus, [type]: false }), 2000);
        });
    };

    const handleDownload = () => {
        if (!data) return;

        const content = `
ANALYSIS RESULT: ${data.role} at ${data.company}
READINESS SCORE: ${data.readinessScore}/100
DATE: ${new Date(data.createdAt).toLocaleDateString()}

SKILLS:
${Object.entries(data.extractedSkills).map(([cat, skills]) => `${cat}: ${skills.join(', ')}`).join('\n')}

7-DAY PLAN:
${data.plan.map(p => `${p.day} (${p.focus}):\n - ${p.tasks.join('\n - ')}`).join('\n\n')}

ROUND CHECKLIST:
${Object.entries(data.checklist).map(([round, tasks]) => `${round}:\n - ${tasks.join('\n - ')}`).join('\n\n')}

PREDICTED QUESTIONS:
${data.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prep-plan-${data.company.toLowerCase().replace(/\s+/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!data) return null;

    const allSkills = Object.values(data.extractedSkills).flat();
    const weakSkills = allSkills.filter(s => (data.skillConfidenceMap?.[s] || 'practice') === 'practice').slice(0, 3);

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/assessments')}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold transition-colors"
                >
                    <ArrowLeft size={20} /> New Analysis
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-primary hover:border-primary/20 transition-all font-bold"
                    >
                        <Download size={20} /> Download TXT
                    </button>
                </div>
            </div>

            {/* Hero Score Section */}
            <section className="bg-primary text-white rounded-[2.5rem] p-12 relative overflow-hidden shadow-2xl shadow-primary/30 text-center md:text-left">
                <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-150">
                    <Sparkles size={200} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="relative w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 flex-shrink-0">
                        <div className="text-center">
                            <span className="text-6xl font-black block leading-none">{data.readinessScore}</span>
                            <span className="text-sm font-bold opacity-80 uppercase tracking-widest">Score</span>
                        </div>
                        <svg className="absolute inset-0 -rotate-90">
                            <circle cx="96" cy="96" r="90" className="stroke-white/10 fill-none stroke-[6]" />
                            <circle
                                cx="96" cy="96" r="90"
                                style={{
                                    strokeDasharray: 565,
                                    strokeDashoffset: 565 - (data.readinessScore / 100) * 565,
                                    transition: 'stroke-dashoffset 0.5s ease-out'
                                }}
                                className="stroke-white fill-none stroke-[6] stroke-round"
                            />
                        </svg>
                    </div>

                    <div className="flex-1">
                        <p className="text-white/70 font-bold uppercase tracking-[0.2em] mb-2 text-sm">Target Report</p>
                        <h1 className="text-4xl md:text-5xl font-black mb-3">{data.role || 'Strategic Role'}</h1>
                        <p className="text-2xl font-medium text-white/90">at {data.company || 'Confidential Enterprise'}</p>
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <ExportButton
                            icon={copyStatus.plan ? <Check size={18} /> : <Copy size={18} />}
                            label="Copy Plan"
                            active={copyStatus.plan}
                            onClick={() => handleCopy('plan', data.plan.map(p => `${p.day}: ${p.tasks.join(', ')}`).join('\n'))}
                        />
                        <ExportButton
                            icon={copyStatus.checklist ? <Check size={18} /> : <Copy size={18} />}
                            label="Copy Checklist"
                            active={copyStatus.checklist}
                            onClick={() => handleCopy('checklist', Object.entries(data.checklist).map(([r, t]) => `${r}:\n${t.join(', ')}`).join('\n\n'))}
                        />
                        <ExportButton
                            icon={copyStatus.questions ? <Check size={18} /> : <Copy size={18} />}
                            label="Copy Questions"
                            active={copyStatus.questions}
                            onClick={() => handleCopy('questions', data.questions.join('\n'))}
                        />
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">

                    {/* Extracted Skills */}
                    <Section icon={<Target className="text-primary" />} title="Skill Assessment Matrix">
                        <p className="text-slate-400 text-sm mb-8 font-medium italic">Toggle skills to update your live readiness score.</p>
                        <div className="space-y-8">
                            {Object.entries(data.extractedSkills).map(([cat, skills]) => (
                                <div key={cat}>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{cat}</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {skills.map(s => {
                                            const isKnown = data.skillConfidenceMap?.[s] === 'know';
                                            return (
                                                <button
                                                    key={s}
                                                    onClick={() => handleToggleSkill(s)}
                                                    className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all border flex items-center gap-2 ${isKnown
                                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-primary/30'
                                                        }`}
                                                >
                                                    {isKnown ? <Check size={14} /> : <Circle size={4} fill="currentColor" className="text-slate-300" />}
                                                    {s}
                                                    <span className="text-[10px] opacity-50 font-black uppercase tracking-tighter ml-1">
                                                        {isKnown ? 'Mastered' : 'Practice'}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* 7-Day Plan */}
                    <Section icon={<Calendar className="text-primary" />} title="7-Day Sprint Strategy">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.plan.map((item, idx) => (
                                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:shadow-lg transition-all border-l-4 border-l-primary">
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">{item.day}</span>
                                        <h5 className="font-black text-slate-900 text-lg">{item.focus}</h5>
                                    </div>
                                    <ul className="space-y-3">
                                        {item.tasks.map((t, tidx) => (
                                            <li key={tidx} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                                                <div className="mt-1.5"><Circle size={8} fill="currentColor" className="text-primary" /></div>
                                                {t}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Interview Questions */}
                    <Section icon={<Sparkles className="text-primary" />} title="Predicted Interview Questions">
                        <div className="space-y-4">
                            {data.questions.map((q, idx) => (
                                <div key={idx} className="bg-white group border border-slate-200 rounded-[1.5rem] p-6 flex gap-6 hover:shadow-xl hover:border-primary/20 transition-all cursor-default">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black group-hover:bg-primary group-hover:text-white transition-all">
                                        {idx + 1}
                                    </div>
                                    <p className="text-slate-800 font-bold leading-relaxed">{q}</p>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>

                <div className="space-y-10">
                    {/* Round-wise Checklist */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                            Milestone Checklist
                        </h3>
                        <div className="space-y-10">
                            {Object.entries(data.checklist).map(([round, tasks]) => (
                                <div key={round}>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{round}</h4>
                                    <div className="space-y-4">
                                        {tasks.map(t => (
                                            <div key={t} className="flex items-center gap-3 group cursor-pointer">
                                                <div className="w-6 h-6 rounded-lg border-2 border-slate-200 group-hover:border-primary transition-all flex items-center justify-center">
                                                    <CheckCircle2 size={14} className="text-white group-hover:text-primary/20 scale-0 group-hover:scale-100 transition-all" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{t}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Next Box */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 text-white/5 rotate-12">
                            <Target size={120} />
                        </div>
                        <h3 className="text-2xl font-black mb-6 flex items-center gap-3 relative z-10">
                            Action Next
                        </h3>

                        {weakSkills.length > 0 ? (
                            <div className="mb-8 relative z-10">
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Focus Areas:</p>
                                <div className="flex flex-wrap gap-2">
                                    {weakSkills.map(s => (
                                        <span key={s} className="bg-white/10 text-white px-3 py-1 rounded-lg text-xs font-bold ring-1 ring-white/10">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-emerald-400 text-sm font-bold mb-8 relative z-10">Ready to Ace. All detected skills covered.</p>
                        )}

                        <p className="text-slate-400 text-sm mb-10 leading-relaxed relative z-10">Suggest next action:<br /><span className="text-white font-black italic">"Start Day 1 plan now."</span></p>

                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="w-full py-5 bg-primary rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 shadow-xl shadow-primary/20"
                        >
                            Begin Preparation Sprint <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ icon, title, children }) {
    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                    {icon}
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
            </div>
            {children}
        </div>
    );
}

function ExportButton({ icon, label, onClick, active }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-sm transition-all border backdrop-blur-sm ${active
                    ? 'bg-emerald-500 border-emerald-400 text-white'
                    : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                }`}
        >
            {icon} {active ? 'Copied' : label}
        </button>
    );
}

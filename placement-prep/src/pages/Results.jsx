import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAnalysisById, getLastAnalysis } from '../utils/analysisEngine';
import {
    CheckCircle2,
    Calendar,
    Target,
    Sparkles,
    ArrowLeft,
    Share2,
    Bookmark,
    ChevronRight,
    Circle
} from 'lucide-react';

export default function Results() {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState(null);
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

    if (!data) return null;

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
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-primary hover:border-primary/20 transition-all">
                        <Share2 size={20} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-primary hover:border-primary/20 transition-all font-bold">
                        <Bookmark size={20} /> Save PDF
                    </button>
                </div>
            </div>

            {/* Hero Score Section */}
            <section className="bg-primary text-white rounded-[2.5rem] p-12 relative overflow-hidden shadow-2xl shadow-primary/30">
                <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-150">
                    <Sparkles size={200} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="relative w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                        <div className="text-center">
                            <span className="text-6xl font-black block leading-none">{data.readinessScore}</span>
                            <span className="text-sm font-bold opacity-80 uppercase tracking-widest">Score</span>
                        </div>
                        <svg className="absolute inset-0 -rotate-90">
                            <circle cx="96" cy="96" r="90" className="stroke-white/10 fill-none stroke-[6]" />
                            <circle
                                cx="96" cy="96" r="90"
                                style={{ strokeDasharray: 565, strokeDashoffset: 565 - (data.readinessScore / 100) * 565 }}
                                className="stroke-white fill-none stroke-[6] stroke-round transition-all duration-1000"
                            />
                        </svg>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <p className="text-white/70 font-bold uppercase tracking-[0.2em] mb-2 text-sm">Analysis Result</p>
                        <h1 className="text-4xl md:text-5xl font-black mb-3">{data.role || 'Strategic Role'}</h1>
                        <p className="text-2xl font-medium text-white/90">at {data.company || 'Confidential Enterprise'}</p>
                        <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="bg-white/15 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center gap-2">
                                <CheckCircle2 size={18} />
                                <span className="font-bold text-sm">Skills Extracted</span>
                            </div>
                            <div className="bg-white/15 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center gap-2">
                                <Calendar size={18} />
                                <span className="font-bold text-sm">Plan Ready</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">

                    {/* Extracted Skills */}
                    <Section icon={<Target className="text-primary" />} title="Skill Extraction Matrix">
                        <div className="space-y-8">
                            {Object.entries(data.extractedSkills).map(([cat, skills]) => (
                                <div key={cat}>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{cat}</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {skills.map(s => (
                                            <span key={s} className="bg-slate-50 border border-slate-200 text-slate-700 px-5 py-2.5 rounded-full font-bold text-sm hover:border-primary/30 hover:bg-white transition-all">
                                                {s}
                                            </span>
                                        ))}
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

                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
                        <h3 className="text-xl font-black mb-4">Deep Prep Needed?</h3>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">Our AI found <strong>{Object.keys(data.extractedSkills).length}</strong> key tech categories in this JD. Don't skip the mock interviews.</p>
                        <button className="w-full py-4 bg-primary rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Access Mock Lab <ChevronRight size={18} />
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

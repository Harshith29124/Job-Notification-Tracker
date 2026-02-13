import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeJD, saveToHistory } from '../utils/analysisEngine';
import { ClipboardCheck, Building2, UserCircle2, FileText, Send, Info } from 'lucide-react';

export default function Assessments() {
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [jdText, setJdText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const navigate = useNavigate();

    const isJdTooShort = jdText.trim().length > 0 && jdText.trim().length < 200;

    const handleAnalyze = (e) => {
        e.preventDefault();
        if (!jdText.trim()) return;

        setIsAnalyzing(true);

        // Simulate thinking
        setTimeout(() => {
            const result = analyzeJD(company, role, jdText);
            saveToHistory(result);
            setIsAnalyzing(false);
            navigate('/results');
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <h1 className="text-3xl font-black text-technical-slate tracking-tight flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl text-primary">
                        <ClipboardCheck size={28} />
                    </div>
                    Readiness Analyzer
                </h1>
                <p className="text-slate-500 font-medium">Analyze your JD to generate a personalized recruitment roadmap.</p>
            </header>

            <div className="bg-white rounded-[2rem] border border-technical-border p-10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-all duration-700">
                    <ClipboardCheck size={120} className="text-primary" />
                </div>

                <form onSubmit={handleAnalyze} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Building2 size={14} /> Company Name (Optional)
                            </label>
                            <input
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                className="w-full bg-bone border border-technical-border rounded-2xl p-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-technical-slate placeholder:text-slate-300"
                                placeholder="Google, Amazon, TCS..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <UserCircle2 size={14} /> Job Role (Optional)
                            </label>
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-bone border border-technical-border rounded-2xl p-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-technical-slate placeholder:text-slate-300"
                                placeholder="Software Engineer, SDE-1..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <FileText size={14} /> Job Description
                            </label>
                            {isJdTooShort && (
                                <span className="text-[10px] font-black text-warning uppercase tracking-widest animate-pulse">
                                    Calm Warning: Input too short
                                </span>
                            )}
                        </div>
                        <textarea
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                            className={`w-full bg-bone border ${isJdTooShort ? 'border-warning/30' : 'border-technical-border'} rounded-[2rem] p-8 min-h-[300px] focus:ring-4 ${isJdTooShort ? 'focus:ring-warning/10 focus:border-warning' : 'focus:ring-primary/10 focus:border-primary'} outline-none transition-all resize-none font-medium leading-relaxed text-technical-slate`}
                            placeholder="Paste the full job description here..."
                            required
                        />
                        {isJdTooShort ? (
                            <p className="text-[11px] text-warning font-bold italic">
                                This JD is too short to analyze deeply. Paste full JD for better output.
                            </p>
                        ) : (
                            <p className="text-xs text-slate-400 font-bold italic">Heuristic analysis for skills, tech stack, and core CS fundamentals.</p>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isAnalyzing || !jdText.trim()}
                            className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${isAnalyzing
                                ? 'bg-primary/20 text-primary cursor-wait'
                                : 'bg-primary text-white hover:bg-primary/90 hover:scale-[1.01] shadow-xl shadow-primary/25 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed'
                                }`}
                        >
                            {isAnalyzing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-primary border-t-white rounded-full animate-spin"></div>
                                    Running Diagnostics...
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    {jdText.trim() ? 'Initialize Intelligence Suite' : 'Paste JD to Begin'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Tip icon="✨" title="Mention Tech" text="Explicitly naming libraries like React or AWS improves our question generation." />
                <Tip icon="📊" title="Length Matters" text="Longer JDs (>800 chars) allow for more detailed readiness scoring." />
                <Tip icon="🔍" title="History Saved" text="All your analyses are encrypted and stored locally in your browser." />
            </div>
        </div>
    );
}

function Tip({ icon, title, text }) {
    return (
        <div className="bg-white/50 border border-technical-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
                <span>{icon}</span>
                <h4 className="font-bold text-slate-800 text-sm tracking-tight">{title}</h4>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{text}</p>
        </div>
    );
}

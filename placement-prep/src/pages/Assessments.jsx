import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeJD, saveToHistory } from '../utils/analysisEngine';
import { FileText, Building2, UserCircle2, Send, Info } from 'lucide-react';

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

        setTimeout(() => {
            const result = analyzeJD(company, role, jdText);
            saveToHistory(result);
            setIsAnalyzing(false);
            navigate('/results');
        }, 1500);
    };

    return (
        <div className="space-y-10">
            <div className="bg-white border border-border p-10 rounded shadow-none">
                <form onSubmit={handleAnalyze} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Building2 size={13} /> Target Company
                            </label>
                            <input
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                className="input-field font-bold"
                                placeholder="e.g. Google, Stripe, or TCS"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <UserCircle2 size={13} /> Specific Role
                            </label>
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="input-field font-bold"
                                placeholder="e.g. Software Engineer"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <FileText size={13} /> Job Description Payload
                            </label>
                            {isJdTooShort && (
                                <span className="text-[10px] font-black text-warning uppercase tracking-widest">
                                    Capacity Warning: Insufficient Data
                                </span>
                            )}
                        </div>
                        <textarea
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                            className={`w-full bg-background border ${isJdTooShort ? 'border-warning/50' : 'border-border'} rounded p-8 min-h-[300px] focus:outline-none focus:border-text-primary transition-all resize-none font-medium leading-[1.8] text-text-primary text-[15px]`}
                            placeholder="Paste the complete job description text here for extraction..."
                            required
                        />
                        <p className="text-[12px] text-slate-400 font-medium italic">Diagnostic suite will extract tech stack, domain requirements, and recruitment logic.</p>
                    </div>

                    <div className="pt-6 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400 text-[11px] font-black uppercase tracking-widest">
                            <Info size={14} /> Strict Schema Mode Active
                        </div>
                        <button
                            type="submit"
                            disabled={isAnalyzing || !jdText.trim()}
                            className={`btn btn-primary min-w-[280px] h-[56px] text-[15px] ${isAnalyzing ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {isAnalyzing ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Extracting Intelligence...
                                </div>
                            ) : (
                                <>
                                    <Send size={18} className="mr-2" />
                                    {jdText.trim() ? 'Initialize Strategy Generation' : 'Awaiting Payload'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Tip icon="01" title="Tech Extraction" text="Mentioning specific libraries like React or SQL improves diagnostic accuracy." />
                <Tip icon="02" title="Length Protocol" text="JDs exceeding 800 characters allow for deeper recruitment flow mapping." />
                <Tip icon="03" title="Local Persistence" text="All extracted intelligence is stored locally in your browser's secure context." />
            </div>
        </div>
    );
}

function Tip({ icon, title, text }) {
    return (
        <div className="bg-white border border-border rounded p-6">
            <div className="flex items-center gap-3 mb-3">
                <span className="text-[14px] font-black text-accent">{icon}</span>
                <h4 className="font-bold text-text-primary text-[14px] uppercase tracking-tight">{title}</h4>
            </div>
            <p className="text-[13px] text-slate-500 font-medium leading-[1.6]">{text}</p>
        </div>
    );
}

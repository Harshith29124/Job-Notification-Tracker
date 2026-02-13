import { getHistory } from '../utils/analysisEngine';
import { History as HistoryIcon, Search, ArrowRight, Building2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function History() {
    const history = getHistory();
    const navigate = useNavigate();

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-technical-slate tracking-tight flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-xl text-primary">
                            <HistoryIcon size={28} />
                        </div>
                        Analysis Archive
                    </h1>
                    <p className="text-slate-500 font-medium">Revisit your generated recruitment strategies and progress charts.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search company or role..."
                        className="pl-12 pr-6 py-3 bg-white border border-technical-border rounded-2xl w-full md:w-80 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm text-technical-slate"
                    />
                </div>
            </header>

            {history.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] border border-technical-border p-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-bone rounded-full flex items-center justify-center mx-auto text-slate-300 border border-technical-border">
                        <HistoryIcon size={40} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-technical-slate mb-2">No Archives Found</h2>
                        <p className="text-slate-500 font-medium">Your analysis history will appear here once you process your first JD.</p>
                    </div>
                    <button
                        onClick={() => navigate('/assessments')}
                        className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.05] transition-all"
                    >
                        Start First Analysis
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {history.map((entry) => (
                        <div
                            key={entry.id}
                            onClick={() => navigate(`/results?id=${entry.id}`)}
                            className="bg-white group border border-technical-border hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 p-6 md:p-8 rounded-[2rem] transition-all cursor-pointer flex flex-col md:flex-row items-center gap-8"
                        >
                            <div className="flex-shrink-0 w-20 h-20 bg-bone rounded-3xl flex items-center justify-center border border-technical-border group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                                <div className="text-center">
                                    <span className="text-2xl font-black text-technical-slate block leading-tight">{entry.finalScore || entry.readinessScore}</span>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Score</span>
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                                    <h3 className="text-xl font-black text-technical-slate group-hover:text-primary transition-colors">{entry.role || 'Expert Role'}</h3>
                                    <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                                    <div className="flex items-center justify-center md:justify-start gap-1.5 text-slate-500 font-bold text-sm uppercase tracking-tight">
                                        <Building2 size={14} />
                                        {entry.company || 'Market Leader'}
                                    </div>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-4">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold italic">
                                        <Calendar size={12} />
                                        {new Date(entry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                    <div className="bg-success-soft text-success px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-success/10">
                                        {Object.values(entry.extractedSkills).filter(arr => Array.isArray(arr) && arr.length > 0).length} Focus Areas
                                    </div>
                                </div>
                            </div>

                            <div className="flex-shrink-0 flex items-center gap-2 text-slate-300 group-hover:text-primary transition-all font-black text-sm uppercase tracking-widest">
                                View Result <ArrowRight size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import { getHistory } from '../utils/analysisEngine';
import { History as HistoryIcon, Search, ArrowRight, Building2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function History() {
    const history = getHistory();
    const navigate = useNavigate();

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-border pb-6">
                <h2 className="heading-md uppercase">Analysis Archive</h2>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search historical data..."
                        className="pl-12 pr-6 py-2 bg-white border border-border rounded w-80 focus:ring-1 focus:ring-text-primary outline-none transition-all font-bold text-sm text-text-primary"
                    />
                </div>
            </div>

            {history.length === 0 ? (
                <div className="bg-white border border-border p-20 text-center space-y-6 rounded">
                    <div className="w-20 h-20 bg-background rounded border border-border flex items-center justify-center mx-auto text-slate-300">
                        <HistoryIcon size={32} />
                    </div>
                    <div>
                        <h2 className="text-[20px] font-serif font-black text-text-primary mb-2">No Historical Records</h2>
                        <p className="text-slate-500 font-medium">Your analysis history will appear here once you process your first JD.</p>
                    </div>
                    <button
                        onClick={() => navigate('/assessments')}
                        className="btn btn-primary px-8"
                    >
                        Start First Analysis
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {history.map((entry) => (
                        <div
                            key={entry.id}
                            onClick={() => navigate(`/results?id=${entry.id}`)}
                            className="bg-white group border border-border hover:border-accent/40 p-8 rounded shadow-none transition-all cursor-pointer flex flex-col md:flex-row items-center gap-10"
                        >
                            <div className="flex-shrink-0 w-24 h-24 bg-background rounded border border-border flex items-center justify-center group-hover:border-accent/20 transition-all">
                                <div className="text-center">
                                    <span className="text-[32px] font-serif font-black text-text-primary block leading-tight">{entry.finalScore || entry.readinessScore}</span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Stability</span>
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                                    <h3 className="text-[22px] font-serif font-bold text-text-primary group-hover:text-accent transition-colors">{entry.role || 'Expert Role'}</h3>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 font-bold text-[12px] uppercase tracking-widest bg-background px-3 py-1 rounded border border-border/50">
                                        <Building2 size={12} />
                                        {entry.company || 'Market Leader'}
                                    </div>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-6">
                                    <div className="flex items-center gap-2 text-[12px] text-slate-500 font-bold uppercase tracking-tight">
                                        <Calendar size={13} />
                                        {new Date(entry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                    <div className="text-accent text-[11px] font-black uppercase tracking-widest">
                                        {Object.values(entry.extractedSkills).filter(arr => Array.isArray(arr) && arr.length > 0).length} Strategic Areas Detected
                                    </div>
                                </div>
                            </div>

                            <ArrowRight size={24} className="text-slate-200 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

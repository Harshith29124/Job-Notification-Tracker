import { useNavigate } from 'react-router-dom';
import { getHistory } from '../utils/analysisEngine';
import { History as HistoryIcon, ArrowRight, Calendar, Building2, BarChart3, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function History() {
    const [analyses, setAnalyses] = useState(getHistory());
    const navigate = useNavigate();

    const handleClear = () => {
        if (window.confirm("CRITICAL: This action will purge all historical diagnostic records from local storage. Proceed?")) {
            localStorage.removeItem('prepHistory');
            setAnalyses([]);
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                    <h2 className="heading-md uppercase">Analysis Archive</h2>
                    <p className="text-slate-500 font-medium text-sm">Historical repository of strategic readiness audits.</p>
                </div>
                {analyses.length > 0 && (
                    <button onClick={handleClear} className="text-[11px] font-black text-accent uppercase tracking-widest hover:underline flex items-center gap-2">
                        <Trash2 size={13} /> Purge Archive
                    </button>
                )}
            </div>

            {analyses.length === 0 ? (
                <div className="py-32 text-center card-premium border-dashed">
                    <HistoryIcon size={48} className="mx-auto text-slate-300 mb-6" />
                    <h3 className="text-[24px] font-serif font-black text-text-primary mb-2">Archive Empty</h3>
                    <p className="body-text text-sm mx-auto mb-8">No historical data found. Initialize your first diagnostic to populate the archive.</p>
                    <button onClick={() => navigate('/assessments')} className="btn btn-primary px-12">New Analysis</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {analyses.map((item) => (
                        <div key={item.id} className="card-premium group hover:border-accent/40 transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-background border border-border flex items-center justify-center text-accent">
                                            <Building2 size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-[20px] font-serif font-black text-text-primary">{item.role}</h3>
                                            <p className="text-slate-500 text-sm font-bold italic">{item.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                            <Calendar size={13} /> {new Date(item.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-black text-accent uppercase tracking-widest">
                                            <BarChart3 size={13} /> {item.finalScore}% Match
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => navigate(`/results?id=${item.id}`)}
                                        className="btn btn-secondary px-6 font-black text-[11px] uppercase tracking-widest"
                                    >
                                        View Strategy
                                    </button>
                                    <button className="text-slate-300 hover:text-accent transition-colors">
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-background border border-border p-8 flex items-start gap-4">
                <div className="bg-white p-2 border border-border">
                    <HistoryIcon size={16} className="text-accent" />
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Archive integrity is local to this browser session. Export critical diagnostic strategies to maintain permanent readiness records across environments.
                </p>
            </div>
        </div>
    );
}

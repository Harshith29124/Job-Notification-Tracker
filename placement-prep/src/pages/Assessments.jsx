import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Sparkles, Building2, UserCircle2, Send, AlertCircle } from 'lucide-react';
import { analyzeJD, saveToHistory } from '../utils/analysisEngine';

export default function Assessments() {
    useEffect(() => {
        const progress = JSON.parse(localStorage.getItem('prp_steps_progress') || '{}');
        progress[3] = true;
        localStorage.setItem('prp_steps_progress', JSON.stringify(progress));
    }, []);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        jd: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.company || !formData.role || !formData.jd) {
            setError('All technical configuration fields are mandatory.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const analysis = analyzeJD(formData.company, formData.role, formData.jd);
            saveToHistory(analysis);
            navigate(`/results?id=${analysis.id}`);
        } catch (err) {
            setError('Encryption or processing failure. Please re-input payload.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col gap-2 border-b border-border pb-8">
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                    Extraction Protocol
                </div>
                <h2 className="heading-md uppercase">Intelligence Engine</h2>
                <p className="text-slate-500 font-medium text-sm md:text-base max-w-2xl">Initialize heuristic matching by inputting job description payloads for clinical requirement extraction.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
                {error && (
                    <div className="bg-accent/5 border border-accent/20 p-5 text-accent text-xs md:text-sm font-black uppercase tracking-widest flex items-center gap-4">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-widest text-text-primary flex items-center gap-3">
                            <Building2 size={14} className="text-accent" /> Company Identity
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Google, Stripe, KodNest"
                            className="input-field"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-widest text-text-primary flex items-center gap-3">
                            <UserCircle2 size={14} className="text-accent" /> Target Role
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Senior Frontend Engineer"
                            className="input-field"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-text-primary flex items-center gap-3">
                        <ClipboardCheck size={14} className="text-accent" /> Job Description Payload
                    </label>
                    <textarea
                        placeholder="Paste the raw job description text here for heuristic analysis..."
                        className="input-field min-h-[320px] font-mono text-[13px] md:text-[14px] leading-relaxed resize-none"
                        value={formData.jd}
                        onChange={(e) => setFormData({ ...formData, jd: e.target.value })}
                    />
                </div>

                <div className="flex flex-col sm:flex-row justify-end pt-8 border-t border-border">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn btn-primary h-[60px] md:h-[72px] min-w-full sm:min-w-[320px] text-[15px] uppercase tracking-widest flex items-center justify-center gap-4 transition-all duration-500 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:gap-6'}`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Initialize Diagnostic <Send size={18} />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="card-premium !bg-background border-dashed">
                <div className="flex flex-col sm:flex-row items-start gap-5">
                    <div className="bg-white p-3 border border-border">
                        <Sparkles size={20} className="text-accent" />
                    </div>
                    <div>
                        <h4 className="font-serif font-black text-text-primary text-sm uppercase tracking-tight mb-1">Heuristic Engine Active</h4>
                        <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">Our clinical algorithm identifies technical stacks, behavioral triggers, and hidden recruitment priorities from raw JD text payloads.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

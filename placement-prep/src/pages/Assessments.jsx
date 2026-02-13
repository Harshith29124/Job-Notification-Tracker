import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Sparkles, Building2, UserCircle2, Send, AlertCircle } from 'lucide-react';
import { analyzeJD, saveToHistory } from '../utils/analysisEngine';

export default function Assessments() {
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
        <div className="space-y-10">
            <div className="flex flex-col gap-2 border-b border-border pb-6">
                <h2 className="heading-md uppercase">Intelligence Engine</h2>
                <p className="text-slate-500 font-medium text-sm">Input job description payloads for clinical requirement extraction.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
                {error && (
                    <div className="bg-accent/5 border border-accent/20 p-4 text-accent text-sm font-bold flex items-center gap-3">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-widest text-text-primary flex items-center gap-2">
                            <Building2 size={13} className="text-accent" /> Company Identity
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
                        <label className="text-[11px] font-black uppercase tracking-widest text-text-primary flex items-center gap-2">
                            <UserCircle2 size={13} className="text-accent" /> Target Role
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
                    <label className="text-[11px] font-black uppercase tracking-widest text-text-primary flex items-center gap-2">
                        <ClipboardCheck size={13} className="text-accent" /> Job Description Payload
                    </label>
                    <textarea
                        placeholder="Paste the raw job description text here for heuristic analysis..."
                        className="input-field min-h-[320px] font-mono text-[14px] leading-relaxed"
                        value={formData.jd}
                        onChange={(e) => setFormData({ ...formData, jd: e.target.value })}
                    />
                </div>

                <div className="flex justify-end pt-6 border-t border-border">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn btn-primary h-[64px] min-w-[280px] text-[15px] uppercase tracking-widest flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                <div className="flex items-start gap-4">
                    <div className="bg-white p-2 border border-border">
                        <Sparkles size={16} className="text-accent" />
                    </div>
                    <div>
                        <h4 className="font-bold text-text-primary text-sm uppercase tracking-tight">Heuristic Algorithm Active</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">Our engine identifies technical stacks, behavioral cues, and hidden recruitment priorities from raw text.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

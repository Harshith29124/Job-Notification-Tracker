import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Circle, AlertCircle, Info, ChevronRight } from 'lucide-react';

const QA_PROTOCOLS = [
    { id: 'env', title: 'Environment Configuration', desc: 'Verify API endpoints and environment variables.', category: 'Infrastructure' },
    { id: 'data', title: 'Data Persistence Layer', desc: 'Ensure LocalStorage encryption and cache integrity.', category: 'Core Engine' },
    { id: 'ui', title: 'Interface Adherence', desc: 'Validate typography, spacing, and accent conformity.', category: 'Design System' },
    { id: 'logic', title: 'Heuristic Accuracy', desc: 'Process a sample JD to verify extraction logic.', category: 'Intelligence' },
    { id: 'res', title: 'Responsive Optimization', desc: 'Check layout stability across mobile/tablet views.', category: 'Platform' }
];

export default function TestChecklist() {
    const [checked, setChecked] = useState(() => {
        const saved = localStorage.getItem('prp_qa_completed');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('prp_qa_completed', JSON.stringify(checked));
    }, [checked]);

    const toggle = (id) => {
        setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const progress = Math.round((checked.length / QA_PROTOCOLS.length) * 100);

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                    <h2 className="heading-md uppercase">Quality Assurance Center</h2>
                    <p className="text-slate-500 font-medium text-sm">Validating system integrity for clinical recruitment readiness.</p>
                </div>
                <div className="flex items-center gap-3 bg-background border border-border px-4 py-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Integrity Score</span>
                    <span className="text-[18px] font-black text-accent">{progress}%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {QA_PROTOCOLS.map((protocol) => {
                    const isDone = checked.includes(protocol.id);
                    return (
                        <div
                            key={protocol.id}
                            onClick={() => toggle(protocol.id)}
                            className={`card-premium !p-8 flex items-center justify-between cursor-pointer transition-all group ${isDone ? 'border-success/30 bg-success/[0.02]' : 'hover:border-accent/40'}`}
                        >
                            <div className="flex items-center gap-8">
                                <div className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition-all ${isDone ? 'bg-success border-success text-white' : 'border-border bg-background text-slate-300 group-hover:border-accent/40'}`}>
                                    {isDone ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className={`text-[20px] font-serif font-black transition-colors ${isDone ? 'text-success' : 'text-text-primary'}`}>{protocol.title}</h3>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-2 py-1 border border-border bg-white">{protocol.category}</span>
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium">{protocol.desc}</p>
                                </div>
                            </div>
                            <ChevronRight className={`transition-all ${isDone ? 'text-success' : 'text-slate-200 group-hover:text-accent group-hover:translate-x-1'}`} />
                        </div>
                    );
                })}
            </div>

            <div className={`p-8 border flex items-start gap-6 transition-all ${progress === 100 ? 'bg-success/5 border-success/20' : 'bg-accent/5 border-accent/20'}`}>
                <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center border ${progress === 100 ? 'bg-white border-success/20 text-success' : 'bg-white border-accent/20 text-accent'}`}>
                    {progress === 100 ? <ShieldCheck size={28} /> : <AlertCircle size={28} />}
                </div>
                <div className="space-y-2">
                    <h4 className={`text-[18px] font-serif font-black ${progress === 100 ? 'text-success' : 'text-text-primary'}`}>
                        {progress === 100 ? 'Pre-Flight Authorization Granted' : 'Verification Pending'}
                    </h4>
                    <p className="text-[13px] text-slate-600 font-medium">
                        {progress === 100
                            ? 'All platform layers have been verified against the KodNest Premium standards. System is authorized for shipment.'
                            : 'Strategic deployment is restricted until all core integrity protocols are verified and checked above.'}
                    </p>
                </div>
            </div>
        </div>
    );
}

import { useNavigate } from 'react-router-dom';
import { Truck, CheckCircle2, ShieldAlert, ArrowRight, ExternalLink, ShieldCheck, Copy, Globe, Github, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

const STEPS_META = [
    { id: 1, label: 'Market Discovery' },
    { id: 2, label: 'Skill Simulation' },
    { id: 3, label: 'Intelligence Extraction' },
    { id: 4, label: 'Diagnostic Archive' },
    { id: 5, label: 'Knowledge Base' },
    { id: 6, label: 'Identity Config' },
    { id: 7, label: 'Integrity Audit' },
    { id: 8, label: 'Shipment Gate' }
];

export default function ShipReady() {
    const navigate = useNavigate();

    // State for Proof Links
    const [links, setLinks] = useState(() => {
        const saved = localStorage.getItem('prp_final_submission');
        return saved ? JSON.parse(saved) : { lovable: '', github: '', live: '' };
    });

    // State for Step Progress
    const [stepsProgress, setStepsProgress] = useState(() => {
        const saved = localStorage.getItem('prp_steps_progress');
        return saved ? JSON.parse(saved) : {};
    });

    // State for QA Progress
    const [qaChecked, setQaChecked] = useState(() => {
        const saved = localStorage.getItem('prp_qa_completed');
        return saved ? JSON.parse(saved) : [];
    });

    const [isShipped, setIsShipped] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        // Mark step 8 as visited
        const progress = { ...stepsProgress, 8: true };
        setStepsProgress(progress);
        localStorage.setItem('prp_steps_progress', JSON.stringify(progress));
    }, []);

    useEffect(() => {
        // Validation for Shipped Status
        const allStepsDone = STEPS_META.every(s => stepsProgress[s.id]);
        const allQaDone = qaChecked.length === 10;
        const allLinksDone = links.lovable && links.github && links.live;

        const shipped = allStepsDone && allQaDone && allLinksDone;
        setIsShipped(shipped);

        // Sync with Layout's status badge (it uses prp_proof_footer)
        const footerStatus = JSON.parse(localStorage.getItem('prp_proof_footer') || '{"ui":false,"logic":false,"test":false,"deploy":false}');
        footerStatus.deploy = shipped;
        footerStatus.test = allQaDone;
        footerStatus.ui = allStepsDone;
        localStorage.setItem('prp_proof_footer', JSON.stringify(footerStatus));

        // Trigger a custom event to notify Layout of state changes
        window.dispatchEvent(new Event('storage'));
    }, [stepsProgress, qaChecked, links]);

    const handleLinkChange = (key, value) => {
        const newLinks = { ...links, [key]: value };
        setLinks(newLinks);
        localStorage.setItem('prp_final_submission', JSON.stringify(newLinks));
    };

    const handleCopySubmission = () => {
        const text = `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovable || 'N/A'}
GitHub Repository: ${links.github || 'N/A'}
Live Deployment: ${links.live || 'N/A'}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`;

        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    };

    return (
        <div className="space-y-12 pb-20">
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                    <h2 className="heading-md uppercase">Shipment Gate</h2>
                    <p className="text-slate-500 font-medium text-sm">Final verification protocol before production authorization.</p>
                </div>
                <div className={`flex items-center gap-3 px-4 py-2 border transition-all ${isShipped ? 'bg-success/5 border-success/30 text-success' : 'bg-accent/5 border-accent/20 text-accent'}`}>
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{isShipped ? 'System Shipped' : 'System Locked'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Section A: Step Completion Overview */}
                <div className="card-premium space-y-8">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-border pb-2 flex items-center gap-2">
                        <Zap size={14} /> Step Completion Overview
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {STEPS_META.map((step) => (
                            <div key={step.id} className="flex items-center justify-between p-3 bg-background border border-border">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-slate-400">0{step.id}</span>
                                    <span className="font-bold text-[13px] text-text-primary">{step.label}</span>
                                </div>
                                {stepsProgress[step.id] ? (
                                    <span className="text-[9px] font-black text-success uppercase">Completed</span>
                                ) : (
                                    <span className="text-[9px] font-black text-slate-300 uppercase">Pending</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section B: Artifact Inputs */}
                <div className="card-premium space-y-8">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-border pb-2 flex items-center gap-2">
                        <Globe size={14} /> Artifact Inputs
                    </h3>
                    <div className="space-y-6">
                        <ArtifactInput
                            label="Lovable Project Link"
                            icon={<Zap size={14} />}
                            value={links.lovable}
                            onChange={(v) => handleLinkChange('lovable', v)}
                            isValid={isValidUrl(links.lovable)}
                        />
                        <ArtifactInput
                            label="GitHub Repository Link"
                            icon={<Github size={14} />}
                            value={links.github}
                            onChange={(v) => handleLinkChange('github', v)}
                            isValid={isValidUrl(links.github)}
                        />
                        <ArtifactInput
                            label="Deployed URL"
                            icon={<ExternalLink size={14} />}
                            value={links.live}
                            onChange={(v) => handleLinkChange('live', v)}
                            isValid={isValidUrl(links.live)}
                        />
                    </div>
                </div>
            </div>

            {/* Final Export & Validation */}
            <div className="space-y-10">
                {!isShipped ? (
                    <div className="card-premium !bg-accent/5 border-dashed border-accent/20 py-20 text-center space-y-6">
                        <ShieldAlert size={48} className="mx-auto text-accent mb-2" />
                        <div className="space-y-2">
                            <h3 className="text-[24px] font-serif font-black text-text-primary uppercase">Shipment Restricted</h3>
                            <p className="body-text text-sm mx-auto max-w-lg">
                                Authorization requires 100% completion across all modules, 10/10 QA protocols, and valid production artifacts.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-widest">
                            <span className={Object.keys(stepsProgress).length >= 8 ? "text-success" : "text-slate-400"}>Steps: {Object.keys(stepsProgress).length}/8</span>
                            <span className={qaChecked.length === 10 ? "text-success" : "text-slate-400"}>QA: {qaChecked.length}/10</span>
                            <span className={links.lovable && links.github && links.live ? "text-success" : "text-slate-400"}>Artifacts: Correct</span>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border-2 border-success p-12 text-center space-y-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Truck size={120} className="-rotate-12 translate-x-12" />
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="w-20 h-20 bg-success text-white rounded-full mx-auto flex items-center justify-center mb-4">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-[42px] font-serif font-black text-text-primary leading-tight">You built a real product.</h3>
                            <div className="max-w-2xl mx-auto space-y-4">
                                <p className="body-text text-[18px] font-medium text-slate-600">
                                    Not a tutorial. Not a clone. A structured tool that solves a real problem.
                                </p>
                                <p className="text-[20px] font-serif italic font-bold text-accent">
                                    This is your proof of work.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-center pt-6 relative z-10">
                            <button
                                onClick={handleCopySubmission}
                                className="btn btn-primary !bg-success !border-success px-16 h-[64px] text-[16px] uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105"
                            >
                                {copySuccess ? "Submission Copied!" : "Copy Final Submission"} <Copy size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Checklist items passed overview */}
            <div className="card-premium !bg-background border-dashed text-center py-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Platform Integrity: {qaChecked.length}/10 Protocols Passed</span>
            </div>
        </div>
    );
}

function ArtifactInput({ label, icon, value, onChange, isValid }) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-text-primary tracking-widest flex items-center gap-2">
                {icon} {label}
            </label>
            <div className="relative">
                <input
                    type="url"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`input-field !py-4 font-mono text-[13px] ${value && !isValid ? 'border-accent' : (value && isValid ? 'border-success' : 'border-border')}`}
                    placeholder="https://..."
                />
                {value && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isValid ? <CheckCircle2 size={16} className="text-success" /> : <ShieldAlert size={16} className="text-accent" />}
                    </div>
                )}
            </div>
        </div>
    );
}

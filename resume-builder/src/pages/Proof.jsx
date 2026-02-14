import { useState, useEffect } from 'react';
import { Check, Clipboard, ExternalLink, ShieldCheck, AlertCircle, Ship } from 'lucide-react';

function Proof() {
    const [steps, setSteps] = useState(() => {
        const saved = localStorage.getItem('rb_steps_completed');
        return saved ? JSON.parse(saved) : Array(8).fill(false);
    });

    const [checklist, setChecklist] = useState(() => {
        const saved = localStorage.getItem('rb_checklist_passed');
        return saved ? JSON.parse(saved) : Array(10).fill(false);
    });

    const [submission, setSubmission] = useState(() => {
        const saved = localStorage.getItem('rb_final_submission');
        return saved ? JSON.parse(saved) : {
            lovable: '',
            github: '',
            live: ''
        };
    });

    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        localStorage.setItem('rb_steps_completed', JSON.stringify(steps));
    }, [steps]);

    useEffect(() => {
        localStorage.setItem('rb_checklist_passed', JSON.stringify(checklist));
    }, [checklist]);

    useEffect(() => {
        localStorage.setItem('rb_final_submission', JSON.stringify(submission));
    }, [submission]);

    const stepTitles = [
        "Project Architecture",
        "UI Component System",
        "Dynamic Data Binding",
        "Real-time Preview Engine",
        "PDF Print Logic",
        "ATS Scoring Algorithm",
        "Multi-template Styles",
        "State Persistence"
    ];

    const checklistItems = [
        "All form sections save to localStorage",
        "Live preview updates in real-time",
        "Template switching preserves data",
        "Color theme persists after refresh",
        "ATS score calculates correctly",
        "Score updates live on edit",
        "Export buttons work (copy/download)",
        "Empty states handled gracefully",
        "Mobile responsive layout works",
        "No console errors on any page"
    ];

    const toggleStep = (idx) => {
        const newSteps = [...steps];
        newSteps[idx] = !newSteps[idx];
        setSteps(newSteps);
    };

    const toggleChecklist = (idx) => {
        const newChecklist = [...checklist];
        newChecklist[idx] = !newChecklist[idx];
        setChecklist(newChecklist);
    };

    const handleSubmissionChange = (field, value) => {
        setSubmission(prev => ({ ...prev, [field]: value }));
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    const isStepsComplete = steps.every(Boolean);
    const isChecklistComplete = checklist.every(Boolean);
    const isLinksProvided = isValidUrl(submission.lovable) && isValidUrl(submission.github) && isValidUrl(submission.live);
    const isShipped = isStepsComplete && isChecklistComplete && isLinksProvided;

    const copyFinalSubmission = () => {
        const text = `
------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${submission.lovable}
GitHub Repository: ${submission.github}
Live Deployment: ${submission.live}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------
        `.trim();
        navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className="min-h-full bg-slate-50 p-8 flex flex-col items-center">
            <div className="max-w-4xl w-full flex flex-col gap-8">

                {/* Header Information */}
                <div className="bg-white border rounded-xl p-8 flex justify-between items-center shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">Production Verification</h1>
                        <p className="text-sm text-muted-foreground">Confirm build integrity and collect artifacts for final submission.</p>
                    </div>
                    <div className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 border shadow-sm transition-all duration-500 ${isShipped ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        {isShipped ? <Ship className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                        {isShipped ? 'SHIPPED' : 'IN PROGRESS'}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* A) Step Completion Overview */}
                    <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                            <Check className="w-4 h-4" /> Step Status
                        </h2>
                        <div className="space-y-3 flex-1">
                            {stepTitles.map((title, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => toggleStep(idx)}
                                    className={`w-full text-left p-3 rounded-lg border flex justify-between items-center transition-all ${steps[idx] ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-slate-100 hover:border-slate-300 bg-white text-slate-600'}`}
                                >
                                    <span className="text-xs font-medium">{idx + 1}. {title}</span>
                                    {steps[idx] && <Check className="w-4 h-4 text-emerald-500" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* B) Validation Checklist */}
                    <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> Feature Checklist
                        </h2>
                        <div className="space-y-2 flex-1">
                            {checklistItems.map((item, idx) => (
                                <label key={idx} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={checklist[idx]}
                                        onChange={() => toggleChecklist(idx)}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className={`text-[11px] leading-tight transition-colors ${checklist[idx] ? 'text-slate-900' : 'text-slate-400'}`}>
                                        {item}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* C) Artifact Collection */}
                <div className="bg-white border rounded-xl p-8 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" /> Artifact Documentation
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">Lovable Project Link</label>
                            <input
                                type="url"
                                value={submission.lovable}
                                onChange={(e) => handleSubmissionChange('lovable', e.target.value)}
                                placeholder="https://lovable.dev/projects/..."
                                className={`w-full p-3 text-xs border rounded-lg focus:ring-2 outline-none transition-all ${submission.lovable && !isValidUrl(submission.lovable) ? 'border-red-200 bg-red-50 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-50'}`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">GitHub Repository Link</label>
                            <input
                                type="url"
                                value={submission.github}
                                onChange={(e) => handleSubmissionChange('github', e.target.value)}
                                placeholder="https://github.com/..."
                                className={`w-full p-3 text-xs border rounded-lg focus:ring-2 outline-none transition-all ${submission.github && !isValidUrl(submission.github) ? 'border-red-200 bg-red-50 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-50'}`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">Deployed URL</label>
                            <input
                                type="url"
                                value={submission.live}
                                onChange={(e) => handleSubmissionChange('live', e.target.value)}
                                placeholder="https://..."
                                className={`w-full p-3 text-xs border rounded-lg focus:ring-2 outline-none transition-all ${submission.live && !isValidUrl(submission.live) ? 'border-red-200 bg-red-50 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-50'}`}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-6 border-t">
                        <div className="flex items-center gap-2 text-xs">
                            {!isShipped && (
                                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 font-medium">
                                    <AlertCircle className="w-3 h-3" />
                                    Complete all sections to mark as Shipped.
                                </div>
                            )}
                            {isShipped && (
                                <div className="text-emerald-700 font-bold tracking-tight">
                                    Project 3 Shipped Successfully.
                                </div>
                            )}
                        </div>
                        <button
                            disabled={!isShipped}
                            onClick={copyFinalSubmission}
                            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-sm ${isShipped ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                        >
                            {copySuccess ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                            {copySuccess ? 'Copied Details' : 'Copy Final Submission'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Proof;

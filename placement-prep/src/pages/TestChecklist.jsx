import { useState, useEffect } from 'react';
import { ClipboardCheck, ShieldAlert, RotateCcw, Info, CheckCircle2 } from 'lucide-react';

const TEST_ITEMS = [
    { id: 'jd_req', text: "JD required validation works", hint: "Try submitting the analyzer with an empty JD textarea." },
    { id: 'short_jd', text: "Short JD warning shows for <200 chars", hint: "Enter ~50 characters in JD and check for the 'Calm Warning'." },
    { id: 'skills_grp', text: "Skills extraction groups correctly", hint: "Paste a JD with 'React' and 'SQL' and verify they go into Web and Data categories." },
    { id: 'round_map', text: "Round mapping changes based on company + skills", hint: "Toggle between 'Google' and a 'Startup' analyzer and check rounds." },
    { id: 'det_score', text: "Score calculation is deterministic", hint: "Running the same JD twice should result in identical base scores." },
    { id: 'live_toggle', text: "Skill toggles update score live", hint: "On results page, toggle a skill 'Known' and watch the score change instantly." },
    { id: 'persist_refresh', text: "Changes persist after refresh", hint: "Toggle a skill, refresh the results page, and ensure the state remains." },
    { id: 'history_load', text: "History saves and loads correctly", hint: "Create 3 analyses and verify all 3 appear in the Archive page." },
    { id: 'export_copy', text: "Export buttons copy the correct content", hint: "Click 'Copy Brief' and paste it in notepad to verify content." },
    { id: 'no_errors', text: "No console errors on core pages", hint: "Open F12 DevTools and browse through Assessment, Results, and History." },
];

export default function TestChecklist() {
    const [checkedItems, setCheckedItems] = useState(() => {
        const saved = localStorage.getItem('prp_test_checklist');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('prp_test_checklist', JSON.stringify(checkedItems));
    }, [checkedItems]);

    const handleToggle = (id) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset the entire test checklist?")) {
            setCheckedItems({});
        }
    };

    const passedCount = Object.values(checkedItems).filter(Boolean).length;
    const isReady = passedCount === TEST_ITEMS.length;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-xl text-primary">
                            <ClipboardCheck size={28} />
                        </div>
                        Quality Assurance Center
                    </h1>
                    <p className="text-slate-500 font-medium">Verify system integrity before final deployment.</p>
                </div>
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-red-500 font-bold transition-all text-sm uppercase tracking-widest"
                >
                    <RotateCcw size={16} /> Reset Checklist
                </button>
            </header>

            {/* Summary Card */}
            <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${isReady ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative w-32 h-32 flex-shrink-0">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="64" cy="64" r="60" className="stroke-white fill-none stroke-[8]" />
                            <circle
                                cx="64" cy="64" r="60"
                                style={{ strokeDasharray: 377, strokeDashoffset: 377 - (passedCount / TEST_ITEMS.length) * 377 }}
                                className={`fill-none stroke-[8] stroke-round transition-all duration-1000 ${isReady ? 'stroke-emerald-500' : 'stroke-amber-500'}`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-3xl font-black ${isReady ? 'text-emerald-700' : 'text-amber-700'}`}>{passedCount} / {TEST_ITEMS.length}</span>
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h2 className={`text-2xl font-black ${isReady ? 'text-emerald-900' : 'text-amber-900'}`}>
                            {isReady ? 'All Protocols Validated' : 'Validation in Progress'}
                        </h2>
                        {isReady ? (
                            <div className="flex items-center gap-2 text-emerald-600 font-bold">
                                <CheckCircle2 size={20} />
                                Platform ready for final shipment gate.
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-amber-600 font-bold animate-pulse">
                                <ShieldAlert size={20} />
                                Fix issues before shipping. Deployment locked.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Checklist Items */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                    {TEST_ITEMS.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleToggle(item.id)}
                            className={`p-6 flex items-start gap-6 cursor-pointer transition-all hover:bg-slate-50/50 ${checkedItems[item.id] ? 'bg-emerald-50/30' : ''}`}
                        >
                            <div className={`flex-shrink-0 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${checkedItems[item.id] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-transparent group-hover:border-primary/50'}`}>
                                <CheckCircle2 size={20} />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h4 className={`font-bold transition-all ${checkedItems[item.id] ? 'text-emerald-900 line-through opacity-50' : 'text-slate-800'}`}>
                                    {item.text}
                                </h4>
                                <div className="flex items-start gap-2 text-xs text-slate-400 font-medium italic group">
                                    <Info size={14} className="mt-0.5" />
                                    <span>How to test: {item.hint}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center pt-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center">
                    Validation status is stored locally and persists across sessions.
                </p>
            </div>
        </div>
    );
}

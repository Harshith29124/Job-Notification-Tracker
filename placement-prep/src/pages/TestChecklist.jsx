import { useState, useEffect } from 'react';
import { ClipboardCheck, ShieldAlert, RotateCcw, Info, CheckCircle2 } from 'lucide-react';

const TEST_ITEMS = [
    { id: 'jd_req', text: "JD required validation works", hint: "Try submitting the analyzer with an empty JD textarea." },
    { id: 'short_jd', text: "Short JD warning shows for <200 chars", hint: "Enter ~50 characters in JD and check for the 'Capacity Warning'." },
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
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
                <div>
                    <h2 className="heading-md uppercase">Quality Assurance Center</h2>
                    <p className="text-slate-500 font-medium text-sm">Verify system integrity before final deployment.</p>
                </div>
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-accent font-bold transition-all text-[11px] uppercase tracking-[0.2em]"
                >
                    <RotateCcw size={14} /> Reset Protocol
                </button>
            </header>

            {/* Summary Card */}
            <div className={`p-8 rounded border transition-all duration-500 ${isReady ? 'bg-success/5 border-success/20' : 'bg-warning/5 border-warning/20'}`}>
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-shrink-0 text-center">
                        <div className={`text-[48px] font-serif font-black ${isReady ? 'text-success' : 'text-warning'}`}>{passedCount} / {TEST_ITEMS.length}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Checkpoints Passed</div>
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-3">
                        <h2 className={`text-[20px] font-serif font-bold ${isReady ? 'text-success' : 'text-warning'}`}>
                            {isReady ? 'All Protocols Validated' : 'Validation in Progress'}
                        </h2>
                        <div className={`flex items-center gap-2 text-[13px] font-bold ${isReady ? 'text-success' : 'text-warning/80 italic'}`}>
                            {isReady ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                            {isReady ? 'Platform ready for final shipment gate.' : 'Pending manual verification of core system behaviors.'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Checklist Items */}
            <div className="bg-white border border-border rounded overflow-hidden">
                <div className="divide-y divide-border">
                    {TEST_ITEMS.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleToggle(item.id)}
                            className={`p-6 flex items-start gap-6 cursor-pointer transition-all hover:bg-background ${checkedItems[item.id] ? 'bg-background/50' : ''}`}
                        >
                            <div className={`flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-all ${checkedItems[item.id] ? 'bg-accent border-accent text-white' : 'border-border bg-white text-transparent'}`}>
                                <Check size={14} strokeWidth={4} />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h4 className={`text-[15px] font-bold transition-all ${checkedItems[item.id] ? 'text-slate-400 line-through' : 'text-text-primary'}`}>
                                    {item.text}
                                </h4>
                                <div className="flex items-start gap-2 text-[12px] text-slate-400 font-medium italic">
                                    <Info size={13} className="mt-0.5 flex-shrink-0" />
                                    <span>Protocol: {item.hint}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

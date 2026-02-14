import { Printer, Copy, AlertTriangle, ExternalLink, Github, Check, XCircle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

// Color definitions moved outside to avoid re-creation
const colors = {
    teal: '168, 60%, 40%',
    navy: '220, 60%, 35%',
    burgundy: '345, 60%, 35%',
    forest: '150, 50%, 30%',
    charcoal: '0, 0%, 25%'
};

function Preview({ data, template = 'modern', color = 'teal', score = 0, suggestions = [] }) {
    const [warnings, setWarnings] = useState([]);
    const [showToast, setShowToast] = useState(false);

    if (!data) return null;

    const accentColor = colors[color] || colors.teal;

    // Helper to render skills (Modern handles them in sidebar, others in main)
    const renderSkillGroups = () => {
        if (!data.skills) return null;
        let categories = {};
        if (typeof data.skills === 'string') {
            categories = { 'Skills': data.skills.split(',').filter(Boolean) };
        } else {
            if (data.skills.technical?.length) categories['Technical Skills'] = data.skills.technical;
            if (data.skills.soft?.length) categories['Soft Skills'] = data.skills.soft;
            if (data.skills.tools?.length) categories['Tools & Technologies'] = data.skills.tools;
        }

        return Object.entries(categories).map(([label, skills]) => (
            <div key={label} className="mb-4 page-break-avoid">
                <h4 className={template === 'modern' ? "text-[10px] font-bold uppercase tracking-wider text-white/60 mb-2 mt-4" : "text-[10px] font-bold uppercase tracking-wider opacity-60 mb-2"}>{label}</h4>
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => <span key={i} className={template === 'modern' ? "text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full mb-1 inline-block" : styles[template]?.skills || styles.modern.skills}>{skill.trim()}</span>)}
                </div>
            </div>
        ));
    };

    const validateData = () => {
        const issues = [];
        if (!data.personal.fullName) issues.push("Missing Full Name");
        if (data.experience.length === 0 && data.projects.length === 0) issues.push("No Experience or Projects listed");
        if (!data.summary) issues.push("Missing Professional Summary");
        return issues;
    };

    const handlePrint = () => {
        const issues = validateData();
        if (issues.length > 0) {
            setWarnings(issues);
            setTimeout(() => window.print(), 100);
        } else {
            window.print();
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const copyToClipboard = () => {
        const techStr = (t) => Array.isArray(t) ? t.join(', ') : t;
        const skillsStr = typeof data.skills === 'string'
            ? data.skills
            : Object.values(data.skills).flat().join(', ');

        const text = `
${data.personal.fullName}
${data.personal.email} | ${data.personal.phone} | ${data.personal.location}
${data.personal.linkedin ? 'LinkedIn: ' + data.personal.linkedin : ''} | ${data.personal.github ? 'GitHub: ' + data.personal.github : ''}

SUMMARY
${data.summary}

EXPERIENCE
${data.experience.map(e => `${e.company} - ${e.role} (${e.duration})\n${e.description}`).join('\n\n')}

PROJECTS
${data.projects.map(p => `${p.name} (${techStr(p.tech)})\n${p.description}`).join('\n\n')}

EDUCATION
${data.education.map(e => `${e.institution} - ${e.degree} (${e.year})`).join('\n')}

SKILLS
${skillsStr}
        `.trim();
        navigator.clipboard.writeText(text);
        alert("Resume copied to clipboard (Plain Text format)");
    };

    // Template Styles
    const styles = {
        classic: {
            container: "font-serif text-black leading-relaxed",
            outer: "bg-white",
            header: "border-b-2 pb-6 mb-8 text-center",
            name: "text-4xl font-bold uppercase tracking-wide mb-2",
            contact: "text-sm uppercase tracking-widest flex justify-center gap-4 flex-wrap text-neutral-600",
            sectionTitle: "text-sm font-sans font-bold uppercase tracking-wider border-b pb-1 mb-4 mt-6",
            entryTitle: "font-bold text-lg",
            entrySubtitle: "text-sm font-medium italic mb-2 text-neutral-700",
            meta: "text-xs font-sans text-neutral-500",
            skills: "bg-neutral-100 px-2 py-1 rounded text-xs font-sans font-medium text-neutral-700 border border-neutral-200 uppercase tracking-wide",
            headerStyle: { borderColor: `hsl(${accentColor})` },
            titleStyle: { color: `hsl(${accentColor})`, borderColor: `hsl(${accentColor})` }
        },
        modern: {
            container: "font-sans text-slate-800 leading-normal grid grid-cols-[30%_70%] min-h-full",
            outer: "bg-white",
            sidebar: "bg-slate-50 p-6 border-r min-h-full", // min-h-full crucial for full sidebar
            main: "p-8",
            header: "mb-8",
            name: "text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight",
            contact: "text-xs text-white/80 flex flex-col gap-1.5",
            sectionTitle: "text-xs font-bold uppercase tracking-widest mb-4 mt-6",
            entryTitle: "font-bold text-lg text-slate-900",
            entrySubtitle: "text-sm font-medium text-slate-600 mb-1",
            meta: "text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded",
            skills: "text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full",
            sidebarHeader: "text-white -m-6 mb-6 p-6 pb-8",
            titleStyle: { color: `hsl(${accentColor})` }
        },
        minimal: {
            container: "font-sans text-neutral-900 leading-relaxed max-w-[90%] mx-auto",
            outer: "bg-white",
            header: "mb-12 pt-12",
            name: "text-4xl font-light tracking-tight mb-4",
            contact: "text-sm text-neutral-500 grid grid-cols-2 gap-y-1 w-fit",
            sectionTitle: "text-sm font-medium text-neutral-400 mb-6 mt-8",
            entryTitle: "font-medium text-base",
            entrySubtitle: "text-sm text-neutral-500",
            meta: "text-xs text-neutral-400",
            skills: "text-sm border-b border-neutral-100 pb-0.5",
            titleStyle: { color: `hsl(${accentColor})` }
        }
    };

    const s = styles[template] || styles.modern;

    // ATS Score Logic for UI
    const scoreColor = score <= 40 ? 'text-red-500' : score <= 70 ? 'text-amber-500' : 'text-green-500';
    const scoreLabel = score <= 40 ? 'Needs Work' : score <= 70 ? 'Getting There' : 'Strong Resume';

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-8 max-w-7xl mx-auto">
            {/* Left: Score Card (Fixed on Desktop) */}
            <div className="w-full lg:w-64 flex flex-col gap-6 lg:sticky lg:top-24 h-fit print:hidden">
                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">ATS Score</h3>
                    <div className="relative w-32 h-32 mx-auto flex items-center justify-center mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={351.86} strokeDashoffset={351.86 - (351.86 * score) / 100} className={`${scoreColor} transition-all duration-700 ease-out`} />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
                            <span className="text-[10px] font-bold uppercase opacity-60">Points</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className={`text-sm font-bold ${scoreColor} mb-1`}>{scoreLabel}</div>
                        <p className="text-[10px] text-muted-foreground leading-tight">Your resume's visibility to applicant tracking systems.</p>
                    </div>
                </div>

                {suggestions.length > 0 && (
                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Improvements</h3>
                        <div className="space-y-3">
                            {suggestions.map((suggestion, idx) => (
                                <div key={idx} className="flex gap-2 group">
                                    <div className="mt-1 shrink-0"><Check className="w-3 h-3 text-slate-300 group-hover:text-primary transition-colors" /></div>
                                    <p className="text-xs text-slate-600 leading-tight">{suggestion}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Resume Preview */}
            <div className="flex-1 flex flex-col items-center">
                <ToolBar handlePrint={handlePrint} copyToClipboard={copyToClipboard} warnings={warnings} showToast={showToast} />

                {/* Resume Canvas */}
                <div
                    className={`w-[210mm] min-h-[297mm] shadow-2xl print:shadow-none print:m-0 print:p-0 ${s.outer} ${s.container} origin-top scale-[0.6] sm:scale-[0.8] md:scale-[0.9] lg:scale-100 transition-transform`}
                    id="resume-preview"
                    style={{ '--accent': `hsl(${accentColor})` }}
                >
                    {/* Render logic depending on template */}
                    {template === 'modern' ? (
                        <>
                            {/* Sidebar Pane */}
                            <div className={s.sidebar}>
                                <div className={`${s.sidebarHeader}`} style={{ backgroundColor: `hsl(${accentColor})` }}>
                                    <h1 className={s.name}>{data.personal.fullName || 'YOUR NAME'}</h1>
                                    <div className={s.contact}>
                                        {data.personal.location && <span>{data.personal.location}</span>}
                                        {data.personal.email && <span>{data.personal.email}</span>}
                                        {data.personal.phone && <span>{data.personal.phone}</span>}
                                        <div className="flex gap-3 mt-2 pt-2 border-t border-white/20">
                                            {data.personal.linkedin && <span className="opacity-80 hover:opacity-100 flex items-center gap-1"><ExternalLink className="w-3 h-3" /> In</span>}
                                            {data.personal.github && <span className="opacity-80 hover:opacity-100 flex items-center gap-1"><Github className="w-3 h-3" /> Git</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8">{renderSkillGroups()}</div>
                            </div>

                            {/* Main Content Pane */}
                            <div className={s.main}>
                                <ResumeSections data={data} s={s} />
                            </div>
                        </>
                    ) : (
                        <div className="w-full">
                            <header className={s.header} style={s.headerStyle}>
                                <h1 className={s.name} style={{ color: template === 'minimal' ? `hsl(${accentColor})` : undefined }}>{data.personal.fullName || 'YOUR NAME'}</h1>
                                <div className={s.contact}>
                                    {data.personal.email && <span>{data.personal.email}</span>}
                                    {data.personal.phone && <span>{(template !== 'minimal' ? '• ' : '') + data.personal.phone}</span>}
                                    {data.personal.location && <span>{(template !== 'minimal' ? '• ' : '') + data.personal.location}</span>}
                                    {data.personal.linkedin && <span>{(template !== 'minimal' ? '• ' : '') + 'LinkedIn'}</span>}
                                </div>
                            </header>
                            <ResumeSections data={data} s={s} showSkills={true} renderSkills={renderSkillGroups} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Sub-component for shared sections between templates
function ResumeSections({ data, s, showSkills = false, renderSkills }) {
    return (
        <>
            {data.summary && (
                <section className="mb-8">
                    <h2 className={s.sectionTitle} style={s.titleStyle}>Professional Profile</h2>
                    <p className="text-sm text-slate-600 leading-relaxed text-justify">{data.summary}</p>
                </section>
            )}

            {data.experience.length > 0 && (
                <section className="mb-8">
                    <h2 className={s.sectionTitle} style={s.titleStyle}>Experience</h2>
                    <div className="space-y-6">
                        {data.experience.map(exp => (
                            <div key={exp.id} className="page-break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={s.entryTitle}>{exp.company || 'Company Name'}</h3>
                                    <span className={s.meta}>{exp.duration || 'Date Range'}</span>
                                </div>
                                <div className={s.entrySubtitle}>{exp.role || 'Job Title'}</div>
                                <p className="text-sm text-slate-600 whitespace-pre-wrap">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.projects && data.projects.length > 0 && (
                <section className="mb-8">
                    <h2 className={s.sectionTitle} style={s.titleStyle}>Projects</h2>
                    <div className="space-y-6">
                        {data.projects.map(proj => (
                            <div key={proj.id} className="page-break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className={s.entryTitle}>{proj.name || 'Project Name'}</h3>
                                        <div className="flex gap-2 opacity-50 print:hidden">
                                            {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="hover:text-primary"><ExternalLink className="w-3 h-3" /></a>}
                                            {proj.github && <a href={proj.github} target="_blank" rel="noreferrer" className="hover:text-primary"><Github className="w-3 h-3" /></a>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {(Array.isArray(proj.tech) ? proj.tech : proj.tech ? proj.tech.split(',') : []).map((t, i) => (
                                        <span key={i} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{t}</span>
                                    ))}
                                </div>
                                <p className="text-sm text-slate-600 whitespace-pre-wrap">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.education.length > 0 && (
                <section className="mb-8">
                    <h2 className={s.sectionTitle} style={s.titleStyle}>Education</h2>
                    <div className="space-y-4">
                        {data.education.map(edu => (
                            <div key={edu.id} className="flex justify-between items-baseline page-break-inside-avoid">
                                <div>
                                    <h3 className={s.entryTitle}>{edu.institution || 'University Name'}</h3>
                                    <div className={s.entrySubtitle}>{edu.degree || 'Degree'}</div>
                                </div>
                                <span className={s.meta}>{edu.year || 'Year'}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {showSkills && renderSkills && (
                <section>
                    <h2 className={s.sectionTitle} style={s.titleStyle}>Technical Skills</h2>
                    {renderSkills()}
                </section>
            )}
        </>
    );
}

function ToolBar({ handlePrint, copyToClipboard, warnings, showToast }) {
    return (
        <div className="w-full max-w-[210mm] mb-6 flex justify-between items-center print:hidden px-4 md:px-0 relative">
            <div className="flex items-center gap-2">
                <button onClick={handlePrint} className="bg-foreground text-background px-4 py-2 rounded font-semibold text-sm hover:bg-foreground/90 transition-colors flex items-center gap-2">
                    <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
                <button onClick={copyToClipboard} className="bg-secondary text-secondary-foreground px-4 py-2 rounded font-semibold text-sm hover:bg-secondary/80 transition-colors flex items-center gap-2">
                    <Copy className="w-4 h-4" /> Copy Text
                </button>
            </div>
            {warnings.length > 0 && (
                <div className="flex items-center gap-2 text-yellow-600 text-xs bg-yellow-50 px-3 py-1.5 rounded border border-yellow-200">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Incomplete: {warnings.join(', ')}</span>
                </div>
            )}

            {showToast && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-slate-900 text-white px-4 py-2 rounded shadow-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2 z-50">
                    <Check className="w-4 h-4 text-green-400" />
                    PDF export ready! Check your downloads.
                </div>
            )}
        </div>
    );
}

export default Preview;

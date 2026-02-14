import { useState } from 'react';
import { Upload, Plus, Trash2, Link as LinkIcon, Briefcase, GraduationCap, Code, FolderGit2, AlertCircle, Check, Loader2, Sparkles, X, ChevronDown, ChevronUp, ExternalLink, Github } from 'lucide-react';
import Preview from './Preview';

function Builder({ data, setData, loadSampleData, score, suggestions, template, setTemplate, color, setColor }) {
    const [activeTab, setActiveTab] = useState('personal');
    const [loading, setLoading] = useState(false);

    const checkBulletQuality = (text) => {
        if (!text) return [];
        const issues = [];
        const actionVerbs = ['Built', 'Developed', 'Designed', 'Implemented', 'Led', 'Improved', 'Created', 'Optimized', 'Automated', 'Managed', 'Orchestrated', 'Engineered', 'Architected', 'Refactored', 'Analyzed', 'Initiated'];

        const firstWord = text.trim().split(' ')[0];
        if (firstWord && !actionVerbs.some(v => v.toLowerCase() === firstWord.toLowerCase())) {
            issues.push("Start with a strong action verb.");
        }

        if (!/\d+|%|k\b/i.test(text)) {
            issues.push("Add measurable impact (numbers).");
        }
        return issues;
    };

    const updatePersonal = (field, value) => {
        setData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
    };

    const addEducation = () => {
        const newEd = { id: Date.now(), institution: '', degree: '', year: '' };
        setData(prev => ({ ...prev, education: [...prev.education, newEd] }));
    };

    const updateEducation = (id, field, value) => {
        setData(prev => ({ ...prev, education: prev.education.map(ed => ed.id === id ? { ...ed, [field]: value } : ed) }));
    };

    const deleteEducation = (id) => {
        setData(prev => ({ ...prev, education: prev.education.filter(ed => ed.id !== id) }));
    };

    const addExperience = () => {
        const newEx = { id: Date.now(), company: '', role: '', duration: '', description: '' };
        setData(prev => ({ ...prev, experience: [...prev.experience, newEx] }));
    };

    const updateExperience = (id, field, value) => {
        setData(prev => ({ ...prev, experience: prev.experience.map(ex => ex.id === id ? { ...ex, [field]: value } : ex) }));
    };

    const deleteExperience = (id) => {
        setData(prev => ({ ...prev, experience: prev.experience.filter(ex => ex.id !== id) }));
    };

    // --- Projects Logic ---
    const addProject = () => {
        const newProj = { id: Date.now(), name: '', tech: [], description: '', link: '', github: '' };
        setData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
    };

    const updateProject = (id, field, value) => {
        setData(prev => ({ ...prev, projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p) }));
    };

    const deleteProject = (id) => {
        setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
    };

    const addProjectTech = (id, tech) => {
        if (!tech.trim()) return;
        setData(prev => ({
            ...prev,
            projects: prev.projects.map(p => p.id === id ? { ...p, tech: Array.isArray(p.tech) ? [...p.tech, tech.trim()] : [tech.trim()] } : p)
        }));
    };

    const removeProjectTech = (id, techToRemove) => {
        setData(prev => ({
            ...prev,
            projects: prev.projects.map(p => p.id === id ? { ...p, tech: (Array.isArray(p.tech) ? p.tech : []).filter(t => t !== techToRemove) } : p)
        }));
    };

    // --- Skills Logic ---
    const addSkill = (category, skill) => {
        if (!skill.trim()) return;
        setData(prev => {
            const currentSkills = typeof prev.skills === 'string' ? { technical: [], soft: [], tools: [] } : prev.skills;
            const catSkills = currentSkills[category] || [];
            if (catSkills.includes(skill.trim())) return prev;

            return {
                ...prev,
                skills: {
                    ...currentSkills,
                    [category]: [...catSkills, skill.trim()]
                }
            };
        });
    };

    const removeSkill = (category, skill) => {
        setData(prev => {
            const currentSkills = typeof prev.skills === 'string' ? { technical: [], soft: [], tools: [] } : prev.skills;
            return {
                ...prev,
                skills: {
                    ...currentSkills,
                    [category]: (currentSkills[category] || []).filter(s => s !== skill)
                }
            };
        });
    };

    const suggestSkills = () => {
        setLoading(true);
        setTimeout(() => {
            const suggestionsList = {
                technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'],
                soft: ['Team Leadership', 'Problem Solving'],
                tools: ['Git', 'Docker', 'AWS']
            };

            setData(prev => {
                const currentSkills = typeof prev.skills === 'string' ? { technical: [], soft: [], tools: [] } : { ...prev.skills };
                Object.keys(suggestionsList).forEach(cat => {
                    const existing = new Set(currentSkills[cat] || []);
                    suggestionsList[cat].forEach(s => existing.add(s));
                    currentSkills[cat] = Array.from(existing);
                });
                return { ...prev, skills: currentSkills };
            });
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Sidebar Controls */}
            <div className="w-16 border-r border-border bg-card flex flex-col items-center py-4 gap-4">
                <button onClick={() => setActiveTab('personal')} className={`p-2 rounded hover:bg-muted ${activeTab === 'personal' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}><div className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">A</div></button>
                <button onClick={() => setActiveTab('experience')} className={`p-2 rounded hover:bg-muted ${activeTab === 'experience' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}><Briefcase className="w-5 h-5" /></button>
                <button onClick={() => setActiveTab('projects')} className={`p-2 rounded hover:bg-muted ${activeTab === 'projects' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}><FolderGit2 className="w-5 h-5" /></button>
                <button onClick={() => setActiveTab('education')} className={`p-2 rounded hover:bg-muted ${activeTab === 'education' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}><GraduationCap className="w-5 h-5" /></button>
                <button onClick={() => setActiveTab('skills')} className={`p-2 rounded hover:bg-muted ${activeTab === 'skills' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}><Code className="w-5 h-5" /></button>
            </div>

            {/* Editor Panel */}
            <div className="w-[400px] border-r border-border bg-background flex flex-col overflow-y-auto">
                <div className="p-4 border-b border-border flex justify-between items-center sticky top-0 bg-background z-10">
                    <h2 className="font-semibold text-lg capitalize">{activeTab} Details</h2>
                    <button onClick={loadSampleData} className="text-xs text-primary underline">Load Sample</button>
                </div>

                <div className="p-4 space-y-6">
                    {activeTab === 'personal' && (
                        <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                            <input type="text" placeholder="Full Name" className="w-full p-2 border rounded bg-card" value={data.personal.fullName} onChange={e => updatePersonal('fullName', e.target.value)} />
                            <input type="email" placeholder="Email" className="w-full p-2 border rounded bg-card" value={data.personal.email} onChange={e => updatePersonal('email', e.target.value)} />
                            <input type="tel" placeholder="Phone" className="w-full p-2 border rounded bg-card" value={data.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} />
                            <input type="text" placeholder="Location" className="w-full p-2 border rounded bg-card" value={data.personal.location} onChange={e => updatePersonal('location', e.target.value)} />
                            <div className="border-t pt-4 mt-4">
                                <label className="text-xs font-semibold text-muted-foreground mb-2 block">Professional Links</label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4 text-muted-foreground" />
                                        <input type="text" placeholder="LinkedIn URL" className="flex-1 p-2 border rounded bg-card text-sm" value={data.personal.linkedin} onChange={e => updatePersonal('linkedin', e.target.value)} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Github className="w-4 h-4 text-muted-foreground" />
                                        <input type="text" placeholder="GitHub URL" className="flex-1 p-2 border rounded bg-card text-sm" value={data.personal.github} onChange={e => updatePersonal('github', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div className="border-t pt-4 mt-4">
                                <label className="text-xs font-semibold text-muted-foreground mb-2 block">Professional Summary</label>
                                <textarea placeholder="Write a short professional summary..." className="w-full p-2 border rounded bg-card h-32 text-sm" value={data.summary} onChange={e => setData(prev => ({ ...prev, summary: e.target.value }))}></textarea>
                            </div>
                        </div>
                    )}

                    {activeTab === 'education' && (
                        <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                            {data.education.map((ed) => (
                                <div key={ed.id} className="p-3 border rounded bg-card relative group">
                                    <button onClick={() => deleteEducation(ed.id)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                    <input type="text" placeholder="Institution" className="w-full p-1 mb-2 border-b bg-transparent font-medium" value={ed.institution} onChange={e => updateEducation(ed.id, 'institution', e.target.value)} />
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Degree" className="flex-1 p-1 border-b bg-transparent text-sm" value={ed.degree} onChange={e => updateEducation(ed.id, 'degree', e.target.value)} />
                                        <input type="text" placeholder="Year" className="w-20 p-1 border-b bg-transparent text-sm" value={ed.year} onChange={e => updateEducation(ed.id, 'year', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                            <button onClick={addEducation} className="w-full py-2 border-2 border-dashed border-border rounded text-muted-foreground hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2 text-sm">
                                <Plus className="w-4 h-4" /> Add Education
                            </button>
                        </div>
                    )}

                    {activeTab === 'experience' && (
                        <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                            {data.experience.map((ex) => (
                                <div key={ex.id} className="p-3 border rounded bg-card relative group">
                                    <button onClick={() => deleteExperience(ex.id)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                    <input type="text" placeholder="Company" className="w-full p-1 mb-2 border-b bg-transparent font-medium" value={ex.company} onChange={e => updateExperience(ex.id, 'company', e.target.value)} />
                                    <div className="flex gap-2 mb-2">
                                        <input type="text" placeholder="Role" className="flex-1 p-1 border-b bg-transparent text-sm" value={ex.role} onChange={e => updateExperience(ex.id, 'role', e.target.value)} />
                                        <input type="text" placeholder="Duration" className="w-24 p-1 border-b bg-transparent text-sm" value={ex.duration} onChange={e => updateExperience(ex.id, 'duration', e.target.value)} />
                                    </div>
                                    <textarea placeholder="Description / Achievements" className="w-full p-2 border rounded bg-muted/50 text-sm h-24 resize-none" value={ex.description} onChange={e => updateExperience(ex.id, 'description', e.target.value)}></textarea>
                                    {ex.description && checkBulletQuality(ex.description).length > 0 && (
                                        <div className="mt-2 text-xs bg-blue-50 text-blue-800 p-2 rounded flex flex-col gap-1">
                                            {checkBulletQuality(ex.description).map((issue, i) => (
                                                <div key={i} className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {issue}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <button onClick={addExperience} className="w-full py-2 border-2 border-dashed border-border rounded text-muted-foreground hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2 text-sm">
                                <Plus className="w-4 h-4" /> Add Experience
                            </button>
                        </div>
                    )}

                    {activeTab === 'skills' && (
                        <div className="animate-in slide-in-from-left-4 duration-300 space-y-6">
                            <button
                                onClick={suggestSkills}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                {loading ? 'Generating...' : '✨ Suggest AI Skills'}
                            </button>

                            {['technical', 'soft', 'tools'].map(cat => (
                                <div key={cat} className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{cat} Skills</label>
                                    <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
                                        {((typeof data.skills === 'string' ? [] : data.skills[cat]) || []).map(skill => (
                                            <span key={skill} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs flex items-center gap-1 group cursor-default">
                                                {skill}
                                                <button onClick={() => removeSkill(cat, skill)} className="hover:text-destructive"><X className="w-3 h-3" /></button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={`Type ${cat} skill & press Enter...`}
                                        className="w-full p-2 border rounded bg-card text-sm"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSkill(cat, e.currentTarget.value);
                                                e.currentTarget.value = '';
                                            }
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                            {data.projects.map((proj) => (
                                <details key={proj.id} className="group border rounded-lg bg-card open:ring-1 open:ring-primary/20">
                                    <summary className="flex justify-between items-center p-3 cursor-pointer list-none select-none hover:bg-muted/50 rounded-lg">
                                        <div className="font-medium flex items-center gap-2">
                                            {proj.name || 'New Project'}
                                            {(!proj.name) && <span className="text-xs text-muted-foreground italic">(Untitled)</span>}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={(e) => { e.preventDefault(); deleteProject(proj.id); }} className="text-muted-foreground hover:text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
                                            <ChevronDown className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform" />
                                        </div>
                                    </summary>
                                    <div className="p-4 pt-0 space-y-4 border-t border-border/50 mt-2">
                                        <input type="text" placeholder="Project Name" className="w-full p-2 border rounded bg-card" value={proj.name} onChange={e => updateProject(proj.id, 'name', e.target.value)} />
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex items-center gap-2 border rounded p-2 bg-card">
                                                <LinkIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                                                <input type="text" placeholder="Live Demo URL" className="w-full bg-transparent text-sm outline-none" value={proj.link || ''} onChange={e => updateProject(proj.id, 'link', e.target.value)} />
                                            </div>
                                            <div className="flex items-center gap-2 border rounded p-2 bg-card">
                                                <Github className="w-4 h-4 text-muted-foreground shrink-0" />
                                                <input type="text" placeholder="GitHub URL" className="w-full bg-transparent text-sm outline-none" value={proj.github || ''} onChange={e => updateProject(proj.id, 'github', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-muted-foreground">Tech Stack (Type & Press Enter)</label>
                                            <div className="flex flex-wrap gap-2">
                                                {(Array.isArray(proj.tech) ? proj.tech : []).map(t => (
                                                    <span key={t} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs flex items-center gap-1 border border-slate-200">
                                                        {t}
                                                        <button onClick={() => removeProjectTech(proj.id, t)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                                                    </span>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Add tech..."
                                                className="w-full p-2 border rounded bg-card text-sm"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addProjectTech(proj.id, e.currentTarget.value);
                                                        e.currentTarget.value = '';
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <textarea
                                                placeholder="Description / Outcomes..."
                                                className="w-full p-2 border rounded bg-muted/50 text-sm h-24 resize-none"
                                                value={proj.description}
                                                onChange={e => updateProject(proj.id, 'description', e.target.value)}
                                                maxLength={200}
                                            ></textarea>
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{proj.description?.length || 0}/200 chars</span>
                                            </div>
                                            {proj.description && checkBulletQuality(proj.description).length > 0 && (
                                                <div className="mt-1 text-xs bg-blue-50 text-blue-800 p-2 rounded flex flex-col gap-1">
                                                    {checkBulletQuality(proj.description).map((issue, i) => (
                                                        <div key={i} className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {issue}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </details>
                            ))}
                            <button onClick={addProject} className="w-full py-2 border-2 border-dashed border-border rounded text-muted-foreground hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2 text-sm">
                                <Plus className="w-4 h-4" /> Add Project
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ATS Score Panel */}
            <div className="w-64 border-r border-border bg-card p-4 hidden md:block overflow-y-auto">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">ATS Readiness Score</h3>
                <div className="relative w-32 h-32 mx-auto flex items-center justify-center mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={351.86} strokeDashoffset={351.86 - (351.86 * score) / 100} className={`${score <= 40 ? 'text-red-500' : score <= 70 ? 'text-amber-500' : 'text-green-500'} transition-all duration-1000 ease-out`} />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className={`text-2xl font-bold ${score <= 40 ? 'text-red-500' : score <= 70 ? 'text-amber-500' : 'text-green-500'}`}>{Math.round(score)}</span>
                        <span className="text-[10px] font-bold uppercase opacity-60">Points</span>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <div className={`text-xs font-bold uppercase ${score <= 40 ? 'text-red-500' : score <= 70 ? 'text-amber-500' : 'text-green-500'}`}>
                        {score <= 40 ? 'Needs Work' : score <= 70 ? 'Getting There' : 'Strong Resume'}
                    </div>
                </div>

                <div className="mt-4 border-t border-border pt-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Improvements</h3>
                    <div className="space-y-3">
                        {suggestions.length > 0 ? (
                            suggestions.map((s, i) => (
                                <div key={i} className="text-[10px] p-2 bg-slate-50 border border-slate-100 rounded text-slate-700 flex items-start gap-2">
                                    <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></div>
                                    {s}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-sm text-green-600 font-medium">
                                <Check className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                Strong Resume!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Live Preview Area */}
            <div className="flex-1 bg-muted/30 flex flex-col items-center">
                {/* Visual Template & Color Picker (Top Bar) */}
                <div className="w-full bg-white border-b border-border p-4 flex items-center justify-center sticky top-0 z-20 shadow-sm">
                    <div className="flex flex-col items-center gap-4">
                        {/* Template Picker */}
                        <div className="flex items-center gap-4">
                            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Template:</div>
                            {[
                                { id: 'classic', label: 'Classic' },
                                { id: 'modern', label: 'Modern' },
                                { id: 'minimal', label: 'Minimal' }
                            ].map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setTemplate(t.id)}
                                    className={`relative w-[120px] h-20 rounded border-2 transition-all overflow-hidden group ${template === t.id ? 'border-blue-500 ring-2 ring-blue-500/20 scale-105 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
                                    title={t.label}
                                >
                                    {/* Thumbnail Visuals */}
                                    <div className="flex flex-col h-full bg-slate-50 p-2">
                                        <div className="h-2 w-1/2 bg-slate-300 rounded-full mb-2"></div>
                                        <div className="flex gap-2 h-full">
                                            {t.id === 'modern' && <div className="w-1/4 h-full bg-slate-200 rounded"></div>}
                                            <div className="flex-1 flex flex-col gap-1">
                                                <div className="h-1 bg-slate-200 rounded-full"></div>
                                                <div className="h-1 bg-slate-200 rounded-full w-3/4"></div>
                                                <div className="h-1 bg-slate-200 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                    {template === t.id && (
                                        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5 shadow-sm">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 text-center py-0.5 text-[8px] font-bold uppercase bg-white/90 border-t border-slate-100">{t.label}</div>
                                </button>
                            ))}
                        </div>

                        {/* Color Theme Picker (Below Template) */}
                        <div className="flex items-center gap-4">
                            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2">Accent Color:</div>
                            <div className="flex items-center gap-4">
                                {[
                                    { name: 'teal', hex: 'hsl(168, 60%, 40%)' },
                                    { name: 'navy', hex: 'hsl(220, 60%, 35%)' },
                                    { name: 'burgundy', hex: 'hsl(345, 60%, 35%)' },
                                    { name: 'forest', hex: 'hsl(150, 50%, 30%)' },
                                    { name: 'charcoal', hex: 'hsl(0, 0%, 25%)' }
                                ].map(c => (
                                    <button
                                        key={c.name}
                                        onClick={() => setColor(c.name)}
                                        className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${color === c.name ? 'border-primary ring-2 ring-primary/20 scale-125 shadow-md' : 'border-transparent hover:scale-110'}`}
                                        style={{ backgroundColor: c.hex }}
                                        title={c.name}
                                    >
                                        {color === c.name && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full overflow-y-auto p-4 md:p-8 flex justify-center">
                    <div className="w-[210mm] min-h-[297mm] bg-white shadow-lg origin-top scale-[0.5] sm:scale-[0.6] md:scale-[0.7] lg:scale-[0.8] xl:scale-85 transition-transform">
                        <Preview data={data} template={template} color={color} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Builder;

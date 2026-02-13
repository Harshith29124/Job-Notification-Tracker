import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer
} from 'recharts';
import {
    Calendar,
    ChevronRight,
    BookOpen,
    CheckCircle2,
    History
} from 'lucide-react';

const skillData = [
    { subject: 'DSA', value: 75 },
    { subject: 'System Design', value: 60 },
    { subject: 'Communication', value: 80 },
    { subject: 'Resume', value: 85 },
    { subject: 'Aptitude', value: 70 },
];

const goals = [
    { day: 'Mon', active: true },
    { day: 'Tue', active: true },
    { day: 'Wed', active: false },
    { day: 'Thu', active: true },
    { day: 'Fri', active: true },
    { day: 'Sat', active: false },
    { day: 'Sun', active: false },
];

const assessments = [
    { title: "DSA Mock Test", time: "Tomorrow, 10:00 AM" },
    { title: "System Design Review", time: "Wed, 2:00 PM" },
    { title: "HR Interview Prep", time: "Friday, 11:00 AM" },
];

export default function Dashboard() {
    return (
        <div className="space-y-8">
            {/* Main Grid */}
            <div className="grid grid-cols-1 gap-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Readiness Highlight */}
                    <Card title="Overall Readiness">
                        <div className="flex flex-col items-center justify-center py-6">
                            <div className="text-[64px] font-serif font-black text-accent leading-none">72</div>
                            <div className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Current Stability Score</div>
                            <p className="mt-6 text-slate-500 text-center text-sm font-medium italic">"Your profile demonstrates strong CS fundamentals with minor gaps in System Design."</p>
                        </div>
                    </Card>

                    {/* Skill Breakdown Radar Chart */}
                    <Card title="Skill Breakdown">
                        <div className="h-[280px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                    <PolarGrid stroke="#D4D2CC" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#111111', fontSize: 11, fontWeight: 700 }} />
                                    <Radar
                                        name="Skills"
                                        dataKey="value"
                                        stroke="#8B0000"
                                        fill="#8B0000"
                                        fillOpacity={0.1}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Practice and Goals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card title="Continue Practice">
                        <div className="flex items-start gap-6">
                            <div className="bg-background p-4 rounded border border-border">
                                <BookOpen size={24} className="text-accent" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-[18px] font-bold text-text-primary mb-1">Dynamic Programming</h3>
                                <p className="text-slate-500 text-sm mb-4">Mastering optimal substructure and memoization.</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                        <span className="text-slate-400">Step 3 of 10</span>
                                        <span className="text-accent">30% Complete</span>
                                    </div>
                                    <div className="w-full bg-background rounded-none h-1.5 border border-border">
                                        <div className="bg-accent h-full transition-all duration-500" style={{ width: '30%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Weekly Goals">
                        <div className="space-y-6">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Consistency Metric</p>
                                    <h3 className="text-[24px] font-serif font-black text-text-primary">12/20 Problems</h3>
                                </div>
                                <div className="text-[11px] font-black text-success uppercase tracking-widest border border-success/20 px-2 py-1 rounded">
                                    On Track
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-background p-4 border border-border">
                                {goals.map((g) => (
                                    <div key={g.day} className="flex flex-col items-center gap-2">
                                        <div className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${g.active ? 'bg-success text-white border-success' : 'bg-white border-border text-slate-300'}`}>
                                            {g.active ? <CheckCircle2 size={14} /> : <div className="w-1 h-1 rounded-full bg-slate-300"></div>}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${g.active ? 'text-text-primary' : 'text-slate-400'}`}>{g.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Upcoming Assessments */}
                <Card title="Upcoming Assessments">
                    <div className="divide-y divide-border">
                        {assessments.map((a, idx) => (
                            <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded bg-background border border-border flex items-center justify-center text-slate-400 group-hover:text-accent group-hover:border-accent/30 transition-all">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-primary text-[15px]">{a.title}</h4>
                                        <div className="flex items-center gap-2 text-slate-400 text-[12px] font-medium uppercase tracking-tight">
                                            <History size={12} />
                                            {a.time}
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-secondary !px-4 !py-2 !text-[12px]">Initialize</button>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>
        </div>
    );
}

function Card({ title, children }) {
    return (
        <div className="bg-white border border-border p-8 rounded shadow-none relative transition-all">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-5 bg-accent"></div>
                <h2 className="text-[18px] font-serif font-bold text-text-primary tracking-tight">{title}</h2>
            </div>
            {children}
        </div>
    );
}

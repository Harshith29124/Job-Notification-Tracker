import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer
} from 'recharts';
import {
    Calendar,
    ChevronRight,
    BookOpen,
    CheckCircle2,
    History,
    AlertCircle
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
    { title: "DSA Mock Test", time: "Tomorrow, 10:00 AM", color: "bg-indigo-500" },
    { title: "System Design Review", time: "Wed, 2:00 PM", color: "bg-purple-500" },
    { title: "HR Interview Prep", time: "Friday, 11:00 AM", color: "bg-pink-500" },
];

export default function Dashboard() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Readiness Dashboard</h1>
                <p className="text-slate-500 font-medium">Your preparation roadmap at a glance.</p>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Readiness Circular Highlight */}
                <Card title="Overall Readiness">
                    <div className="flex flex-col items-center justify-center py-6">
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full -rotate-90">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    className="stroke-slate-100 fill-none stroke-[12]"
                                />
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    style={{
                                        strokeDasharray: 553,
                                        strokeDashoffset: 553 - (72 / 100) * 553,
                                    }}
                                    className="stroke-primary fill-none stroke-[12] stroke-round transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black text-slate-900">72</span>
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Score</span>
                            </div>
                        </div>
                        <p className="mt-6 text-slate-600 font-semibold">Readiness Score</p>
                    </div>
                </Card>

                {/* Skill Breakdown Radar Chart */}
                <Card title="Skill Breakdown">
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                <Radar
                                    name="Skills"
                                    dataKey="value"
                                    stroke="hsl(245, 58%, 51%)"
                                    fill="hsl(245, 58%, 51%)"
                                    fillOpacity={0.6}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Practice and Goals Row */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Continue Practice */}
                    <Card title="Continue Practice">
                        <div className="flex items-center gap-6">
                            <div className="bg-primary/10 p-4 rounded-3xl">
                                <BookOpen size={32} className="text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900">Dynamic Programming</h3>
                                <p className="text-slate-500 text-sm mb-4">Mastering optimal substructure and memoization.</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-slate-600">Progress</span>
                                        <span className="text-primary">3/10 Completed</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: '30%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <button className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-slate-800 transition-colors">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </Card>

                    {/* Weekly Goals */}
                    <Card title="Weekly Goals">
                        <div className="space-y-6">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Consistency</p>
                                    <h3 className="text-2xl font-black text-slate-900">12/20 Problems</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-emerald-500 uppercase tracking-wider">On Track</p>
                                </div>
                            </div>

                            <div className="w-full bg-slate-100 rounded-full h-3">
                                <div className="bg-emerald-500 h-3 rounded-full transition-all duration-700" style={{ width: '60%' }}></div>
                            </div>

                            <div className="flex justify-between items-center">
                                {goals.map((g) => (
                                    <div key={g.day} className="flex flex-col items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${g.active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-110' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {g.active ? <CheckCircle2 size={16} /> : <div className="w-1 h-1 rounded-full bg-slate-300"></div>}
                                        </div>
                                        <span className={`text-xs font-bold ${g.active ? 'text-slate-900' : 'text-slate-400'}`}>{g.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Upcoming Assessments List */}
                <Card title="Upcoming Assessments">
                    <div className="space-y-4">
                        {assessments.map((a, idx) => (
                            <div key={idx} className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl ${a.color} flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110`}>
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{a.title}</h4>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                            <History size={14} />
                                            {a.time}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-2 rounded-xl text-slate-300 group-hover:text-primary border border-slate-100 group-hover:border-primary/20 shadow-sm transition-all">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-4 text-slate-500 font-bold hover:text-primary hover:bg-slate-50 rounded-2xl transition-all flex items-center justify-center gap-2 mt-4 text-sm uppercase tracking-widest border border-dashed border-slate-200">
                            View Full Schedule
                        </button>
                    </div>
                </Card>

            </div>
        </div>
    );
}

function Card({ title, children }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                {title}
            </h2>
            {children}
        </div>
    );
}

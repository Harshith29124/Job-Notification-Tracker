import { useNavigate } from 'react-router-dom';
import { Target, Zap, Clock, TrendingUp, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const data = [
    { subject: 'Algorithms', A: 120, fullMark: 150 },
    { subject: 'System Design', A: 98, fullMark: 150 },
    { subject: 'Data Structures', A: 86, fullMark: 150 },
    { subject: 'Database', A: 99, fullMark: 150 },
    { subject: 'Frontend', A: 85, fullMark: 150 },
    { subject: 'Backend', A: 65, fullMark: 150 },
];

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="space-y-12 animate-platinum">
            {/* Real-time Telemetry Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard icon={<Target size={20} />} label="Ready Score" value="84%" sub="Elite Tier" color="text-accent" />
                <MetricCard icon={<Clock size={20} />} label="Prep Streak" value="12 Days" sub="Active" color="text-success" />
                <MetricCard icon={<Zap size={20} />} label="Tasks Done" value="38 / 45" sub="Next: Mock Round" color="text-blue-500" />
                <MetricCard icon={<TrendingUp size={20} />} label="Market Index" value="High" sub="8 Opportunities Found" color="text-orange-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Visual Mastery Matrix */}
                <div className="lg:col-span-2 card-premium !p-12 overflow-hidden relative">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-2">
                                <Activity size={12} /> Live Skill Matrix
                            </div>
                            <h2 className="heading-md uppercase">Technical Stability</h2>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => navigate('/practice')} className="btn btn-secondary !py-2.5 !px-6 text-[11px] font-black">Practice Terminal</button>
                        </div>
                    </div>

                    <div className="h-[450px] w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                                <PolarGrid stroke="#e2e8f0" strokeWidth={1} />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 13, fontWeight: 800, textTransform: 'uppercase' }} />
                                <Radar
                                    name="Skills"
                                    dataKey="A"
                                    stroke="var(--color-accent)"
                                    fill="var(--color-accent)"
                                    fillOpacity={0.15}
                                    strokeWidth={4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <TrendingUp size={160} className="text-accent" />
                    </div>
                </div>

                {/* Intelligence Feed */}
                <div className="space-y-10">
                    <div className="card-premium !bg-text-primary text-white border-none shadow-2xl shadow-accent/20">
                        <h3 className="text-xl font-serif font-black mb-8 border-b border-white/10 pb-4">Daily Precision Tasks</h3>
                        <div className="space-y-6">
                            <TaskItem title="Advanced DSA Round" time="60m" status="pending" />
                            <TaskItem title="React Performance Audit" time="45m" status="completed" />
                            <TaskItem title="System Design: Sharding" time="90m" status="pending" />
                        </div>
                        <button onClick={() => navigate('/practice')} className="btn btn-primary !bg-accent !border-accent w-full mt-10 h-16 rounded-none">Start Session</button>
                    </div>

                    <div className="card-premium !p-8 border-dashed">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-accent/5 rounded-none flex items-center justify-center text-accent">
                                <Sparkles size={20} />
                            </div>
                            <h4 className="text-[14px] font-black uppercase tracking-widest">Heuristic Tip</h4>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                            "Recruiters at elite startups look for 'Product Mindset' even in backend roles. Frame your challenges around user impact."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon, label, value, sub, color }) {
    return (
        <div className="card-premium !p-8 group hover:-translate-y-2 transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className={`w-12 h-12 bg-background border border-border flex items-center justify-center ${color} group-hover:bg-text-primary group-hover:text-white transition-all duration-500`}>
                    {icon}
                </div>
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
            </div>
            <div className="text-4xl font-serif font-black text-text-primary group-hover:text-accent transition-colors">{value}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-2">{sub}</div>
        </div>
    );
}

function TaskItem({ title, time, status }) {
    return (
        <div className="flex items-center justify-between group cursor-pointer hover:translate-x-2 transition-transform">
            <div className="flex items-center gap-5">
                <div className={`w-2 h-2 rounded-none rotate-45 ${status === 'completed' ? 'bg-success' : 'bg-white/20'}`}></div>
                <div>
                    <div className={`text-[15px] font-bold ${status === 'completed' ? 'opacity-40 line-through' : ''}`}>{title}</div>
                    <div className="text-[10px] font-black opacity-40 uppercase tracking-widest">{time} Allocation</div>
                </div>
            </div>
            <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}

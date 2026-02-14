import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Braces, Terminal, Brain, Search, Layout, ChevronRight } from 'lucide-react';

const categories = [
    {
        id: 'dsa',
        title: 'Data Structures',
        icon: <Braces size={20} />,
        count: 142,
        progress: 45,
        topics: ['Linked Lists', 'Trees', 'Graphs', 'Hash Maps']
    },
    {
        id: 'algo',
        title: 'Algorithms',
        icon: <Code2 size={20} />,
        count: 98,
        progress: 20,
        topics: ['Dynamic Programming', 'Greedy', 'Sliding Window']
    },
    {
        id: 'sys',
        title: 'System Design',
        icon: <Layout size={20} />,
        count: 35,
        progress: 10,
        topics: ['Scalability', 'Load Balancing', 'Database Sharding']
    },
    {
        id: 'db',
        title: 'Databases',
        icon: <Terminal size={20} />,
        count: 64,
        progress: 60,
        topics: ['SQL Optimization', 'NoSQL Patterns', 'Indexing']
    },
];

export default function Practice() {
    const navigate = useNavigate();

    useEffect(() => {
        const progress = JSON.parse(localStorage.getItem('prp_steps_progress') || '{}');
        progress[2] = true;
        localStorage.setItem('prp_steps_progress', JSON.stringify(progress));
    }, []);

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-border pb-8 gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                        Skill Simulation Lab
                    </div>
                    <h2 className="heading-md uppercase">Practice Terminal</h2>
                    <p className="text-slate-500 font-medium text-sm md:text-base">Targeted skill simulations for high-stakes recruitment rounds.</p>
                </div>
                <div className="relative w-full lg:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search simulations..."
                        className="input-field !pl-12 !py-2.5 text-xs font-black uppercase tracking-widest"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                {categories.map((cat) => (
                    <div key={cat.id} className="card-premium group cursor-pointer hover:border-accent transition-all duration-500">
                        <div className="flex items-start justify-between mb-8">
                            <div className="w-14 h-14 bg-background border border-border flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                                {cat.icon}
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{cat.count} Artifacts</span>
                                <div className="text-xl font-serif font-black text-text-primary mt-1">{cat.progress}% Mastery</div>
                            </div>
                        </div>

                        <h3 className="text-xl font-serif font-black text-text-primary mb-2 group-hover:text-accent transition-colors">{cat.title}</h3>
                        <p className="text-slate-500 text-[13px] mb-8 font-medium italic">Protocol focus: {cat.topics.join(', ')}</p>

                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>Stability</span>
                                <span>{cat.progress}%</span>
                            </div>
                            <div className="w-full bg-background h-1.5 border border-border">
                                <div className="bg-accent h-full transition-all duration-1000 ease-[var(--ease-out-expo)]" style={{ width: `${cat.progress}%` }}></div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/assessments')}
                            className="btn btn-secondary w-full mt-10 uppercase tracking-[0.2em] text-[10px] md:text-[11px] font-black flex items-center justify-center gap-2 group-hover:bg-text-primary group-hover:text-white group-hover:border-text-primary transition-all duration-500"
                        >
                            Initialize Module <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-accent/5 border border-accent/20 p-8 md:p-12 flex flex-col xl:flex-row items-center gap-10">
                <div className="w-20 h-20 bg-white border border-accent/20 flex items-center justify-center text-accent shrink-0">
                    <Brain size={36} />
                </div>
                <div className="flex-1 text-center xl:text-left">
                    <h4 className="text-xl font-serif font-black text-text-primary mb-2 uppercase tracking-tight">Active Recruitment Protocol</h4>
                    <p className="text-slate-600 text-[15px] font-medium leading-relaxed max-w-2xl">Your weekly high-fidelity mock simulation is scheduled for Saturday at 10:00 AM. 100% attendance is mandatory for readiness certification.</p>
                </div>
                <button
                    onClick={() => alert('Recruitment Protocol Verified. Slot confirmed for Saturday.')}
                    className="btn btn-primary px-12 h-[60px] md:h-[64px] min-w-full xl:min-w-[240px]"
                >
                    Confirm Slot
                </button>
            </div>
        </div>
    );
}

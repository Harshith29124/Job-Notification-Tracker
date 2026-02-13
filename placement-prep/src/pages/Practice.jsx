import { Code2, Braces, Terminal, Brain, Search, Layout } from 'lucide-react';

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
    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                    <h2 className="heading-md uppercase">Practice Lab</h2>
                    <p className="text-slate-500 font-medium text-sm">Targeted skill simulations for high-stakes interviews.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search challenges..."
                        className="input-field !pl-12 !py-2 w-64 text-sm font-bold"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categories.map((cat) => (
                    <div key={cat.id} className="card-premium group hover:border-accent/40 transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-8">
                            <div className="w-12 h-12 bg-background border border-border flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                                {cat.icon}
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.count} Challenges</span>
                                <div className="text-[18px] font-black text-text-primary mt-1">{cat.progress}% Mastered</div>
                            </div>
                        </div>

                        <h3 className="text-[22px] font-serif font-bold text-text-primary mb-2">{cat.title}</h3>
                        <p className="text-slate-500 text-sm mb-6 font-medium italic">Focus areas: {cat.topics.join(', ')}</p>

                        <div className="space-y-2">
                            <div className="w-full bg-background h-1.5 border border-border">
                                <div className="bg-accent h-full transition-all duration-700" style={{ width: `${cat.progress}%` }}></div>
                            </div>
                        </div>

                        <button className="btn btn-secondary w-full mt-8 uppercase tracking-widest text-[11px]">Initialize Module</button>
                    </div>
                ))}
            </div>

            <div className="bg-accent/5 border border-accent/20 p-8 rounded flex items-center gap-8">
                <div className="w-16 h-16 bg-white border border-accent/20 flex items-center justify-center text-accent">
                    <Brain size={32} />
                </div>
                <div className="flex-1">
                    <h4 className="text-[18px] font-serif font-black text-text-primary mb-1">Weekly Mock Simulation</h4>
                    <p className="text-slate-600 text-[14px] font-medium">Your next clinical mock interview session is scheduled for Saturday at 10:00 AM.</p>
                </div>
                <button className="btn btn-primary px-8">Confirm Slot</button>
            </div>
        </div>
    );
}

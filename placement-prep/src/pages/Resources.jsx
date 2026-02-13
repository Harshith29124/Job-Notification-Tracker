import { useEffect } from 'react';
import { BookOpen, FileText, ExternalLink, Video, Download, Search } from 'lucide-react';

const libraries = [
    {
        category: "Conceptual Notes",
        items: [
            { title: "Advanced React Patterns", type: "PDF", size: "2.4 MB", icon: <FileText size={16} /> },
            { title: "System Design Blueprints", type: "PDF", size: "4.1 MB", icon: <FileText size={16} /> },
            { title: "Low-Level Design Guide", type: "PDF", size: "1.8 MB", icon: <FileText size={16} /> },
        ]
    },
    {
        category: "Case Studies",
        items: [
            { title: "Google SDE Interview Exp", type: "Article", size: "12 min read", icon: <ExternalLink size={16} /> },
            { title: "Stripe System Design Round", type: "Article", size: "8 min read", icon: <ExternalLink size={16} /> },
            { title: "Netflix Scalability Breakdown", type: "Video", size: "24 min", icon: <Video size={16} /> },
        ]
    }
];

export default function Resources() {
    useEffect(() => {
        const progress = JSON.parse(localStorage.getItem('prp_steps_progress') || '{}');
        progress[5] = true;
        localStorage.setItem('prp_steps_progress', JSON.stringify(progress));
    }, []);

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                    <h2 className="heading-md uppercase">Knowledge Base</h2>
                    <p className="text-slate-500 font-medium text-sm">Curated technical intelligence for strategic preparation.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="input-field !pl-12 !py-2 w-64 text-sm font-bold"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {libraries.map((lib, idx) => (
                    <div key={idx} className="space-y-6">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-border pb-2 flex items-center gap-2">
                            <BookOpen size={14} /> {lib.category}
                        </h3>
                        <div className="space-y-4">
                            {lib.items.map((item, iidx) => (
                                <div key={iidx} className="card-premium !p-6 flex items-center justify-between group hover:border-accent/40 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-background border border-border flex items-center justify-center text-slate-400 group-hover:text-accent group-hover:border-accent/20 transition-all">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text-primary text-[15px] group-hover:text-accent transition-colors">{item.title}</h4>
                                            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-tighter mt-1">
                                                <span>{item.type}</span>
                                                <span className="w-1 h-1 bg-border rounded-full"></span>
                                                <span>{item.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-slate-200 group-hover:text-accent transition-all">
                                        <Download size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="card-premium !bg-background flex flex-col items-center py-20 text-center space-y-6 border-dashed border-2">
                <div className="w-20 h-20 bg-white border border-border flex items-center justify-center text-slate-300">
                    <BookOpen size={40} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-[24px] font-serif font-black text-text-primary">Contribution Protocol</h3>
                    <p className="body-text text-sm mx-auto">Share your localized interview experience with the KodNest intelligence network.</p>
                </div>
                <button className="btn btn-primary px-12 h-[56px] uppercase tracking-widest text-[12px]">Submit Intelligence Payload</button>
            </div>
        </div>
    );
}

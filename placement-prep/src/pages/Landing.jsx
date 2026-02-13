import { Link } from 'react-router-dom';
import { Code2, Video, BarChart3, ChevronRight } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-primary p-2 rounded-xl">
                        <div className="w-5 h-5 bg-white rounded-md"></div>
                    </div>
                    <span className="font-black text-2xl text-technical-slate tracking-tighter uppercase">Placement Prep</span>
                </div>
                <div className="flex items-center gap-10">
                    <Link to="/" className="text-slate-500 hover:text-primary font-bold text-sm uppercase tracking-widest transition-colors">About</Link>
                    <Link to="/" className="text-slate-500 hover:text-primary font-bold text-sm uppercase tracking-widest transition-colors">Contact</Link>
                    <Link to="/dashboard" className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">
                        Sign In
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-28 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-[120px] -z-10 group-hover:scale-110 transition-transform duration-1000"></div>

                <div className="inline-block bg-bone border border-technical-border px-4 py-2 rounded-full mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Intelligence-Driven Prep</span>
                </div>

                <h1 className="text-7xl font-black text-technical-slate tracking-tighter mb-8 leading-[0.9]">
                    Ace Your <span className="text-primary italic">Placement</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                    Practice, assess, and prepare for your dream job with our clinical recruitment roadmap and technical diagnostic suite.
                </p>
                <div className="flex items-center justify-center gap-6">
                    <Link
                        to="/dashboard"
                        className="group bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-primary/30 flex items-center gap-3"
                    >
                        Get Started
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button className="bg-white text-technical-slate border-2 border-technical-border px-10 py-5 rounded-2xl font-black text-lg hover:bg-bone transition-all flex items-center gap-3">
                        Watch Demo
                    </button>
                </div>
            </section>

            {/* Features Grid */}
            <section className="bg-bone py-32 border-y border-technical-border">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <FeatureCard
                            icon={<Code2 className="text-primary" size={32} />}
                            title="Practice Problems"
                            description="Solve 500+ coding problems curated from high-stakes tech company interviews."
                        />
                        <FeatureCard
                            icon={<Video className="text-primary" size={32} />}
                            title="Mock Interviews"
                            description="Realistic video interview simulations with authoritative AI feedback protocols."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="text-primary" size={32} />}
                            title="Track Progress"
                            description="Detailed analytics and diagnostic charts to measure your growth in real-time."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 border-t border-bone bg-white">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-slate-400 font-bold uppercase tracking-widest text-xs">
                    <p>&copy; {new Date().getFullYear()} Placement Readiness Platform.</p>
                    <div className="flex gap-10">
                        <Link to="/" className="hover:text-primary">Policy</Link>
                        <Link to="/" className="hover:text-primary">Security</Link>
                        <Link to="/" className="hover:text-primary">Status</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white p-12 rounded-[2.5rem] border border-technical-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">{icon}</div>
            <div className="bg-bone w-20 h-20 rounded-3xl flex items-center justify-center mb-8 border border-technical-border group-hover:bg-primary group-hover:border-primary transition-all">
                <div className="group-hover:text-white transition-colors">{icon}</div>
            </div>
            <h3 className="text-3xl font-black text-technical-slate mb-4 tracking-tight">{title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium">{description}</p>
        </div>
    );
}

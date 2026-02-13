import { Link } from 'react-router-dom';
import { Code2, Video, BarChart3, ChevronRight, Target, Brain, Shield } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-background text-text-primary selection:bg-accent/10">
            {/* Header */}
            <nav className="h-[80px] bg-white border-b border-border px-6 md:px-10 flex items-center justify-between sticky top-0 z-[100]">
                <div className="flex items-center gap-3">
                    <div className="bg-accent p-2 rounded">
                        <div className="w-5 h-5 bg-white rounded-sm"></div>
                    </div>
                    <span className="font-serif font-black text-2xl tracking-tight uppercase">Placement Prep</span>
                </div>
                <div className="hidden md:flex items-center gap-10">
                    <Link to="/dashboard" className="text-slate-500 hover:text-accent font-bold text-[12px] uppercase tracking-[0.2em] transition-colors">Sign In</Link>
                    <Link to="/dashboard" className="btn btn-primary !py-2.5 !px-8 text-[12px] uppercase tracking-widest leading-none">
                        Join Platform
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-24 md:py-40 text-center relative overflow-hidden">
                <div className="inline-block bg-white border border-border px-5 py-2.5 rounded mb-12">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">Career Intelligence Suite</span>
                </div>

                <h1 className="text-[48px] md:text-[84px] font-serif font-black text-text-primary tracking-tighter mb-8 leading-[1] max-w-5xl mx-auto">
                    Strategic Readiness for <span className="text-accent italic">Exceptional</span> Candidates.
                </h1>
                <p className="max-w-[720px] mx-auto mb-16 text-[18px] md:text-[22px] font-medium text-slate-500 leading-relaxed">
                    Master high-stakes recruitment through clinical job description analysis and automated preparation roadmaps.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <Link
                        to="/dashboard"
                        className="btn btn-primary !px-12 !py-6 !text-[16px] uppercase tracking-widest w-full md:w-auto"
                    >
                        Initialize Onboarding
                    </Link>
                    <button className="btn btn-secondary !px-12 !py-6 !text-[16px] uppercase tracking-widest w-full md:w-auto">
                        Watch Protocol
                    </button>
                </div>
            </section>

            {/* Features Audit Grid */}
            <section className="bg-white py-32 border-y border-border">
                <div className="max-w-[1440px] mx-auto px-6 md:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <FeatureCard
                            icon={<Target className="text-accent" size={28} />}
                            title="Requirement Extraction"
                            description="Automatically map JD payloads to technical domains and required skill sets with zero noise."
                        />
                        <FeatureCard
                            icon={<Brain className="text-accent" size={28} />}
                            title="Round Simulation"
                            description="Understand specific recruitment round priorities and behavioral triggers before you step into the room."
                        />
                        <FeatureCard
                            icon={<Shield className="text-accent" size={28} />}
                            title="Progress Integrity"
                            description="Track your mastery across core placement dimensions with clinical audit-ready precision."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-background">
                <div className="max-w-[1440px] mx-auto px-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-border flex items-center justify-center text-white">
                            <span className="font-serif font-black">K</span>
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">
                            &copy; {new Date().getFullYear()} Placement Readiness Platform | KodNest Premium
                        </p>
                    </div>
                    <div className="flex gap-10 text-slate-400 font-bold uppercase tracking-widest text-[11px]">
                        <Link to="/" className="hover:text-accent transition-colors">Protocol</Link>
                        <Link to="/" className="hover:text-accent transition-colors">Security</Link>
                        <Link to="/" className="hover:text-accent transition-colors">Infrastructure</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-background border border-border p-12 rounded relative group hover:border-accent transition-all duration-300">
            <div className="bg-white w-14 h-14 rounded border border-border flex items-center justify-center mb-10 group-hover:border-accent/40 group-hover:bg-accent group-hover:text-white transition-all">
                {icon}
            </div>
            <h3 className="text-[26px] font-serif font-black text-text-primary mb-4 tracking-tight uppercase leading-none">{title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium text-[16px]">{description}</p>
        </div>
    );
}

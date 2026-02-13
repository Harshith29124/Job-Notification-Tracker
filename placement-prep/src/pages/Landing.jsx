import { Link } from 'react-router-dom';
import { Code2, Video, BarChart3, ChevronRight } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-background text-text-primary">
            {/* Header */}
            <nav className="h-[80px] bg-white border-b border-border px-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-accent p-2 rounded">
                        <div className="w-5 h-5 bg-white rounded-sm"></div>
                    </div>
                    <span className="font-serif font-black text-2xl tracking-tight uppercase">Placement Prep</span>
                </div>
                <div className="flex items-center gap-10">
                    <Link to="/dashboard" className="text-slate-500 hover:text-accent font-bold text-[12px] uppercase tracking-widest transition-colors">Sign In</Link>
                    <Link to="/dashboard" className="btn btn-primary !py-2 !px-8 text-[12px] uppercase tracking-widest">
                        Join Platform
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="max-w-[1440px] mx-auto px-10 py-32 text-center relative overflow-hidden">
                <div className="inline-block bg-white border border-border px-4 py-2 rounded mb-10">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">Career Intelligence Suite</span>
                </div>

                <h1 className="text-[72px] font-serif font-black text-text-primary tracking-tighter mb-8 leading-[1.1] max-w-4xl mx-auto">
                    Strategic Readiness for <span className="text-accent italic">Exceptional</span> Candidates.
                </h1>
                <p className="body-text mx-auto mb-12 text-[20px] font-medium text-slate-500">
                    Master high-stakes recruitment through clinical job description analysis and automated preparation roadmaps.
                </p>
                <div className="flex items-center justify-center gap-6">
                    <Link
                        to="/dashboard"
                        className="btn btn-primary !px-10 !py-5 !text-[16px] uppercase tracking-widest"
                    >
                        Initialize Onboarding
                    </Link>
                    <button className="btn btn-secondary !px-10 !py-5 !text-[16px] uppercase tracking-widest">
                        Watch Protocol
                    </button>
                </div>
            </section>

            {/* Features */}
            <section className="bg-white py-32 border-y border-border">
                <div className="max-w-[1440px] mx-auto px-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <FeatureCard
                            icon={<Code2 className="text-accent" size={32} />}
                            title="Requirement Extraction"
                            description="Automatically map JD payloads to technical domains and required skill sets."
                        />
                        <FeatureCard
                            icon={<Video className="text-accent" size={32} />}
                            title="Round Simulation"
                            description="Understand specific recruitment round priorities before you step into the room."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="text-accent" size={32} />}
                            title="Progress Analytics"
                            description="Track your mastery across five core placement dimensions with clinical precision."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-background">
                <div className="max-w-[1440px] mx-auto px-10 flex flex-col md:flex-row items-center justify-between gap-8 text-slate-400 font-bold uppercase tracking-widest text-[11px]">
                    <p>&copy; {new Date().getFullYear()} Placement Readiness Platform | KodNest Premium</p>
                    <div className="flex gap-10">
                        <Link to="/" className="hover:text-accent">Protocol</Link>
                        <Link to="/" className="hover:text-accent">Security</Link>
                        <Link to="/" className="hover:text-accent">Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-background border border-border p-12 rounded relative group hover:border-accent/30 transition-all">
            <div className="bg-white w-16 h-16 rounded border border-border flex items-center justify-center mb-8">
                {icon}
            </div>
            <h3 className="text-[24px] font-serif font-black text-text-primary mb-4 tracking-tight uppercase leading-none">{title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium text-[15px]">{description}</p>
        </div>
    );
}

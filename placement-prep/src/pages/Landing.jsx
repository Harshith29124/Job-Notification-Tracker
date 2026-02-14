import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Target, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-text-primary selection:bg-accent selection:text-white">
            {/* Ultra-Premium Navigation */}
            <nav className="fixed top-0 left-0 right-0 h-24 bg-white/70 backdrop-blur-3xl border-b border-border z-50 flex items-center justify-between px-6 md:px-20 transition-all duration-500">
                <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-12 h-12 bg-text-primary text-white flex items-center justify-center font-black text-xl transition-all duration-500 group-hover:bg-accent group-hover:rotate-12">K</div>
                    <span className="font-serif font-black text-2xl tracking-tighter uppercase">KodNest <span className="text-accent">Prep</span></span>
                </div>
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary h-14 px-10 rounded-none shadow-2xl shadow-accent/20">
                    Enter Platform <ArrowRight size={18} className="ml-3" />
                </button>
            </nav>

            {/* Hero Domain */}
            <section className="pt-48 pb-32 px-6 md:px-20 max-w-7xl mx-auto">
                <div className="space-y-10 animate-platinum">
                    <div className="inline-flex items-center gap-3 bg-accent/5 border border-accent/20 px-6 py-2">
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Strategic Readiness Authorized</span>
                    </div>
                    <h1 className="heading-xl max-w-5xl">
                        Strategic Preparation for <span className="text-accent italic font-medium">Elite</span> Tech Roles.
                    </h1>
                    <p className="body-text max-w-2xl text-lg md:text-xl leading-relaxed">
                        High-fidelity skill verification, clinical interview simulations, and heuristic analysis pipelines designed for top 1% candidates.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 pt-10">
                        <button onClick={() => navigate('/dashboard')} className="btn btn-primary h-20 px-16 text-lg hover:scale-105 transition-transform">
                            Initialize Diagnostic
                        </button>
                        <button className="btn btn-secondary h-20 px-16 text-lg group">
                            Technical Whitepaper <Zap size={18} className="ml-3 group-hover:text-accent transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Audit Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-48">
                    <FeatureCard
                        icon={<Target className="text-accent" size={32} />}
                        title="Skill Stability"
                        desc="Deterministic verification of core technical domain mastery through clinical assessments."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="text-success" size={32} />}
                        title="Audit Trails"
                        desc="Comprehensive integrity reports for every simulation round, validated by KodNest Intelligence."
                    />
                    <FeatureCard
                        icon={<Sparkles className="text-blue-500" size={32} />}
                        title="AI Feedback"
                        desc="Heuristic evaluation of behavioral cues and technical depth using advanced semantic models."
                    />
                </div>
            </section>

            {/* Trust Engine */}
            <section className="py-32 border-t border-border bg-white mt-20">
                <div className="max-w-7xl mx-auto px-6 md:px-20 text-center space-y-12">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Integrated Ecosystem Partners</span>
                    <div className="flex flex-wrap justify-center gap-x-20 gap-y-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
                        <div className="font-serif font-black text-3xl italic">Google</div>
                        <div className="font-serif font-black text-3xl italic">Stripe</div>
                        <div className="font-serif font-black text-3xl italic">Meta</div>
                        <div className="font-serif font-black text-3xl italic">Amazon</div>
                        <div className="font-serif font-black text-3xl italic">Netflix</div>
                    </div>
                </div>
            </section>

            {/* Deep Footer */}
            <footer className="py-20 border-t border-border bg-background">
                <div className="max-w-7xl mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-20">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-text-primary text-white flex items-center justify-center font-black">K</div>
                            <span className="font-serif font-black text-xl uppercase italic">KodNest Prep</span>
                        </div>
                        <p className="text-sm text-slate-500 max-w-sm font-medium">Empowering the next generation of engineers through clinical preparation and strategic intelligence.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-primary">Ecosystem</h4>
                            <ul className="space-y-2 text-sm text-slate-500 font-bold">
                                <li>Market Tracking</li>
                                <li>AI Resume</li>
                                <li>Prep Hub</li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-primary">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-500 font-bold">
                                <li>Integrity Audit</li>
                                <li>Privacy</li>
                                <li>Security</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="card-premium group hover:-translate-y-4 transition-all duration-700">
            <div className="w-16 h-16 bg-background border border-border flex items-center justify-center mb-10 transition-all duration-700 group-hover:bg-text-primary group-hover:text-white">
                {icon}
            </div>
            <h3 className="text-2xl font-serif font-black mb-4 group-hover:text-accent transition-colors">{title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
        </div>
    );
}

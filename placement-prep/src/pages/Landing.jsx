import { Link } from 'react-router-dom';
import { Code2, Video, BarChart3, ChevronRight } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-1.5 rounded-lg">
                        <div className="w-5 h-5 bg-white rounded-sm"></div>
                    </div>
                    <span className="font-bold text-xl text-slate-900 tracking-tight">Placement Prep</span>
                </div>
                <div className="flex items-center gap-8">
                    <Link to="/" className="text-slate-600 hover:text-primary font-medium">About</Link>
                    <Link to="/" className="text-slate-600 hover:text-primary font-medium">Contact</Link>
                    <Link to="/dashboard" className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                        Sign In
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-24 text-center">
                <h1 className="text-6xl font-black text-slate-900 tracking-tight mb-6">
                    Ace Your <span className="text-primary">Placement</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Practice, assess, and prepare for your dream job with our comprehensive placement readiness platform.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Link
                        to="/dashboard"
                        className="group bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 flex items-center gap-2"
                    >
                        Get Started
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button className="bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                        Watch Demo
                    </button>
                </div>
            </section>

            {/* Features Grid */}
            <section className="bg-slate-50 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Code2 className="text-primary" size={32} />}
                            title="Practice Problems"
                            description="Solve 500+ coding problems from top tech company interviews."
                        />
                        <FeatureCard
                            icon={<Video className="text-primary" size={32} />}
                            title="Mock Interviews"
                            description="Realistic video interview simulations with AI feedback."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="text-primary" size={32} />}
                            title="Track Progress"
                            description="Detailed analytics and charts to measure your growth."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 font-medium">
                    <p>&copy; {new Date().getFullYear()} Placement Readiness Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-500 leading-relaxed">{description}</p>
        </div>
    );
}

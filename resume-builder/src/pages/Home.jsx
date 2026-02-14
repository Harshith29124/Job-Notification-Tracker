import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
                    Build a Resume That <span className="text-primary italic">Gets Read.</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
                    Create a professional, ATS-optimized resume in minutes with our AI-powered builder. Clean, minimalist, and designed for top-tier tech roles.
                </p>
                <button
                    onClick={() => navigate('/builder')}
                    className="bg-primary text-primary-foreground text-sm font-semibold px-8 py-3 rounded-md hover:bg-primary/90 transition-all shadow-sm active:scale-95"
                >
                    Start Building
                </button>

                <div className="mt-12 grid grid-cols-3 gap-8 text-sm text-muted-foreground opacity-60">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>ATS Friendly</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>Premium Layouts</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span>Instant Export</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

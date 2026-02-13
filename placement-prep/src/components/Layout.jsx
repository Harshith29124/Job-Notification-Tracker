import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Code2,
    ClipboardCheck,
    History,
    BookOpen,
    UserCircle,
    Menu,
    X,
    Home,
    ShieldCheck,
    Truck
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Practice', path: '/practice', icon: Code2 },
    { name: 'Analyze JD', path: '/assessments', icon: ClipboardCheck },
    { name: 'Archive', path: '/history', icon: History },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Profile', path: '/profile', icon: UserCircle },
    { name: 'Test Center', path: '/test-checklist', icon: ShieldCheck },
    { name: 'Verify Ship', path: '/shipping-verification', icon: Truck },
];

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    return (
        <div className="flex h-screen bg-bone">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-technical-border transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-72' : 'w-24'}`}>
                <div className="h-24 flex items-center px-8 flex-shrink-0">
                    <div className="bg-primary p-2.5 rounded-2xl mr-3 shadow-lg shadow-primary/10">
                        <div className="w-5 h-5 bg-white rounded-md"></div>
                    </div>
                    {isSidebarOpen && <span className="font-black text-2xl text-technical-slate tracking-tight">Placement Prep</span>}
                </div>

                <nav className="mt-4 px-4 space-y-2 flex-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.path === '/assessments' && location.pathname === '/results');

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center p-4 rounded-2xl transition-all duration-300 ${isActive
                                    ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]'
                                    : 'text-slate-500 hover:bg-bone hover:text-primary font-bold'
                                    }`}
                            >
                                <div className={`${isSidebarOpen ? 'mr-4' : 'mx-auto'}`}>
                                    <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                {isSidebarOpen && <span className="font-bold tracking-tight">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 space-y-4 flex-shrink-0">
                    {isSidebarOpen && (
                        <div className="p-6 bg-technical-slate rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group/pro">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/pro:scale-110 transition-transform">
                                <History size={40} />
                            </div>
                            <h5 className="font-black text-xs mb-1 uppercase tracking-[0.2em] text-primary">Pro Status</h5>
                            <p className="text-[10px] text-slate-400 font-bold leading-relaxed mb-4">Unlimited JD analyses and mock sessions enabled.</p>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-3/4"></div>
                            </div>
                        </div>
                    )}

                    <a
                        href="../index.html"
                        className={`flex items-center p-4 rounded-2xl transition-all group ${isSidebarOpen ? 'bg-bone border border-technical-border hover:border-slate-300' : ''
                            }`}
                    >
                        <div className={`${isSidebarOpen ? 'mr-4' : 'mx-auto'}`}>
                            <Home size={20} className="text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                        {isSidebarOpen && <span className="font-bold text-slate-500 group-hover:text-primary transition-colors text-sm">Return to Hub</span>}
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-technical-border flex items-center justify-between px-10 sticky top-0 z-50">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-3 hover:bg-bone rounded-2xl text-slate-400 transition-colors border border-transparent hover:border-technical-border"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-technical-slate">Harshith</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest underline decoration-primary decoration-2 underline-offset-4">Candidate</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white border-2 border-bone-darker shadow-sm flex items-center justify-center text-primary font-black text-lg overflow-hidden group cursor-pointer hover:border-primary/20 transition-all">
                            H
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-10 bg-bone">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

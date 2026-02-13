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
    Home
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Practice', path: '/practice', icon: Code2 },
    { name: 'Analyze JD', path: '/assessments', icon: ClipboardCheck },
    { name: 'Archive', path: '/history', icon: History },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Profile', path: '/profile', icon: UserCircle },
];

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-slate-200 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-24'}`}>
                <div className="h-20 flex items-center px-8 border-bottom">
                    <div className="bg-primary p-2 rounded-xl mr-3 shadow-lg shadow-primary/20">
                        <div className="w-5 h-5 bg-white rounded-sm"></div>
                    </div>
                    {isSidebarOpen && <span className="font-black text-xl text-slate-900 tracking-tight">Placement Prep</span>}
                </div>

                <nav className="mt-6 px-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.path === '/assessments' && location.pathname === '/results');

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center p-4 rounded-2xl transition-all duration-300 ${isActive
                                    ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-primary font-bold'
                                    }`}
                            >
                                <div className={`${isSidebarOpen ? 'mr-4' : 'mx-auto'}`}>
                                    <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                {isSidebarOpen && <span className="font-bold tracking-tight">{item.name}</span>}
                            </Link>
                        );
                    })}

                    <a
                        href="../index.html"
                        className="flex items-center p-4 rounded-2xl transition-all duration-300 text-slate-400 hover:bg-slate-50 hover:text-slate-900 font-bold border-t border-slate-50 mt-4 pt-6"
                    >
                        <div className={`${isSidebarOpen ? 'mr-4' : 'mx-auto'}`}>
                            <Home size={20} />
                        </div>
                        {isSidebarOpen && <span className="font-bold tracking-tight">Return to Hub</span>}
                    </a>
                </nav>

                {isSidebarOpen && (
                    <div className="absolute bottom-10 left-8 right-8 p-6 bg-slate-900 rounded-[2rem] text-white">
                        <h5 className="font-black text-sm mb-1 uppercase tracking-widest text-primary">Pro Status</h5>
                        <p className="text-[10px] text-slate-400 font-bold leading-relaxed mb-4">Unlimited JD analyses and mock sessions enabled.</p>
                        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-3/4"></div>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-50">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors border border-transparent hover:border-slate-100"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-slate-900">Harshith</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest underline decoration-primary decoration-2 underline-offset-4">Candidate</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-primary font-black text-lg overflow-hidden group cursor-pointer hover:border-primary/20 transition-all">
                            H
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-10 bg-[#fbfbfb]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Code2,
    ClipboardCheck,
    BookOpen,
    UserCircle,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Practice', path: '/practice', icon: Code2 },
    { name: 'Assessments', path: '/assessments', icon: ClipboardCheck },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Profile', path: '/profile', icon: UserCircle },
];

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-slate-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="h-16 flex items-center px-6 border-bottom">
                    <div className="bg-primary p-1.5 rounded-lg mr-3">
                        <div className="w-5 h-5 bg-white rounded-sm"></div>
                    </div>
                    {isSidebarOpen && <span className="font-bold text-xl text-slate-800 tracking-tight">Placement Prep</span>}
                </div>

                <nav className="mt-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center p-3 rounded-xl transition-colors ${isActive
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'text-slate-600 hover:bg-primary/5 hover:text-primary'
                                    }`}
                            >
                                <Icon size={20} className={isSidebarOpen ? 'mr-3' : ''} />
                                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-800">John Doe</p>
                            <p className="text-xs text-slate-500">Student</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-500 font-bold">
                            JD
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

import { useNavigate } from 'react-router-dom';
import { Truck, Lock, ShieldCheck, ArrowLeft, Github, Globe } from 'lucide-react';

export default function ShipReady() {
    const navigate = useNavigate();

    // Check checklist status
    const saved = localStorage.getItem('prp_test_checklist');
    const checkedItems = saved ? JSON.parse(saved) : {};
    const passedCount = Object.values(checkedItems).filter(Boolean).length;
    const TOTAL_TESTS = 10;
    const isLocked = passedCount < TOTAL_TESTS;

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 py-10 text-center">
            {isLocked ? (
                <div className="space-y-8 py-20">
                    <div className="relative inline-block">
                        <div className="bg-amber-100 p-8 rounded-full text-amber-600 animate-bounce">
                            <Lock size={64} />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full border-4 border-white">
                            <ShieldCheck size={24} />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Deployment Locked</h1>
                        <p className="text-slate-500 max-w-md mx-auto font-medium">
                            Your shipping protocol is currently restricted. You must pass all 10 diagnostic tests in the Quality Center before you can verify shipment.
                        </p>
                    </div>
                    <div className="pt-6">
                        <button
                            onClick={() => navigate('/test-checklist')}
                            className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 mx-auto hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30"
                        >
                            <ArrowLeft size={20} /> Back to Test Center
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-12 py-10">
                    <div className="space-y-4">
                        <div className="bg-emerald-100 p-8 rounded-full text-emerald-600 inline-block">
                            <Truck size={64} />
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Ready for Shipment</h1>
                        <p className="text-xl font-bold text-emerald-600 tracking-tight italic">Status: All 10 Protocols Verified via Hardening Phase</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        <ShipCard
                            icon={<Github size={24} />}
                            title="Push to Main"
                            text="Update production branch with verified build artifacts."
                            action="Execute Push"
                            primary
                        />
                        <ShipCard
                            icon={<Globe size={24} />}
                            title="Live Re-deploy"
                            text="Refresh edges with latest intelligence suite assets."
                            action="Trigger Build"
                        />
                    </div>

                    <div className="pt-10">
                        <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 max-w-2xl mx-auto text-left space-y-4">
                            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                <ShieldCheck size={20} className="text-primary" /> Verification Token
                            </h3>
                            <code className="block bg-slate-900 text-primary p-4 rounded-xl font-mono text-sm overflow-x-auto">
                                PRP-SHIP-GATEWAY-{Math.random().toString(36).substring(2, 10).toUpperCase()}-VERIFIED
                            </code>
                            <p className="text-xs text-slate-400 font-bold italic uppercase tracking-widest">
                                This token confirms that all {TOTAL_TESTS} tests passed at {new Date().toLocaleString()}.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ShipCard({ icon, title, text, action, primary }) {
    return (
        <div className={`p-8 rounded-[2.5rem] border text-left space-y-4 transition-all hover:-translate-y-2 cursor-pointer ${primary ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/20' : 'bg-white border-slate-200 text-slate-900 hover:border-primary/50'}`}>
            <div className={primary ? 'text-white' : 'text-primary'}>{icon}</div>
            <div>
                <h4 className="font-black text-xl">{title}</h4>
                <p className={`text-sm font-medium ${primary ? 'text-white/70' : 'text-slate-500'}`}>{text}</p>
            </div>
            <button className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${primary ? 'bg-white text-primary hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                {action}
            </button>
        </div>
    );
}

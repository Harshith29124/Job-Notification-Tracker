import { useNavigate } from 'react-router-dom';
import { Truck, Lock, ShieldCheck, ArrowLeft, Github, Globe } from 'lucide-react';

export default function ShipReady() {
    const navigate = useNavigate();

    const saved = localStorage.getItem('prp_test_checklist');
    const checkedItems = saved ? JSON.parse(saved) : {};
    const passedCount = Object.values(checkedItems).filter(Boolean).length;
    const TOTAL_TESTS = 10;
    const isLocked = passedCount < TOTAL_TESTS;

    return (
        <div className="space-y-12 py-6">
            {isLocked ? (
                <div className="bg-white border border-border p-20 text-center space-y-8 rounded">
                    <div className="relative inline-block">
                        <div className="bg-background p-10 rounded border border-border text-slate-300">
                            <Lock size={48} />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-accent text-white p-2 rounded border-2 border-white">
                            <ShieldCheck size={20} />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h2 className="heading-lg text-text-primary">Shipment Protocol Locked</h2>
                        <p className="text-slate-500 max-w-md mx-auto font-medium text-[16px]">
                            Gateway access restricted. You must complete all 10 diagnostic checkpoints in the Quality Assurance Center to authorize shipment.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/test-checklist')}
                        className="btn btn-primary px-10 h-[56px] text-sm uppercase tracking-widest"
                    >
                        Return to QA Center
                    </button>
                </div>
            ) : (
                <div className="space-y-12">
                    <div className="text-center space-y-3 border-b border-border pb-10">
                        <div className="bg-success/5 border border-success/20 p-6 rounded-full text-success inline-block mb-4">
                            <Truck size={40} />
                        </div>
                        <h2 className="heading-xl uppercase tracking-tighter text-text-primary">Authorized for Shipment</h2>
                        <p className="text-[18px] font-bold text-success italic tracking-tight uppercase">System Status: Integrity Verified</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <ShipCard
                            icon={<Github size={24} />}
                            title="Deploy to Production"
                            text="Execute final push to main branch with verified build artifacts."
                            action="Execute Push"
                            primary
                        />
                        <ShipCard
                            icon={<Globe size={24} />}
                            title="Edge Propagation"
                            text="Broadcast latest intelligence suite assets to global nodes."
                            action="Trigger Sync"
                        />
                    </div>

                    <div className="bg-white border border-border p-10 rounded shadow-none text-left space-y-6">
                        <h3 className="text-[16px] font-black text-text-primary flex items-center gap-3 uppercase tracking-widest">
                            <ShieldCheck size={18} className="text-accent" /> Shipment Verification Token
                        </h3>
                        <div className="bg-background border border-border p-6 rounded text-accent font-mono text-[18px] text-center tracking-widest uppercase">
                            PRP-AUTH-{Math.random().toString(36).substring(2, 12).toUpperCase()}
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold italic uppercase tracking-[0.2em] text-center">
                            Authorized with {TOTAL_TESTS} passing protocols at {new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

function ShipCard({ icon, title, text, action, primary }) {
    return (
        <div className={`p-10 rounded border text-left space-y-6 transition-all ${primary ? 'bg-white border-accent' : 'bg-white border-border hover:border-slate-400'}`}>
            <div className="text-accent">{icon}</div>
            <div className="space-y-2">
                <h4 className="text-[20px] font-serif font-black text-text-primary">{title}</h4>
                <p className="text-[14px] text-slate-500 font-medium leading-relaxed">{text}</p>
            </div>
            <button className={`w-full py-4 rounded font-black uppercase tracking-widest text-[11px] transition-all ${primary ? 'bg-accent text-white hover:brightness-90' : 'bg-white border border-border text-text-primary hover:bg-background'}`}>
                {action}
            </button>
        </div>
    );
}

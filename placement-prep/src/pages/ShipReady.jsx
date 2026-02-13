import { useNavigate } from 'react-router-dom';
import { Truck, CheckCircle2, ShieldAlert, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ShipReady() {
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('prp_qa_completed');
        const completed = saved ? JSON.parse(saved) : [];
        setIsVerified(completed.length === 5);
    }, []);

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                    <h2 className="heading-md uppercase">Shipment Gate</h2>
                    <p className="text-slate-500 font-medium text-sm">Final verification protocol before production authorization.</p>
                </div>
                <div className={`flex items-center gap-3 px-4 py-2 border ${isVerified ? 'bg-success/5 border-success/30 text-success' : 'bg-accent/5 border-accent/20 text-accent'}`}>
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{isVerified ? 'Auth Secured' : 'Auth Locked'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {!isVerified ? (
                    <div className="card-premium border-dashed py-32 text-center space-y-8">
                        <div className="w-24 h-24 bg-background border border-accent/20 flex items-center justify-center text-accent mx-auto">
                            <ShieldAlert size={48} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-[32px] font-serif font-black text-text-primary">Authorization Required</h3>
                            <p className="body-text text-sm mx-auto max-w-md">System state cannot be moved to production until all Quality Assurance protocols are finalized in the QA Center.</p>
                        </div>
                        <button
                            onClick={() => navigate('/test-checklist')}
                            className="btn btn-secondary !border-accent !text-accent px-12 h-[60px]"
                        >
                            Return to QA Center
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="card-premium space-y-8">
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-border pb-2">Technical Artifacts</h3>
                                <div className="space-y-6">
                                    <ArtifactItem label="Production Build" status="VERIFIED" />
                                    <ArtifactItem label="Asset Optimization" status="COMPLETE" />
                                    <ArtifactItem label="SEO Meta Payloads" status="INJECTED" />
                                </div>
                            </div>
                            <div className="card-premium space-y-8">
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-border pb-2">Platform Integrity</h3>
                                <div className="space-y-6">
                                    <ArtifactItem label="Responsive Grid" status="STABLE" />
                                    <ArtifactItem label="Color Palette" status="LOCKED" />
                                    <ArtifactItem label="Radius Conformity" status="4PX" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border-2 border-accent p-12 text-center space-y-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <Truck size={120} className="text-accent/5 -rotate-12 translate-x-12" />
                            </div>
                            <div className="space-y-4 relative z-10">
                                <h3 className="text-[48px] font-serif font-black text-text-primary leading-tight">Ready for Deployment.</h3>
                                <p className="body-text text-[18px] mx-auto text-slate-500 font-medium">The Placement Readiness Platform v1.2 is fully compliant with the KodNest Premium Build System.</p>
                            </div>
                            <div className="flex justify-center gap-6 relative z-10">
                                <button className="btn btn-primary px-16 h-[64px] text-[16px] uppercase tracking-widest">
                                    Final Production Ship <ArrowRight size={20} className="ml-3" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function ArtifactItem({ label, status }) {
    return (
        <div className="flex items-center justify-between p-4 bg-background border border-border">
            <span className="font-bold text-text-primary text-[14px] uppercase tracking-tight">{label}</span>
            <span className="text-[10px] font-black text-success uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={12} /> {status}
            </span>
        </div>
    );
}

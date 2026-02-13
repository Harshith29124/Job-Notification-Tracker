import { User, Mail, Shield, Award, Settings, LogOut } from 'lucide-react';

export default function Profile() {
    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                    <h2 className="heading-md uppercase">Candidate Profile</h2>
                    <p className="text-slate-500 font-medium text-sm">Strategic identity and performance metrics.</p>
                </div>
                <button className="btn btn-secondary flex items-center gap-2 text-[11px] uppercase tracking-widest text-accent">
                    <LogOut size={14} /> De-authenticate
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Basic Info */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="card-premium text-center">
                        <div className="w-24 h-24 bg-background border-2 border-accent rounded-full mx-auto mb-6 flex items-center justify-center text-accent">
                            <User size={48} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-[24px] font-serif font-black text-text-primary">Harshith</h3>
                        <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-1">Strategic Candidate</p>

                        <div className="mt-8 pt-8 border-t border-border flex justify-around">
                            <div className="text-center">
                                <div className="text-[20px] font-black text-text-primary">12</div>
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Analyses</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[20px] font-black text-text-primary">82%</div>
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg. Score</div>
                            </div>
                        </div>
                    </div>

                    <div className="card-premium">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-border pb-2 flex items-center gap-2">
                            <Award size={14} /> Recognition
                        </h4>
                        <ul className="space-y-4">
                            <Achievement icon="🏆" title="Elite Analyzer" text="10+ JDs processed." />
                            <Achievement icon="⚡" title="Quick Starter" text="First plan completed." />
                        </ul>
                    </div>
                </div>

                {/* Right: Configuration */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="card-premium">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8 border-b border-border pb-2 flex items-center gap-2">
                            <Shield size={14} /> Security Protocol
                        </h4>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-text-primary tracking-widest">Full Identity Name</label>
                                <input type="text" className="input-field font-bold" defaultValue="Harshith" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-text-primary tracking-widest">Authentication Email</label>
                                <input type="email" className="input-field font-bold" defaultValue="harshith@kodnest.audit" />
                            </div>
                            <button className="btn btn-primary px-10 h-[52px]">Update Credentials</button>
                        </div>
                    </div>

                    <div className="card-premium">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8 border-b border-border pb-2 flex items-center gap-2">
                            <Settings size={14} /> Local Logic Cache
                        </h4>
                        <div className="flex items-center justify-between p-6 bg-background border border-border">
                            <div>
                                <h5 className="font-bold text-text-primary text-sm">Clear Analysis History</h5>
                                <p className="text-xs text-slate-500 font-medium">Delete all local storage records of past JD audits.</p>
                            </div>
                            <button className="btn btn-secondary !border-accent/40 !text-accent text-[11px] px-6">Flush Cache</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Achievement({ icon, title, text }) {
    return (
        <div className="flex items-start gap-4 p-4 bg-background border border-border">
            <span className="text-2xl">{icon}</span>
            <div>
                <h5 className="font-bold text-text-primary text-[14px]">{title}</h5>
                <p className="text-[12px] text-slate-500 font-medium">{text}</p>
            </div>
        </div>
    );
}

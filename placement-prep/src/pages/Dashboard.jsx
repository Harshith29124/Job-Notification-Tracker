export default function Dashboard() {
    return (
        <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back, John!</h1>
            <p className="text-slate-500 mb-8">Here's your preparation overview for today.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard label="Coding Score" value="840" color="bg-primary" />
                <StatCard label="Mock Interviews" value="12" color="bg-indigo-500" />
                <StatCard label="Assessments" value="8" color="bg-emerald-500" />
                <StatCard label="Progress" value="+15%" color="bg-amber-500" />
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
                <div className="space-y-4 text-slate-500">
                    <p>• Completed "Two Sum" practice problem (10m ago)</p>
                    <p>• Started "Data Structures" assessment (1h ago)</p>
                    <p>• Viewed "Operating Systems" resource (3h ago)</p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, color }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-semibold mb-2">{label}</p>
            <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${color}`}></div>
                <p className="text-3xl font-black text-slate-900">{value}</p>
            </div>
        </div>
    );
}

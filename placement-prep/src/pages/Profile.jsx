export default function Profile() {
    return (
        <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">My Profile</h1>
            <p className="text-slate-500 mb-8">Manage your personal information and tracking preferences.</p>
            <div className="bg-white rounded-3xl p-12 border border-slate-200 border-dashed text-center">
                <p className="text-slate-400 font-medium italic">Profile details loading...</p>
            </div>
        </div>
    );
}

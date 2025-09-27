// Settings.jsx
export default function Settings() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Settings</h1>
      <div className="bg-black border border-white rounded-2xl shadow p-6 mb-8">
        <h2 className="font-bold mb-4 text-white">User Profile</h2>
        <div className="flex flex-col gap-4">
          <input type="text" placeholder="Name" className="border border-white rounded px-4 py-2 focus:outline-none bg-black text-white" />
          <input type="email" placeholder="Email" className="border border-white rounded px-4 py-2 focus:outline-none bg-black text-white" />
          <input type="password" placeholder="Change Password" className="border border-white rounded px-4 py-2 focus:outline-none bg-black text-white" />
        </div>
        <button className="mt-4 bg-white text-black rounded-2xl px-4 py-2 font-semibold hover:bg-gray-200 border border-white transition-all">Save</button>
      </div>
      <div className="bg-black border border-white rounded-2xl shadow p-6">
        <h2 className="font-bold mb-4 text-white">App Settings</h2>
        <div className="flex items-center gap-4 mb-4">
          <label className="font-semibold text-white">Dark Mode</label>
          <input type="checkbox" className="accent-white w-5 h-5" defaultChecked />
        </div>
        <div className="flex items-center gap-4">
          <label className="font-semibold text-white">Notifications</label>
          <input type="checkbox" className="accent-white w-5 h-5" />
        </div>
        <button className="mt-4 bg-white text-black rounded-2xl px-4 py-2 font-semibold hover:bg-gray-200 border border-white transition-all">Save</button>
      </div>
    </div>
  );
}
